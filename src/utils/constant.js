/** Thunk type strings, "domain/action" style. Every key used by a service must exist here. */
export const typeConstants = {
  // auth
  LOGIN: "auth/login",
  REGISTER: "auth/register",
  GET_PROFILE: "auth/getProfile",
  UPDATE_PROFILE: "auth/updateProfile",
  // orders
  GET_ORDERS: "order/getOrders",
  GET_ORDER: "order/getOrder",
  CREATE_ORDER: "order/createOrder",
  // cart
  APPLY_PROMO: "cart/applyPromo",
  // support
  SEND_CONTACT: "support/sendContact",
  SUBSCRIBE_NEWSLETTER: "support/subscribeNewsletter",
};
