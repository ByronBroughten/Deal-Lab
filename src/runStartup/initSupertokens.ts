import config from "config";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { constants } from "../client/src/App/Constants";
const { Google, Facebook, Apple } = ThirdPartyEmailPassword;

export function initSupertokens() {
  supertokens.init({
    framework: "express",
    supertokens: {
      connectionURI: config.get("supertokensCoreConnectionUri"),
      apiKey: config.get("supertokensCoreApiKey"),
    },
    appInfo: constants.superTokens.appInfo,
    recipeList: [
      ThirdPartyEmailPassword.init({
        providers: [
          Google({
            clientId: config.get("googleClientId"),
            clientSecret: config.get("googleClientSecret"),
          }),
          Facebook({
            clientId: config.get("facebookClientId"),
            clientSecret: config.get("facebookClientSecret"),
          }),
          // Apple({
          //   clientId: config.get("appleClientId"),
          //   clientSecret: {
          //     keyId: config.get("appleKeyId"),
          //     privateKey: config.get("applePrivateKey"),
          //     teamId: config.get("appleTeamId")
          //   }

          // })
        ],
        signUpFeature: {
          formFields: [{ id: "userName" }],
        },
        override: {
          apis: (original) => {
            return {
              ...original,
              thirdPartySignInUpPOST: async function (input) {
                if (!original.thirdPartySignInUpPOST) {
                  throw Error("No original.emailPasswordSingInPOST");
                }
                const res = await original.thirdPartySignInUpPOST(input);
                return res;
              },
              emailPasswordSignInPOST: async function (input) {
                if (!original.emailPasswordSignInPOST) {
                  throw Error("No original.emailPasswordSingInPOST");
                }
                const res = await original.emailPasswordSignInPOST(input);
                return res;
              },
              emailPasswordSignUpPOST: async function (input) {
                if (!original.emailPasswordSignUpPOST) {
                  throw Error("No original.emailPasswordSingUpPOST");
                }
                const res = await original.emailPasswordSignUpPOST(input);
                return res;
              },
            };
          },
        },
      }),
      Session.init(),
    ],
  });
}
