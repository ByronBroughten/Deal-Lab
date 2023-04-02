import { react } from "../../utils/react";

const [IdOfSectionToSaveContext, useThis] = react.makeContextUseContext(
  "IdOfSectionToSaveContext",
  "" as string
);

export const useIdOfSectionToSave = useThis;

interface Props {
  sectionId: string;
  children: React.ReactNode;
}
export function IdOfSectionToSaveProvider({ children, sectionId }: Props) {
  return (
    <IdOfSectionToSaveContext.Provider value={sectionId}>
      {children}
    </IdOfSectionToSaveContext.Provider>
  );
}
