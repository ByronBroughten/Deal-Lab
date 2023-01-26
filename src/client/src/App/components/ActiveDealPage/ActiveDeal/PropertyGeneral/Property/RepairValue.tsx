import React from "react";
import styled from "styled-components";
import { RepairValueMode } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { FormSection } from "../../../../appWide/FormSection";
import { VarbListSingleTime } from "../../../../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { SelectAndItemizeEditor } from "../../../../appWide/SelectAndItemizeEditor";

type Props = { feId: string };
export function RepairValue({ feId }: Props) {
  const repairValue = useSetterSection({
    sectionName: "repairValue",
    feId,
  });
  const valueMode = repairValue.value("valueMode") as RepairValueMode;
  return (
    <SelectAndItemizeEditor
      {...{
        label: "Upfront Repairs",
        value: valueMode,
        onChange: (e) => {
          const value = e.target.value as string;
          repairValue.varb("valueMode").updateValue(value);
        },
        editorVarbInfo:
          valueMode === "lumpSum"
            ? repairValue.varbInfo("valueLumpSumEditor")
            : undefined,
        menuItems: [
          ["turnkey", "Turnkey (no repairs)"],
          ["lumpSum", "Enter lump sum"],
          ["itemize", "Itemize"],
        ],
        isItemized: valueMode === "itemize",
        total: repairValue.get.varbNext("value").displayVarb(),
        itemsComponent: (
          <VarbListSingleTime
            {...{
              feId: repairValue.oneChildFeId("singleTimeList"),
              menuType: "value",
            }}
          />
        ),
      }}
    />
  );
}

const Styled = styled(FormSection)``;
