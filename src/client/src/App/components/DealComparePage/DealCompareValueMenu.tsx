import { unstable_batchedUpdates } from "react-dom";
import { inEntityValueInfo } from "../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useSetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";
import {
  useDealModeContextVarbSelect,
  useVarbSelectModal,
} from "../Modals/VarbSelectModalProvider";

export function DealCompareValueMenu() {
  const main = useSetterMain();
  const dealCompare = main.onlyChild("dealCompare");

  const { setModal } = useVarbSelectModal();
  const onVarbSelect: OnVarbSelect = (varbInfo) => {
    unstable_batchedUpdates(() => {
      dealCompare.addChild("compareValue", {
        sectionValues: { valueEntityInfo: inEntityValueInfo(varbInfo) },
      });
    });
    setModal(null);
  };

  const openVarbSelect = useDealModeContextVarbSelect(onVarbSelect);
  return (
    <>
      <HollowBtn
        {...{
          onClick: openVarbSelect,
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
    </>
  );
}
