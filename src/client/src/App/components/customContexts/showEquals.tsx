import { makeContextUseContext } from "../../utils/react";

type ShowEqualsStatus = "showAll" | "showPure";

const [ShowEqualsContext, use] = makeContextUseContext(
  "ShowEqualsContext",
  "showAll" as ShowEqualsStatus
);

export const useShowEqualsContext = use;

interface Props {
  showEqualsStatus: ShowEqualsStatus;
  children: React.ReactNode;
}
export function ShowEqualsProvider({ children, showEqualsStatus }: Props) {
  return (
    <ShowEqualsContext.Provider value={showEqualsStatus}>
      {children}
    </ShowEqualsContext.Provider>
  );
}
