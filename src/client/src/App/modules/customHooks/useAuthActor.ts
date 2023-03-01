import Session from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

export const authS = {
  get sessionExists(): Promise<boolean> {
    return Session.doesSessionExist();
  },
  // async sessionExists(): Promise<boolean> {
  //   if (await Session.doesSessionExist()) {
  //     const { isVerified } = await isEmailVerified();
  //     return isVerified;
  //   } else return false;
  // }
  get authId(): Promise<string> {
    return Session.getUserId();
  },
  async endSession(): Promise<void> {
    return await signOut();
  },
};
