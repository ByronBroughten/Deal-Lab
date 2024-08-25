import { SxProps } from "@mui/material";
import React, { ReactNode } from "react";
import { SectionNameByType } from "../../../../../sharedWithServer/SectionNameByType";
import { FeSectionInfo } from "../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { ChildName } from "../../../../../sharedWithServer/stateSchemas/derivedFromChildrenSchemas/ChildName";
import { useAction } from "../../../../stateClassHooks/useAction";
import { useGetterSection } from "../../../../stateClassHooks/useGetterSection";
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
  const addChild = useAction("addChild");
  const list = useGetterSection(feInfo);
  const itemName = list.meta.varbListItem as ChildName<SN>;
  const addItem =
    props.addItem ??
    (() =>
      addChild({
        feInfo: list.feInfo,
        childName: itemName,
      }));

  const total = totalVarbName
    ? list.varb(totalVarbName).displayVarb()
    : undefined;

  const items = list.children(itemName);
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
