import { QuerierSolverSections } from "../../modules/SectionActors/QuerierSolverSections";
import { useDispatchAndSave } from "./useAction";
import { useSectionsContext } from "./useSections";
import { SectionsAction } from "./useSections/sectionsReducer";

interface TrySaveAttempt {
  type: "trySaveAttempt";
  feId: string;
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
    const solverSections = QuerierSolverSections.init({
      sectionsShare: { sections },
    });
    switch (action.type) {
      case "trySaveAttempt": {
        const success = await solverSections.feStore.trySaveAttempt(
          action.feId
        );
        dispatch({
          type: "finishSave",
          success,
          feId: action.feId,
        });
        break;
      }
    }
  };
}
