import { ConfirmationModalProvider } from "./Modals/ConfirmationModalProvider";
import { InfoModalProvider } from "./Modals/InfoModalProvider";
import { InputModalProvider } from "./Modals/InputModalProvider";
import { VarbSelectModalProvider } from "./Modals/VarbSelectModalProvider";

type Props = { children: React.ReactNode };
export function ModalProviders({ children }: Props) {
  return (
    <ConfirmationModalProvider>
      <InfoModalProvider>
        <VarbSelectModalProvider>
          <InputModalProvider>{children}</InputModalProvider>
        </VarbSelectModalProvider>
      </InfoModalProvider>
    </ConfirmationModalProvider>
  );
}
