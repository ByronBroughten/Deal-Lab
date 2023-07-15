import { SxProps } from "@mui/material";
import React, { ReactNode } from "react";
import { ChildName } from "../../../../sharedWithServer/SectionsMeta/sectionChildrenDerived/ChildName";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { VarbListTableSectionGeneric } from "./VarbListGeneric/VarbListTableSectionGeneric";
import { VarbListMenuDual } from "./VarbListMenuDual";
import { VarbListStyled } from "./VarbListStyled";

type VarbListAllowed = SectionNameByType<"varbListAllowed">;
type Props<SN extends VarbListAllowed> = {
  feInfo: FeSectionInfo<SN>;
  makeItemNode: (props: { feId: string }) => ReactNode;
  headers: React.ReactElement;
  totalVarbName?: string;
  className?: string;
  menuType?: VarbListGenericMenuType;
  addItem?: () => void;
  sx?: SxProps;
  tableSx?: SxProps;
  viewableSx?: SxProps;
};

export type VarbListGenericMenuType = "value" | "editorPage";
export function VarbListGeneric<SN extends VarbListAllowed>({
  feInfo,
  headers,
  makeItemNode,
  totalVarbName,
  className,
  menuType = "value",
  sx,
  tableSx,
  viewableSx,
  ...props
}: Props<SN>) {
  const list = useSetterSection(feInfo);
  const itemName = list.meta.varbListItem as ChildName<SN>;
  const addItem = props.addItem ?? (() => list.addChild(itemName));

  const total = totalVarbName
    ? list.get.varb(totalVarbName).displayVarb()
    : undefined;

  const items = list.get.children(itemName);
  return (
    <VarbListStyled sx={sx} viewableSx={viewableSx} className={className}>
      <VarbListMenuDual
        {...{
          menuType,
          ...feInfo,
        }}
      />
      <VarbListTableSectionGeneric
        {...{ addItem, varbListTotal: total, headers, tableSx }}
      >
        {items.map((item) => makeItemNode(item))}
      </VarbListTableSectionGeneric>
    </VarbListStyled>
  );
}
