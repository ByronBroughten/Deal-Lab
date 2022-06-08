import { useSectionsContext } from "../../sharedWithServer/stateClassHooks/useSections";
import { RegisterActor } from "../SectionActors/RegisterActor";

export function useRegisterActor(): RegisterActor {
  const { sections, setSections } = useSectionsContext();
  const { feId } = sections.onlyOneRawSection("register");
  return new RegisterActor({
    feId,
    setSections,
    sectionsShare: { sections },
  });
}
