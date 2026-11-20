import AccountOverview from "@/components/account/AccountOverview";

export const metadata = { title: "Account overview" };

// Private, auth-gated page rendered client-side after the session is restored,
// so it is opted out of instant-navigation validation.
export const instant = false;

export default function AccountPage() {
  return <AccountOverview />;
}
