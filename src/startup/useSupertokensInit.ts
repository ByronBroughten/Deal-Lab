import config from "config";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { constants } from "../client/src/App/Constants";
import { userPrepS } from "../routes/apiQueries/shared/DbSections/LoadedDbUser/userPrepS";

export function useSupertokensInit() {
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
          formFields: [
            {
              id: "userName",
            },
          ],
        },
        override: {
          apis: (original) => {
            return {
              ...original,
              emailPasswordSignUpPOST: async function (input) {
                if (!original.emailPasswordSignUpPOST) {
                  throw Error("This should't happen.");
                }
                const res = await original.emailPasswordSignUpPOST(input);
                if (res.status === "OK") {
                  const { id, email, timeJoined } = res.user;
                  const { formFields } = input;
                  const nameField = formFields.find(
                    (field) => field.id === "userName"
                  );

                  const userName =
                    nameField && nameField.value ? nameField.value : "User";

                  await userPrepS.initUserInDb({
                    authId: id,
                    email,
                    timeJoined,
                    userName,
                  });
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
