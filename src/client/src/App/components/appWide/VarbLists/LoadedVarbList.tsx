import { useToggleView } from "../../../modules/customHooks/useToggleView";
import { inEntityValueInfo } from "../../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useAction } from "../../../sharedWithServer/stateClassHooks/useAction";
import { AddChildOptions } from "../../../sharedWithServer/StateUpdaters/UpdaterSection";
import { AllVarbsModal } from "../../inputs/NumObjEditor/AllVarbsModal";
import {
  VarbListGeneric,
  VarbListGenericMenuType,
} from "../ListGroup/ListGroupShared/VarbListGeneric";
import { LoadedVarbItem } from "./VarbListUserVarbs/LoadedVarbItem";

type Props = {
  feId: string;
  menuType: VarbListGenericMenuType;
  className?: string;
};

export function LoadedVarbList({ feId, ...rest }: Props) {
  const feInfo = { sectionName: "outputList", feId } as const;
  const addChild = useAction("addChild");

  const { selectIsOpen, openSelect, closeSelect } = useToggleView("select");

  return (
    <>
      <VarbListGeneric
        {...{
          ...rest,
          feInfo,
          headers: <></>,
          // <tr>
          //   <Box
          //     component="th"
          //     sx={{ fontSize: nativeTheme.fs22 }}
          //     className="VarbListTable-nameHeader"
          //   >
          //     {/* Name */}
          //   </Box>
          //   <Box
          //     component="th"
          //     sx={{ maxWidth: 1 }}
          //     className="VarbListTable-btnHeader"
          //   ></Box>
          // </tr>
          addItem: openSelect,
          makeItemNode: ({ feId }) => (
            <LoadedVarbItem {...{ feId, key: feId }} />
          ),
        }}
      />
      <AllVarbsModal
        {...{
          onVarbSelect: (varbInfo) => {
            const options: AddChildOptions<"outputList", "outputItem"> = {
              sectionValues: { valueEntityInfo: inEntityValueInfo(varbInfo) },
            };
            addChild({
              feInfo,
              childName: "outputItem",
              options,
            });
          },
          closeAllVarbs: closeSelect,
          allVarbsIsOpen: selectIsOpen,
          focalInfo: feInfo,
        }}
      />
    </>
  );
}
