import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { injectStore } from "@/utils/apiHandle";

import authReducer, { logout } from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import recentReducer from "./slices/recentSlice";
import orderReducer, { resetOrders } from "./slices/orderSlice";
import supportReducer from "./slices/supportSlice";
import uiReducer from "./slices/uiSlice";

/** localStorage in the browser, a no-op on the server (SSR/prerender). */
function createStorage() {
  if (typeof window === "undefined") {
    return {
      getItem: () => Promise.resolve(null),
      setItem: (_k, v) => Promise.resolve(v),
      removeItem: () => Promise.resolve(),
    };
  }
  return createWebStorage("local");
}
const storage = createStorage();

// auth and cart persist only their data fields, never request statuses.
const authPersist = { key: "oriel.auth", storage, whitelist: ["user_data", "accessToken", "user_auth"] };
const cartPersist = { key: "oriel.cart", storage, whitelist: ["items", "promo", "shippingMethod"] };

const rootReducer = combineReducers({
  auth: persistReducer(authPersist, authReducer),
  cart: persistReducer(cartPersist, cartReducer),
  wishlist: wishlistReducer,
  recent: recentReducer,
  order: orderReducer,
  support: supportReducer,
  ui: uiReducer,
});

const rootPersist = { key: "oriel", storage, version: 1, whitelist: ["wishlist", "recent"] };

export function makeStore() {
  const store = configureStore({
    reducer: persistReducer(rootPersist, rootReducer),
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
      }),
    devTools: process.env.NODE_ENV !== "production",
  });

  injectStore(store, () => {
    store.dispatch(logout());
    store.dispatch(resetOrders());
    if (typeof window !== "undefined") window.location.replace("/login?expired=1");
  });

  return store;
}

let clientStore = null;

/**
 * One store per browser tab (a fresh one per server render). A singleton on the
 * client guarantees the API interceptor and the React tree share the same store,
 * even when React runs initialisers twice in development.
 */
export function getStore() {
  if (typeof window === "undefined") return makeStore();
  if (!clientStore) clientStore = makeStore();
  return clientStore;
}

export const selectHydrated = (s) => Boolean(s._persist?.rehydrated && s.cart?._persist?.rehydrated);
