import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import ThirdPartyEmailPassword from "supertokens-node/recipe/thirdpartyemailpassword";
import { constants } from "../client/src/App/Constants";
import { userPrepS } from "../routes/apiQueries/shared/DbSections/LoadedDbUser/userPrepS";

export function useSupertokensInit() {
  supertokens.init({
    framework: "express",
    supertokens: {
      connectionURI:
        "https://10c84041108411ed883e01b05b97929c-us-east-1.aws.supertokens.io:3573",
      apiKey: "9Fb5Qj2YNNoAbIAHDlvVRyg4IVoZU0",
    },
    appInfo: constants.superTokensAppInfo,
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

                  userPrepS.initUserInDb({
                    userId: id,
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
