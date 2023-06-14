import { ConfirmationDialogueProvider } from "./general/ConfirmationDialogueProvider";
import { InfoModalProvider } from "./general/InfoModalProvider";
import { VarbSelectModalProvider } from "./general/VarbSelectModalProvider";

type Props = { children: React.ReactNode };
export function Modals({ children }: Props) {
  return (
    <VarbSelectModalProvider>
      <InfoModalProvider>
        <ConfirmationDialogueProvider>{children}</ConfirmationDialogueProvider>
      </InfoModalProvider>
    </VarbSelectModalProvider>
  );
}
