import styled from "styled-components";
import { useToggleView } from "../../../../../modules/customHooks/useToggleView";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import theme from "../../../../../theme/Theme";
import { EditSectionBtn } from "../../../../appWide/EditSectionBtn";
import { FormSection } from "../../../../appWide/FormSection";
import { LabeledVarbRow } from "../../../../appWide/LabeledVarbRow";
import { ModalSection } from "../../../../appWide/ModalSection";
import { StartSectionBtn } from "../../../../appWide/StartSectionBtn";
import StandardLabel from "../../../../general/StandardLabel";
import { UnitList } from "./UnitList";

type Props = { feId: string };
export function Units({ feId }: Props) {
  const property = useGetterSection({
    sectionName: "property",
    feId,
  });

  const hasUnits = property.childFeIds("unit").length > 0;
  const { unitsIsOpen, unitsIsClosed, openUnits, closeUnits } = useToggleView(
    "units",
    false
  );

  return (
    <Styled className="Units-root">
      {unitsIsOpen && (
        <>
          <FormSection>
            <div style={{ height: "80px" }}></div>
          </FormSection>
          <ModalSection
            {...{
              title: "Units",
              show: unitsIsOpen,
              closeModal: closeUnits,
            }}
          >
            <UnitList
              {...{
                feId,
                className: "Units-unitList",
              }}
            />
          </ModalSection>
        </>
      )}
      {unitsIsClosed && (
        <FormSection>
          <div>
            <div className="Units-titleRow">
              <StandardLabel>Units</StandardLabel>
              {hasUnits && (
                <EditSectionBtn className="Units-editBtn" onClick={openUnits} />
              )}
            </div>
            {!hasUnits && (
              <StartSectionBtn className="Units-addBtn" onClick={openUnits} />
            )}
            {hasUnits && (
              <LabeledVarbRow
                {...{
                  varbPropArr: property.varbInfoArr([
                    "numUnits",
                    "targetRentYearly",
                  ] as const),
                  className: "MainDealSection-labeledVarbRow",
                }}
              />
            )}
          </div>
        </FormSection>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  .Units-editBtn {
    margin-left: ${theme.s3};
  }
  .Units-titleRow {
    display: flex;
    align-items: center;
  }
  .Units-addBtn {
    margin-top: ${theme.s3};
  }
`;
