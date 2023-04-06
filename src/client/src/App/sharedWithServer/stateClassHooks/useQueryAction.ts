import { QuerierSections } from "../../modules/SectionActors/QuerierSections";
import { useDispatchAndSave } from "./useAction";
import { useSectionsContext } from "./useSections";
import { SectionsAction } from "./useSections/sectionsReducer";

interface TrySaveAttempt {
  type: "trySave";
}
type QueryAction = TrySaveAttempt;
type QueryActionName = QueryAction["type"];

export type SectionActionsTypeMap = {
  [ST in QueryActionName]: Extract<SectionsAction, { type: ST }>;
};
type ActionPropsMap = {
  [AN in QueryActionName]: Omit<SectionActionsTypeMap[AN], "type">;
};
export type ActionProps<T extends QueryActionName> = ActionPropsMap[T];

export function useQueryAction() {
  const { sections } = useSectionsContext();
  const dispatch = useDispatchAndSave();

  return async (action: QueryAction) => {
    const querierSections = QuerierSections.init({
      sectionsShare: { sections },
    });
    switch (action.type) {
      case "trySave": {
        const success = await querierSections.feStore.trySave();
        dispatch({
          type: "finishSave",
          success,
        });
        break;
      }
    }
  };
}
