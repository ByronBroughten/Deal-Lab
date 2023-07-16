import { unstable_batchedUpdates } from "react-dom";
import { inEntityValueInfo } from "../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { AddChildOptions } from "../../sharedWithServer/StateUpdaters/UpdaterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { OnVarbSelect } from "../inputs/NumObjEditor/NumObjVarbSelector/VarbSelectorCollection";
import {
  useDealModeContextVarbSelect,
  useVarbSelectModal,
} from "../Modals/VarbSelectModalProvider";
import { useAction } from "./../../sharedWithServer/stateClassHooks/useAction";
import { useGetterFeStore } from "./../../sharedWithServer/stateClassHooks/useFeStore";

export function DealCompareValueMenu() {
  const addChild = useAction("addChild");
  const feStore = useGetterFeStore();

  const menu = feStore.get.onlyChild("dealCompareMenu");
  const dealMode = menu.valueNext("dealMode");
  // const listName = outputListName(dealMode);
  const list = menu.onlyChild("outputList");

  const { setModal } = useVarbSelectModal();
  const onVarbSelect: OnVarbSelect = (varbInfo) => {
    const options: AddChildOptions<"outputList", "outputItem"> = {
      sectionValues: { valueEntityInfo: inEntityValueInfo(varbInfo) },
    };

    unstable_batchedUpdates(() => {
      addChild({
        feInfo: list.feInfo,
        childName: "outputItem",
        idOfSectionToSave: menu.mainStoreId,
        options,
      });
      setModal(null);
    });
  };

  const openVarbSelect = useDealModeContextVarbSelect(onVarbSelect);
  return (
    <>
      <HollowBtn
        {...{
          onClick: openVarbSelect,
          middle: "+ Value",
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
