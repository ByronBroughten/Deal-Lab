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
  const equalsValue = valueMode === "turnkey" ? "$0" : undefined;
  return (
    <SelectAndItemizeEditor
      {...{
        label: "Upfront Repairs",
        selectValue: valueMode,
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
        equalsValue,
        total: repairValue.get.varbNext("value").displayVarb(),
        itemizeValue: "itemize",
        itemizedModalTitle: "Repairs",
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
