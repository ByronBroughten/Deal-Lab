import { unstable_batchedUpdates } from "react-dom";
import { useToggleView } from "../../modules/customHooks/useToggleView";
import { inEntityValueInfo } from "../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useSetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useSetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { MainSectionBtnNative } from "../appWide/GeneralSection/GeneralSectionTitle/MainSectionBtnNative";
import { AllVarbsModal } from "../inputs/NumObjEditor/AllVarbsModal";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";

export function DealCompareValueMenu() {
  const main = useSetterSectionOnlyOne("main");
  const dealCompare = main.onlyChild("dealCompare");
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
      <MainSectionBtnNative
        {...{
          onClick: openVarbsModal,
          middle: "+ Value",
          style: { height: 50, marginRight: nativeTheme.s3 },
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
