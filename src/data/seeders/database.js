import { users } from "../seed/users";
import { orders } from "../seed/orders";
import { promoCodes } from "../seed/promotions";

/** Bump when the seed shape changes so browsers re-seed their demo database. */
export const MOCK_DB_VERSION = 3;

/** Initial state of the simulated backend database (users, orders, messages). */
export function seedDatabase() {
  return {
    version: MOCK_DB_VERSION,
    users: structuredClone(users),
    orders: structuredClone(orders),
    promoCodes: structuredClone(promoCodes),
    messages: [],
    subscribers: [],
  };
}
