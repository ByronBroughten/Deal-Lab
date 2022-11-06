import SuperTokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword, {
  Google,
} from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "../Constants";

export function initSupertokens(): void {
  SuperTokens.init({
    appInfo: constants.superTokens.appInfo,
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
            return constants.auth.successUrl;
          }
        },
        signInAndUpFeature: {
          providers: [Google.init()],
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
