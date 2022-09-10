import config from "config";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { constants } from "../client/src/App/Constants";
import { Str } from "../client/src/App/sharedWithServer/utils/Str";
import { DbUser } from "../routes/apiQueries/apiQueriesShared/DbSections/DbUser";
import {
  getSignUpData,
  userPrepS,
} from "../routes/apiQueries/apiQueriesShared/DbSections/LoadedDbUser/userPrepS";

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
        signUpFeature: {
          formFields: [{ id: "userName" }],
        },
        override: {
          apis: (original) => {
            return {
              ...original,

              emailPasswordSignInPOST: async function (input) {
                if (!original.emailPasswordSignInPOST) {
                  throw Error("No original.emailPasswordSingInPOST");
                }
                const res = await original.emailPasswordSignInPOST(input);
                if (res.status === "OK") {
                  const signUpData = getSignUpData(res.user);
                  const userExists = await DbUser.existsBy(
                    "authId",
                    signUpData.authId
                  );
                  if (!userExists) {
                    const userName = Str.emailBeforeAt(signUpData.email);
                    await userPrepS.initUserInDb({
                      ...signUpData,
                      userName,
                    });
                  }
                }
                return res;
              },
              emailPasswordSignUpPOST: async function (input) {
                if (!original.emailPasswordSignUpPOST) {
                  throw Error("No original.emailPasswordSingUpPOST");
                }
                const res = await original.emailPasswordSignUpPOST(input);
                if (res.status === "OK") {
                  const signUpData = getSignUpData(res.user);
                  const { formFields } = input;
                  const nameField = formFields.find(
                    (field) => field.id === "userName"
                  );

                  const userName =
                    nameField && nameField.value ? nameField.value : "User";

                  const userExists = await DbUser.existsBy(
                    "authId",
                    signUpData.authId
                  );
                  if (!userExists) {
                    await userPrepS.initUserInDb({
                      ...signUpData,
                      userName,
                    });
                  }
                }
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
