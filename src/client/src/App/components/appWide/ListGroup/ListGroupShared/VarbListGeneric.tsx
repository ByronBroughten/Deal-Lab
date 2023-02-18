import { ReactNode } from "react";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { ThemeName } from "../../../../theme/Theme";
import { useSaveStatus } from "../../GeneralSection/MainSection/useSaveStatus";
import { VarbListEditorPageMenu } from "./VarbListEditorPageMenu";
import { VarbListTableSectionGeneric } from "./VarbListGeneric/VarbListTableSectionGeneric";
import { VarbListStyled } from "./VarbListStyled";
import { VarbListValueMenu } from "./VarbListValueMenu";

type VarbListAllowed = SectionNameByType<"varbListAllowed">;
type Props<SN extends VarbListAllowed> = {
  feInfo: FeSectionInfo<SN>;
  makeItemNode: (props: { feId: string }) => ReactNode;
  themeName?: ThemeName;
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
  themeName = "default",
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

  const items = list.get.children(itemName);
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
    <VarbListStyled className={`VarbListGeneric-root ${className ?? ""}`}>
      {listMenu[menuType]()}
      <VarbListTableSectionGeneric {...{ contentTitle, addItem }}>
        {items.map((item) => makeItemNode(item))}
      </VarbListTableSectionGeneric>
    </VarbListStyled>
  );
}
