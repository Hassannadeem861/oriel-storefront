/**
 * Demo accounts for the simulated API. Never use real credentials here.
 * The password is shown on the login page so reviewers can explore the account area.
 */
export const DEMO_CREDENTIALS = {
  email: "demo@oriel.store",
  password: "demo1234",
};

export const users = [
  {
    _id: "u_demo",
    firstName: "Alex",
    lastName: "Morgan",
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    phone: "+1 415 555 0136",
    createdAt: "2025-02-14T10:00:00.000Z",
    addresses: [
      {
        id: "addr_1",
        label: "Home",
        firstName: "Alex",
        lastName: "Morgan",
        line1: "220 Valencia Street",
        line2: "Apt 4",
        city: "San Francisco",
        region: "CA",
        postalCode: "94103",
        country: "US",
        isDefault: true,
      },
    ],
  },
];
