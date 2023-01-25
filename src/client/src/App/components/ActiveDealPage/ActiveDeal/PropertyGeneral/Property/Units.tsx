import { useToggleViewNext } from "../../../../../modules/customHooks/useToggleView";
import { useGetterSection } from "../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { EditSectionBtn } from "../../../../appWide/EditSectionBtn";
import { FormSection } from "../../../../appWide/FormSection";
import { SubSectionBtn } from "../../../../appWide/GeneralSection/GeneralSectionTitle/SubSectionBtn";
import { LabeledVarbRow } from "../../../../appWide/LabeledVarbRow";
import { SectionModal } from "../../../../appWide/SectionModal";
import StandardLabel from "../../../../general/StandardLabel";
import { UnitList } from "./UnitList";

type Props = { feId: string };
export function Units({ feId }: Props) {
  const property = useGetterSection({
    sectionName: "property",
    feId,
  });

  const hasUnits = property.childFeIds("unit").length > 0;
  const { unitsIsOpen, openUnits, closeUnits } = useToggleViewNext(
    "units",
    false
  );

  return (
    <div className="Units-root">
      {unitsIsOpen && (
        <SectionModal
          {...{
            title: "Units",
            show: unitsIsOpen,
            closeModal: closeUnits,
          }}
        >
          <UnitList
            {...{
              feId,
              className: "Property-unitList",
            }}
          />
        </SectionModal>
      )}
      {!hasUnits && (
        <SubSectionBtn
          className="Financing-addLoanBtn"
          onClick={openUnits}
          text="Add Units"
        />
      )}
      {hasUnits && (
        <FormSection>
          <div>
            <div style={{ display: "flex" }}>
              <StandardLabel>Units</StandardLabel>
              <EditSectionBtn onClick={openUnits} />
            </div>
            <LabeledVarbRow
              {...{
                varbPropArr: property.varbInfoArr([
                  "numUnits",
                  "targetRentYearly",
                ] as const),
                className: "MainDealSection-labeledVarbRow",
              }}
            />
          </div>
        </FormSection>
      )}
    </div>
  );
}
