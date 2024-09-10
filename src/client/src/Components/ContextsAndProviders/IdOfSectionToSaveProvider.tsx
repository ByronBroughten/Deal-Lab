import { react } from "../../modules/utils/react";

const [IdOfSectionToSaveContext, useThis] = react.makeContextUseContext(
  "IdOfSectionToSaveContext",
  "" as string
);

export const useIdOfSectionToSave = useThis;

interface Props {
  storeId: string;
  children: React.ReactNode;
}
export function IdOfSectionToSaveProvider({ children, storeId }: Props) {
  return (
    <IdOfSectionToSaveContext.Provider value={storeId}>
      {children}
    </IdOfSectionToSaveContext.Provider>
  );
}
