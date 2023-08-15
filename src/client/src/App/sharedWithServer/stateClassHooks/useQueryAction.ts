import { unstable_batchedUpdates } from "react-dom";
import { useGoToPage } from "../../components/customHooks/useGoToPage";
import { QuerierSections } from "../../modules/SectionActors/QuerierSections";
import { userTokenS } from "../../modules/services/userTokenS";
import { makeReq } from "../apiQueriesShared/makeReqAndRes";
import { authS } from "./../../modules/customHooks/authS";
import { useDispatchAndSave } from "./useAction";
import { useGetterSections } from "./useGetterSections";
import { StateAction } from "./useSections/sectionsReducer";

const queryActionNames = [
  "updateSubscriptionData",
  "logout",
  "loadUserData",
  "trySave",
  "showArchivedDeals",
] as const;

type QueryActionName = (typeof queryActionNames)[number];
type DefaultActionMap = {
  [AN in QueryActionName]: {
    type: AN;
  };
};

type QueryAction = DefaultActionMap[QueryActionName];

type QueryActionsMap = {
  [ST in QueryActionName]: Extract<StateAction, { type: ST }>;
};
type ActionPropsMap = {
  [AN in QueryActionName]: Omit<QueryActionsMap[AN], "type">;
};
export type ActionProps<T extends QueryActionName> = ActionPropsMap[T];

export type DispatchQueryAction = (action: QueryAction) => Promise<void>;
export function useQueryAction() {
  const getterSections = useGetterSections();
  const sections = getterSections.stateSections;

  const dispatch = useDispatchAndSave();
  const goToAccountPage = useGoToPage("account");
  const goToAuthPage = useGoToPage("auth");

  return async (action: QueryAction) => {
    const querierSections = QuerierSections.init({
      sectionsShare: { sections },
    });
    const { apiQueries } = querierSections;
    let success: boolean = true;
    switch (action.type) {
      case "loadUserData": {
        try {
          const res = await apiQueries.getUserData(makeReq({}));
          userTokenS.setTokenFromHeaders(res.headers);
          unstable_batchedUpdates(async () => {
            dispatch({
              type: "loadUserData",
              userData: res.data,
            });
            goToAccountPage();
          });
        } catch (error) {
          setTimeout(() => dispatch({ type: "incrementGetUserDataTry" }), 3000);
        }
        break;
      }
      case "logout": {
        userTokenS.removeUserAuthDataToken();
        await authS.endSession();
        unstable_batchedUpdates(() => {
          dispatch({
            type: "resetSelfToDefault",
            ...getterSections.onlyFeInfo("main"),
          });
          goToAuthPage();
        });
        break;
      }
      case "updateSubscriptionData": {
        const { headers, data } = await apiQueries.getSubscriptionData(
          makeReq({})
        );
        userTokenS.setTokenFromHeaders(headers);
        dispatch({
          type: "updateValues",
          ...getterSections.oneAndOnly("feStore").feInfo,
          values: {
            labSubscription: data.labSubscription,
            labSubscriptionExp: data.labSubscriptionExp,
          },
        });
        break;
      }
      case "trySave": {
        try {
          success = await querierSections.feStore.trySave();
          dispatch({
            type: "finishSave",
            success,
          });
        } catch (error) {
          dispatch({
            type: "finishSave",
            success: false,
          });
          throw error;
        }
        break;
      }
      case "showArchivedDeals": {
        const { main } = getterSections;
        const session = main.onlyChild("sessionStore");
        if (session.valueNext("archivedAreLoaded")) {
          dispatch({
            type: "updateValue",
            ...session.varbInfo("showArchivedDeals"),
            value: true,
          });
        } else {
          const res = await apiQueries.getArchivedDeals(makeReq({}));
          dispatch({
            type: "loadAndShowArchivedDeals",
            archivedDeals: res.data,
          });
        }
      }
    }
  };
}
