import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListEditorPageMenu } from "../ListGroup/ListGroupShared/VarbListEditorPageMenu";
import { VarbListGenericMenuType } from "../ListGroup/ListGroupShared/VarbListGeneric";
import { VarbListTableCapEx } from "../ListGroup/ListGroupShared/VarbListGeneric/VarbListTableCapEx";
import { VarbListStyled } from "../ListGroup/ListGroupShared/VarbListStyled";
import { VarbListValueMenu } from "../ListGroup/ListGroupShared/VarbListValueMenu";
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
  const listMenu = {
    value: () => (
      <VarbListValueMenu
        {...{
          ...feInfo,
          totalVarbName,
        }}
      />
    ),
    editorPage: () => (
      <VarbListEditorPageMenu
        {...{
          ...feInfo,
          totalVarbName,
        }}
      />
    ),
  };
  return (
    <VarbListStyled className={`VarbListCapEx-root ${className ?? ""}`}>
      {listMenu[menuType]()}
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
