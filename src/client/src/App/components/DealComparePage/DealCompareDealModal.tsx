import { useToggleView } from "../../modules/customHooks/useToggleView";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { ModalSection } from "../appWide/ModalSection";
import { DealCompareDealMenu } from "./DealCompareDealMenu";

interface Props {
  dealCount: number;
}
export function DealCompareDealModal({ dealCount }: Props) {
  const { dealMenuIsOpen, openDealMenu, closeDealMenu } =
    useToggleView("dealMenu");

  const width = dealCount === 0 ? "100%" : nativeTheme.comparedDeal.width;
  return (
    // A fragment is used to reign in the zIndex of the button
    <>
      <HollowBtn
        {...{
          middle: "+ Deal",
          onClick: openDealMenu,
          sx: {
            borderRadius: 0,
            borderTopRightRadius: nativeTheme.subSection.borderRadius,
            borderBottomRightRadius: nativeTheme.subSection.borderRadius,
            ...nativeTheme.subSection.borderLines,
            fontSize: nativeTheme.fs24,
            width,
            minHeight: 300,
            zIndex: -1,
          },
        }}
      />
      <ModalSection
        {...{
          title: "Select a Deal to Compare",
          closeModal: closeDealMenu,
          show: dealMenuIsOpen,
        }}
      >
        <DealCompareDealMenu closeMenu={closeDealMenu} />
      </ModalSection>
    </>
  );
}
