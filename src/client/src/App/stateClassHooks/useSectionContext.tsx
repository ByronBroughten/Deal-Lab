import React from "react";
import { FeSectionInfo } from "../../sharedWithServer/SectionInfos/FeInfo";
import { react } from "../utils/react";

export const [SectionInfoContext, useSectionInfoContext] =
  react.makeContextUseContext("SectionInfoContext", {} as FeSectionInfo);

interface Props extends FeSectionInfo {
  children: React.ReactNode;
}
export function SectionInfoContextProvider({ children, ...rest }: Props) {
  return (
    <SectionInfoContext.Provider value={rest}>
      {children}
    </SectionInfoContext.Provider>
  );
}
