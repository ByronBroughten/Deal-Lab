import { unstable_batchedUpdates } from "react-dom";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { inEntityValueInfo } from "../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { AllVarbsModal } from "../inputs/NumObjEditor/AllVarbsModal";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";

export function DealCompareValueMenu() {
  const feStore = useSetterSectionOnlyOne("feStore");
  const dealCompare = feStore.onlyChild("dealCompare");
  const { varbsModalIsOpen, closeVarbsModal, openVarbsModal } =
    useToggleView("varbsModal");

  const onVarbSelect: OnVarbSelect = (varbInfo) => {
    unstable_batchedUpdates(() => {
      dealCompare.addChild("compareValue", {
        sectionValues: { valueEntityInfo: inEntityValueInfo(varbInfo) },
      });
    });
    closeVarbsModal();
  };
  return (
    <>
      <HollowBtn
        {...{
          onClick: openVarbsModal,
          middle: "+ Comparison Value",
          sx: {
            height: 50,
            fontSize: nativeTheme.fs18,
            borderRadius: 0,
            borderRightWidth: 0,
            borderBottomLeftRadius: nativeTheme.subSection.borderRadius,
            ...nativeTheme.subSection.borderLines,
          },
        }}
      />
      <AllVarbsModal
        {...{
          allVarbsIsOpen: varbsModalIsOpen,
          closeAllVarbs: closeVarbsModal,
          focalInfo: dealCompare.feInfo,
          onVarbSelect,
        }}
      />
    </>
  );
}
