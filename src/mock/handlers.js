import { readDb, writeDb } from "./db";
import { computeTotals } from "@/lib/pricing";

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const publicUser = ({ password, ...user }) => user;

const makeToken = (userId) => `demo.${btoa(userId)}.${Math.random().toString(36).slice(2, 10)}`;

function userFromToken(headers) {
  const auth = headers?.Authorization || headers?.authorization || "";
  const token = String(auth).replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const userId = atob(token.split(".")[1] || "");
    return readDb().users.find((u) => u._id === userId) || null;
  } catch {
    return null;
  }
}

function requireUser(headers) {
  const user = userFromToken(headers);
  if (!user) throw new HttpError(401, "Your session has expired. Please sign in again.");
  return user;
}

const nextOrderId = () => `OR-${Math.floor(26000 + Math.random() * 9000)}`;

/** Route table: "METHOD /path/:param" → handler({ body, params, query, headers }) */
export const routes = {
  "POST /auth/login": ({ body }) => {
    const email = String(body?.email || "").trim().toLowerCase();
    const user = readDb().users.find((u) => u.email.toLowerCase() === email);
    if (!user || user.password !== body?.password) {
      throw new HttpError(400, "That email and password combination is not recognised.");
    }
    return { message: "Signed in", data: { user: publicUser(user), accessToken: makeToken(user._id) } };
  },

  "POST /auth/register": ({ body }) => {
    const db = readDb();
    const email = String(body?.email || "").trim().toLowerCase();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      throw new HttpError(409, "An account with this email already exists. Try signing in instead.");
    }
    const user = {
      _id: `u_${Date.now().toString(36)}`,
      firstName: body.firstName,
      lastName: body.lastName,
      email,
      password: body.password,
      phone: "",
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    writeDb({ ...db, users: [...db.users, user] });
    return { message: "Account created", data: { user: publicUser(user), accessToken: makeToken(user._id) } };
  },

  "GET /auth/me": ({ headers }) => ({ data: publicUser(requireUser(headers)) }),

  "PUT /auth/update-profile": ({ body, headers }) => {
    const user = requireUser(headers);
    const db = readDb();
    const updated = { ...user, firstName: body.firstName, lastName: body.lastName, phone: body.phone || "" };
    writeDb({ ...db, users: db.users.map((u) => (u._id === user._id ? updated : u)) });
    return { message: "Profile updated", data: publicUser(updated) };
  },

  "GET /order/get-all": ({ headers, query }) => {
    const user = requireUser(headers);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const all = readDb()
      .orders.filter((o) => o.userId === user._id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return {
      data: all.slice((page - 1) * limit, page * limit),
      pagination: { page, limit, total: all.length, totalPages: Math.max(1, Math.ceil(all.length / limit)) },
    };
  },

  "GET /order/get/:id": ({ params, headers }) => {
    const user = userFromToken(headers);
    const order = readDb().orders.find((o) => o._id === params.id);
    // Guest orders are viewable by id (as with a confirmation link); account orders need their owner.
    if (!order || (order.userId && order.userId !== user?._id)) {
      throw new HttpError(404, "We could not find that order.");
    }
    return { data: order };
  },

  "POST /order/create": ({ body, headers }) => {
    const user = userFromToken(headers);
    const db = readDb();
    if (!body?.items?.length) throw new HttpError(400, "Your bag is empty.");
    const promo = body.promoCode
      ? db.promoCodes.find((p) => p.code === String(body.promoCode).toUpperCase())
      : null;
    const totals = computeTotals({ items: body.items, shippingMethod: body.shippingMethod, promo });
    const now = new Date().toISOString();
    const order = {
      _id: nextOrderId(),
      userId: user?._id || null,
      email: body.email,
      status: "processing",
      createdAt: now,
      items: body.items.map(({ productId, slug, name, image, variant, price, quantity }) => ({
        productId, slug, name, image, variant, price, quantity,
      })),
      shippingMethod: body.shippingMethod,
      shippingAddress: body.shippingAddress,
      payment: { method: body.paymentMethod, last4: body.cardLast4 || null, simulated: true },
      promoCode: promo?.code || null,
      totals,
      timeline: [{ status: "processing", date: now }],
    };
    writeDb({ ...db, orders: [order, ...db.orders] });
    return { message: "Order placed (simulated)", data: order };
  },

  "POST /promo/validate": ({ body }) => {
    const code = String(body?.code || "").trim().toUpperCase();
    const promo = readDb().promoCodes.find((p) => p.code === code);
    if (!promo) throw new HttpError(404, "That code is not valid.");
    if ((body.subtotal || 0) < promo.minSubtotal) {
      throw new HttpError(400, `This code needs a subtotal of at least $${promo.minSubtotal}.`);
    }
    return { message: `${promo.code} applied`, data: promo };
  },

  "POST /contact/create": ({ body }) => {
    const db = readDb();
    const message = { ...body, _id: `msg_${Date.now()}`, createdAt: new Date().toISOString() };
    writeDb({ ...db, messages: [...db.messages, message] });
    return { message: "Message received", data: { _id: message._id } };
  },

  "POST /newsletter/subscribe": ({ body }) => {
    const db = readDb();
    const email = String(body?.email || "").toLowerCase();
    if (db.subscribers.includes(email)) {
      return { message: "You are already on the list. Thank you!", data: { email } };
    }
    writeDb({ ...db, subscribers: [...db.subscribers, email] });
    return { message: "You are subscribed. Welcome to the studio letter.", data: { email } };
  },
};

/** Finds the handler for a method + path, extracting :params. */
export function matchRoute(method, path) {
  for (const [key, handler] of Object.entries(routes)) {
    const [m, pattern] = key.split(" ");
    if (m !== method) continue;
    const names = [];
    const regex = new RegExp(
      `^${pattern.replace(/:([a-zA-Z]+)/g, (_, n) => {
        names.push(n);
        return "([^/]+)";
      })}$`
    );
    const match = path.match(regex);
    if (match) {
      const params = Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(match[i + 1])]));
      return { handler, params };
    }
  }
  return null;
}
