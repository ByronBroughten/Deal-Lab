import { ReactNode } from "react";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { useSaveStatus } from "../../GeneralSection/MainSection/useSaveStatus";
import { VarbListTableSectionGeneric } from "./VarbListGeneric/VarbListTableSectionGeneric";
import { VarbListMenuDual } from "./VarbListMenuDual";
import { VarbListStyled } from "./VarbListStyled";

type VarbListAllowed = SectionNameByType<"varbListAllowed">;
type Props<SN extends VarbListAllowed> = {
  feInfo: FeSectionInfo<SN>;
  makeItemNode: (props: { feId: string }) => ReactNode;
  contentTitle: string;
  totalVarbName?: string;
  className?: string;
  menuType?: VarbListGenericMenuType;
  addItem?: () => void;
};

export type VarbListGenericMenuType = "value" | "editorPage";
export function VarbListGeneric<SN extends VarbListAllowed>({
  feInfo,
  makeItemNode,
  contentTitle,
  totalVarbName,
  className,
  menuType = "value",
  ...props
}: Props<SN>) {
  const disableSaveStatus = true;
  let saveStatus = useSaveStatus(feInfo, disableSaveStatus);
  const list = useSetterSection(feInfo);
  const itemName = list.meta.varbListItem as ChildName<SN>;
  const addItem = props.addItem ?? (() => list.addChild(itemName));

  const total = totalVarbName
    ? list.get.varb(totalVarbName).displayVarb()
    : undefined;

  const items = list.get.children(itemName);
  return (
    <VarbListStyled className={`VarbListGeneric-root ${className ?? ""}`}>
      <VarbListMenuDual
        {...{
          menuType,
          ...feInfo,
        }}
      />
      <VarbListTableSectionGeneric
        {...{ contentTitle, addItem, varbListTotal: total }}
      >
        {items.map((item) => makeItemNode(item))}
      </VarbListTableSectionGeneric>
    </VarbListStyled>
  );
}
