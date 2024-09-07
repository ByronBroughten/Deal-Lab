import { useGetterSection } from "../../../../../../../../stateHooks/useGetterSection";
import { MuiFavoriteRating } from "../../../../../../../general/MuiFavoriteRating";
import { MuiRow } from "../../../../../../../general/MuiRow";
import { FormSectionNext } from "../../../../../../appWide/FormSectionNext";
import { TogglerBooleanVarb } from "../../../../../../appWide/TogglerBooleanVarb";
import { VarbStringLabel } from "../../../../../../appWide/VarbStringLabel";
import { NumObjEntityEditor } from "../../../../../../inputs/NumObjEntityEditor";
import { PeriodicEditor } from "../../../../../../inputs/PeriodicEditor";
import { UnitsNext } from "./ViewParts/UnitsNext";

type Props = { feId: string };
export function BasicHomebuyerInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  const isMultiFamily = property.valueNext("isMultifamily");
  const isRenting = property.valueNext("isRenting");

  const firstUnit = property.firstChild("unit");

  return (
    <FormSectionNext>
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("purchasePrice")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("sqft")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo2("yearBuilt")}
        />
      </MuiRow>
      <MuiRow>
        <TogglerBooleanVarb
          {...{
            feVarbInfo: property.varbInfo("isMultifamily"),
            label: (
              <VarbStringLabel
                {...{ names: property.varbInfo2("isMultifamily") }}
              />
            ),
            name: "multi-family toggle",
            sx: { marginBottom: 0 },
          }}
        />
        <TogglerBooleanVarb
          {...{
            feVarbInfo: property.varbInfo("isRenting"),
            label: (
              <VarbStringLabel
                {...{ names: property.varbInfo2("isRenting") }}
              />
            ),
            name: "rent toggle",
            sx: { marginBottom: 0 },
          }}
        />
      </MuiRow>
      {!isMultiFamily && (
        <MuiRow>
          <NumObjEntityEditor
            inputMargins
            feVarbInfo={firstUnit.varbInfo2("numBedrooms")}
          />
          {isRenting && (
            <PeriodicEditor
              inputMargins
              {...{
                feId: firstUnit.oneChildFeId("targetRentEditor"),
                labelInfo: firstUnit.periodicVBI("targetRent"),
              }}
            />
          )}
        </MuiRow>
      )}
      {isMultiFamily && (
        <UnitsNext
          {...{
            feId: property.feId,
            showRent: isRenting,
          }}
        />
      )}
      <MuiFavoriteRating {...property.varbInfo2("likability")} />
    </FormSectionNext>
  );
}
