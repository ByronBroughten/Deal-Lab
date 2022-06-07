import { useSectionsContext } from "../../sharedWithServer/stateClassHooks/useSections";
import { LoginActor } from "../SectionActors/LoginActor";

export function useLoginActor(): LoginActor {
  const { sections, setSections } = useSectionsContext();
  const { feId } = sections.onlyOneRawSection("login");
  return new LoginActor({
    feId,
    setSections,
    sectionsShare: { sections },
  });
}
