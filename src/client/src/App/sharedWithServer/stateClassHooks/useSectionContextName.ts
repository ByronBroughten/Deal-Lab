import { react } from "../../utils/react";
import { SectionPathContextName } from "../SectionsMeta/sectionPathContexts";

export const [SectionPathContext, useSectionContextName] =
  react.makeContextUseContext("SectionContext", {} as SectionPathContextName);
