import Session from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

export const authS = {
  get sessionExists(): Promise<boolean> {
    return Session.doesSessionExist();
  },
  get authId(): Promise<string> {
    return Session.getUserId();
  },
  async endSession(): Promise<void> {
    return await signOut();
  },
};
