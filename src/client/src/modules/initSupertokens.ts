import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword, {
  Facebook,
  Google,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constant } from "../sharedWithServer/Constants";

export function initSupertokens(): void {
  SuperTokens.init({
    appInfo: constant("superTokens").appInfo,
    recipeList: [
      Session.init(),
      ThirdPartyEmailPassword.init({
        override: {
          functions(original) {
            return {
              ...original,
            };
          },
        },
        getRedirectionURL: async (context) => {
          if (context.action === "SUCCESS") {
            return constant("auth").successUrl;
          }
        },
        signInAndUpFeature: {
          providers: [Google.init(), Facebook.init()],
          signUpForm: {
            formFields: [
              {
                id: "userName",
                label: "Name",
                placeholder: "What should we call you?",
              },
            ],
          },
        },
        emailVerificationFeature: {
          mode: "REQUIRED",
        },
      }),
    ],
  });
}
