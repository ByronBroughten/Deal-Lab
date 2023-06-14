import { unstable_batchedUpdates } from "react-dom";
import { inEntityValueInfo } from "../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useSetterMain } from "../../sharedWithServer/stateClassHooks/useMain";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import {
  useDealModeContextVarbSelect,
  useVarbSelectModal,
} from "../general/VarbSelectModalProvider";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";

export function DealCompareValueMenu() {
  const main = useSetterMain();
  const dealCompare = main.onlyChild("dealCompare");

  const setVarbSelectModal = useVarbSelectModal();
  const onVarbSelect: OnVarbSelect = (varbInfo) => {
    unstable_batchedUpdates(() => {
      dealCompare.addChild("compareValue", {
        sectionValues: { valueEntityInfo: inEntityValueInfo(varbInfo) },
      });
    });
    setVarbSelectModal(null);
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
