import config from "config";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { DbUserService } from "../DbUserService";
import { getSignUpData, initUserInDb } from "../DbUserService/userPrepS";
import { constants } from "../client/src/App/Constants";
import { Str } from "../client/src/App/sharedWithServer/utils/Str";
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
                // if (res.status === "OK") {
                //   await finishSignIn(res.user);
                // }
                return res;
              },
              emailPasswordSignInPOST: async function (input) {
                if (!original.emailPasswordSignInPOST) {
                  throw Error("No original.emailPasswordSingInPOST");
                }
                const res = await original.emailPasswordSignInPOST(input);
                // if (res.status === "OK") {
                //   await finishSignIn(res.user, input.formFields);
                // }
                return res;
              },
              emailPasswordSignUpPOST: async function (input) {
                if (!original.emailPasswordSignUpPOST) {
                  throw Error("No original.emailPasswordSingUpPOST");
                }
                const res = await original.emailPasswordSignUpPOST(input);
                // if (res.status === "OK") {
                //   await finishSignIn(res.user, input.formFields);
                // }
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

type FormFields = {
  id: string;
  value: string;
}[];

async function finishSignIn(
  stUser: ThirdPartyEmailPassword.User,
  formFields?: FormFields
) {
  const signUpData = getSignUpData(stUser);
  const userExists = await DbUserService.existsBy("authId", signUpData.authId);
  if (!userExists) {
    const userName = getUserName(stUser.email, formFields);
    await initUserInDb({
      ...signUpData,
      userName,
    });
  }
}

function getUserName(email: string, formFields?: FormFields) {
  if (formFields) {
    const userNameFromFields = userNameFromForm(formFields);
    if (userNameFromFields) return userNameFromFields;
  }
  return Str.emailBeforeAt(email);
}

function userNameFromForm(formFields: FormFields): string {
  const nameField = formFields.find((field) => field.id === "userName");
  return nameField ? nameField.value : "";
}
