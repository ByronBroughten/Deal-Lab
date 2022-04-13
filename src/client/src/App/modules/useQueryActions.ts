import { useAuthQueryActions } from "./useQueryActions/useAuthQueryActions";
import { useSectionQueryActions } from "./useQueryActions/useSectionQueryActions";

export function useQueryActions() {
  const authQueryActions = useAuthQueryActions();
  const sectionQueryActions = useSectionQueryActions();
  return {
    ...authQueryActions,
    ...sectionQueryActions,
  };
}
