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

  const areNone = dealCount === 0;

  const text = areNone ? "Add Deals To Compare" : "+ Deal";
  const extraSx = areNone
    ? {}
    : {
        borderRadius: 0,
        borderTopRightRadius: nativeTheme.subSection.borderRadius,
        borderBottomRightRadius: nativeTheme.subSection.borderRadius,
      };

  return (
    // A fragment is used to reign in the zIndex of the button
    <>
      <HollowBtn
        {...{
          middle: text,
          onClick: openDealMenu,
          sx: {
            ...extraSx,
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
          title: "Select a deal to compare",
          closeModal: closeDealMenu,
          show: dealMenuIsOpen,
        }}
      >
        <DealCompareDealMenu closeMenu={closeDealMenu} />
      </ModalSection>
    </>
  );
}
