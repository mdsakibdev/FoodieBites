/** User-facing messages for OAuth callback errors returned in `?error=`. */
export function oauthErrorMessage(code: string | null): string | null {
  if (!code) return null;

  switch (code) {
    case "access_denied":
      return "Google sign-in was cancelled.";
    case "account_not_linked":
      return "An account with this email already exists. Sign in with your password, then connect Google again.";
    case "account_already_linked_to_different_user":
      return "That Google account is already linked to a different FoodieBites account.";
    case "email_does_not_match":
      return "The Google email does not match your existing account.";
    case "email_not_found":
      return "Google did not share an email address with FoodieBites.";
    default:
      return "Google sign-in could not be completed. Please try again.";
  }
}
