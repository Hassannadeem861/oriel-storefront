"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { getStore } from "./store";

/**
 * One store per browser session (and per request on the server).
 * Persistence starts after mount, so server HTML and the first client render
 * match; persisted data (cart, wishlist, session) streams in right after.
 * Components use `useHydrated()` to show skeletons until then.
 */
export default function StoreProvider({ children }) {
  const [store] = useState(getStore);

  useEffect(() => {
    const persistor = persistStore(store);
    return () => persistor.pause();
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
