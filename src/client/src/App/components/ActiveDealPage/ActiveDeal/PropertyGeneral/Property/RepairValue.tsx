import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import { useToggleViewNext } from "../../../../../modules/customHooks/useToggleView";
import { RepairValueMode } from "../../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/subValues";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../../theme/Theme";
import { EditSectionBtn } from "../../../../appWide/EditSectionBtn";
import { FormSection } from "../../../../appWide/FormSection";
import { VarbListSingleTime } from "../../../../appWide/ListGroup/ListGroupSingleTime/VarbListSingleTime";
import { SectionModal } from "../../../../appWide/SectionModal";
import { SelectEditor } from "../../../../appWide/SelectEditor";

type Props = { feId: string };
export function RepairValue({ feId }: Props) {
  const repairValue = useSetterSection({
    sectionName: "repairValue",
    feId,
  });

  const valueMode = repairValue.value("valueMode") as RepairValueMode;
  const { itemsIsOpen, closeItems, openItems } = useToggleViewNext(
    "items",
    false
  );

  return (
    <Styled>
      <div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <SelectEditor
            {...{
              label: "Upfront Repairs",
              value: valueMode,
              onChange: (e) => {
                unstable_batchedUpdates(() => {
                  const value = e.target.value as string;
                  repairValue.varb("valueMode").updateValue(value);
                  value === "itemize" && openItems();
                });
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
            }}
          />
          {valueMode === "itemize" && (
            <>
              <div className="RepairValue-itemizedTotalDiv">{`Total = ${repairValue.get
                .varbNext("value")
                .displayVarb()}`}</div>
              <EditSectionBtn
                className="RepairValue-editBtn"
                onClick={openItems}
              />
              <SectionModal
                title="Repairs"
                closeModal={closeItems}
                show={itemsIsOpen}
              >
                <VarbListSingleTime
                  {...{
                    className: "RepairValue-singleTimeList",
                    feId: repairValue.oneChildFeId("singleTimeList"),
                    menuType: "value",
                  }}
                />
              </SectionModal>
            </>
          )}
        </div>
        {/* {valueMode === "itemize" && (
          <div className="RepairValue-itemizedTotalDiv">{`Total: ${
            repairValue.get.varbNext("value").numberOrQuestionMark
          }`}</div>
        )} */}
      </div>
    </Styled>
  );
}

const Styled = styled(FormSection)`
  .RepairValue-itemizedTotalDiv {
    padding-bottom: 11px;
    margin-left: ${theme.s3};
  }
  .RepairValue-editBtn {
    height: 37px;
    margin-left: ${theme.s2};
  }
`;
