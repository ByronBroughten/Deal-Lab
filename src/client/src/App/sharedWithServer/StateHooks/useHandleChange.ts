import { useSetterSections } from "./useSetterSections";

export function useHandleChange() {
  const setterSections = useSetterSections();
  return (event: any) => setterSections.handleChange(event);
}
