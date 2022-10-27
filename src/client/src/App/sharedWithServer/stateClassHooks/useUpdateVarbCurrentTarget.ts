import { useSetterSections } from "./useSetterSections";

export function useUpdateVarbCurrentTarget() {
  const setterSections = useSetterSections();
  return (event: any) => setterSections.updateVarbCurrentTarget(event);
}
