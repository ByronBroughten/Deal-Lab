import supertokens from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { constants } from "../Constants";

export function initSupertokens(): void {
  supertokens.init({
    appInfo: constants.superTokens.appInfo,
    recipeList: [
      // EmailPassword.init(), Session.init()
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
      Session.init(),
    ],
  });
}
