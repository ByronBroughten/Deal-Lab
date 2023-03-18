import { unstable_batchedUpdates } from "react-dom";
import styled from "styled-components";
import { useToggleView } from "../../../../../modules/customHooks/useToggleView";
import { useSetterSection } from "../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import { nativeTheme } from "../../../../../theme/nativeTheme";
import theme from "../../../../../theme/Theme";
import { EditSectionBtn } from "../../../../appWide/EditSectionBtn";
import { FormSection } from "../../../../appWide/FormSection";
import { LabeledVarbRow } from "../../../../appWide/LabeledVarbRow";
import { ModalSection } from "../../../../appWide/ModalSection";
import StandardLabel from "../../../../general/StandardLabel";
import { UnitList } from "./UnitList";
import { AddUnitBtn } from "./UnitList/AddUnitBtn";

type Props = { feId: string };
export function Units({ feId }: Props) {
  const property = useSetterSection({
    sectionName: "property",
    feId,
  });

  const hasUnits = property.childFeIds("unit").length > 0;
  const { unitsIsOpen, unitsIsClosed, openUnits, closeUnits } = useToggleView(
    "units",
    false
  );

  const addUnitAndOpen = () => {
    unstable_batchedUpdates(() => {
      property.addChild("unit");
      openUnits();
    });
  };

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
              <AddUnitBtn
                sx={{ marginTop: nativeTheme.s3, width: 50, height: 50 }}
                onClick={addUnitAndOpen}
              />
            )}
            {hasUnits && (
              <LabeledVarbRow
                {...{
                  varbPropArr: property.get.varbInfoArr([
                    "numUnits",
                    "targetRentYearly",
                  ] as const),
                  className: "MainSubSection-labeledVarbRow",
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
`;
