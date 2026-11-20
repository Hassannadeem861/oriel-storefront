/**
 * Normalises any thrown value into a user-facing message.
 * Returns null for form validation errors, which are shown inline instead.
 */
export function getErrorMessage(err) {
  if (!err) return null;
  if (err?.name === "ZodError" || err?.errorFields) return null;
  if (typeof err === "string") return err;
  return err?.response?.data?.message || err?.message || "Something went wrong. Please try again.";
}
