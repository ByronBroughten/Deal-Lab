import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListGenericMenuType } from "../ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableCapEx } from "../ListGroup/ListGroupShared/VarbListGeneric/VarbListTableCapEx";
import { VarbListMenuDual } from "../ListGroup/ListGroupShared/VarbListMenuDual";
import { VarbListStyled } from "../ListGroup/ListGroupShared/VarbListStyled";
import { ListItemCapEx } from "./VarbListOngoing/ListItemCapEx";

type Props = {
  feId: string;
  className?: string;
  menuType?: VarbListGenericMenuType;
};
export function VarbListCapEx({ feId, menuType = "value", className }: Props) {
  const feInfo = { sectionName: "capExList", feId } as const;
  const list = useSetterSection({ sectionName: "capExList", feId });
  const totalVarbName = list.get.activeSwitchTargetName("total", "ongoing");
  const itemOngoingSwitch = list.varb("itemOngoingSwitch").value("string");
  const items = list.get.children("capExItem");
  return (
    <VarbListStyled className={`VarbListCapEx-root ${className ?? ""}`}>
      <VarbListMenuDual
        {...{
          ...feInfo,
          totalVarbName,
          menuType,
        }}
      />
      <VarbListTableCapEx
        {...{
          addItem: () =>
            list.addChild("capExItem", {
              dbVarbs: { valueOngoingSwitch: itemOngoingSwitch },
            }),
        }}
      >
        {items.map((item) => (
          <ListItemCapEx
            {...{
              feId: item.feId,
              key: item.feId,
            }}
          />
        ))}
      </VarbListTableCapEx>
    </VarbListStyled>
  );
}
