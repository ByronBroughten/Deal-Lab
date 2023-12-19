import { SectionPathContextName } from "../../sharedWithServer/sectionPaths/sectionPathContexts";
import { react } from "../utils/react";

export const [SectionPathContext, useSectionContextName] =
  react.makeContextUseContext(
    "SectionContextName",
    "" as SectionPathContextName
  );
