import { inEntityValueInfo } from "../../../sharedWithServer/SectionsMeta/values/StateValue/InEntityValue";
import { useAction } from "../../../sharedWithServer/stateClassHooks/useAction";
import { AddChildOptions } from "../../../sharedWithServer/StateUpdaters/UpdaterSection";
import { useDealModeContextVarbSelect } from "../../Modals/VarbSelectModalProvider";
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

  const openVarbSelect = useDealModeContextVarbSelect((varbInfo) => {
    const options: AddChildOptions<"outputList", "outputItem"> = {
      sectionValues: { valueEntityInfo: inEntityValueInfo(varbInfo) },
    };
    addChild({
      feInfo,
      childName: "outputItem",
      options,
    });
  });

  return (
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
        addItem: openVarbSelect,
        makeItemNode: ({ feId }) => <LoadedVarbItem {...{ feId, key: feId }} />,
      }}
    />
  );
}
