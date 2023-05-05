import { DealModeOrMixed } from "../../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { makeContextUseContext } from "../../../utils/react";

const [DealModeContext, use] = makeContextUseContext(
  "DealModeContext",
  "mixed" as DealModeOrMixed
);

export const useDealModeContext = use;

interface Props {
  dealMode: DealModeOrMixed;
  children: React.ReactNode;
}
export function DealModeProvider({ children, dealMode }: Props) {
  return (
    <DealModeContext.Provider value={dealMode}>
      {children}
    </DealModeContext.Provider>
  );
}
