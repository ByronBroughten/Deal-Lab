import { useToggleView } from "../../modules/customHooks/useToggleView";
import { MainSectionBtnNative } from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionBtnNative";
import { ModalSection } from "../appWide/ModalSection";
import { DealCompareDealMenu } from "./DealCompareDealMenu";

export function DealCompareDealModal() {
  const { dealMenuIsOpen, openDealMenu, closeDealMenu } =
    useToggleView("dealMenu");
  return (
    // A fragment is used to reign in the zIndex of the button
    <>
      <MainSectionBtnNative
        {...{
          middle: "+ Deal",
          style: { width: 120, minHeight: 300, zIndex: -1 },
          onClick: openDealMenu,
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
