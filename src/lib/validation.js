import { z } from "zod";

/** Shared Zod schemas: one definition for every form that collects the same data. */
const email = z.string().trim().min(1, "Enter your email address").email("Enter a valid email address");
const name = (label) => z.string().trim().min(1, `Enter your ${label}`).max(60, "That looks too long");

export const newsletterSchema = z.object({ email });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z
  .object({
    firstName: name("first name"),
    lastName: name("last name"),
    email,
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { error: "Please accept the terms to continue" }),
    marketing: z.boolean().optional(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const profileSchema = z.object({
  firstName: name("first name"),
  lastName: name("last name"),
  phone: z.string().trim().max(24, "That looks too long").optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: name("name"),
  email,
  topic: z.enum(["order", "product", "returns", "wholesale", "other"], { error: "Choose a topic" }),
  orderNumber: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(20, "Please tell us a little more (20 characters minimum)").max(2000),
});

const digits = (v) => v.replace(/\D/g, "");

/** Luhn check: catches typos in card numbers (demo only, nothing is charged). */
function luhn(value) {
  const d = digits(value);
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return d.length >= 13 && sum % 10 === 0;
}

export const checkoutSchema = z
  .object({
    email,
    firstName: name("first name"),
    lastName: name("last name"),
    line1: z.string().trim().min(3, "Enter your street address"),
    line2: z.string().trim().optional().or(z.literal("")),
    city: z.string().trim().min(2, "Enter your city"),
    region: z.string().trim().optional().or(z.literal("")),
    postalCode: z.string().trim().min(3, "Enter your postal code").max(12, "That looks too long"),
    country: z.string().min(2, "Choose a country"),
    phone: z.string().trim().min(6, "Enter a phone number for the courier"),
    shippingMethod: z.enum(["standard", "express"]),
    paymentMethod: z.enum(["card", "paypal"]),
    cardName: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.paymentMethod !== "card") return;
    if (!v.cardName?.trim()) ctx.addIssue({ code: "custom", path: ["cardName"], message: "Enter the name on the card" });
    if (!luhn(v.cardNumber || "")) ctx.addIssue({ code: "custom", path: ["cardNumber"], message: "Enter a valid card number (try 4242 4242 4242 4242)" });
    const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v.cardExpiry || "");
    const valid = m && Number(m[1]) >= 1 && Number(m[1]) <= 12 && Number(`20${m[2]}`) * 12 + Number(m[1]) >= 2026 * 12 + 11;
    if (!valid) ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "Use MM / YY with a future date" });
    if (!/^\d{3,4}$/.test(v.cardCvc || "")) ctx.addIssue({ code: "custom", path: ["cardCvc"], message: "3 or 4 digits" });
  });
