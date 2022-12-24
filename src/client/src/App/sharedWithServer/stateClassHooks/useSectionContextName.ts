import { react } from "../../utils/react";
import { SectionPathContextName } from "../SectionsMeta/sectionPathContexts";

export const [SectionPathContext, useSectionContextName] =
  react.makeContextUseContext(
    "SectionContextName",
    "" as SectionPathContextName
  );
