import { nativeTheme } from "../../../../../theme/nativeTheme";
import MainSectionBody from "../../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { DealOutputDetails } from "./DealOutputDetails";
import { DealOutputList } from "./DealOutputList";

type Props = {
  detailsIsOpen: boolean;
  feId: string;
};
export function DealOutputListOrDetails({ detailsIsOpen, feId }: Props) {
  return (
    <MainSectionBody>
      {!detailsIsOpen && (
        <DealOutputList sx={{ marginLeft: -nativeTheme.s2 }} feId={feId} />
      )}
      {detailsIsOpen && <DealOutputDetails {...{ feId }} />}
    </MainSectionBody>
  );
}
