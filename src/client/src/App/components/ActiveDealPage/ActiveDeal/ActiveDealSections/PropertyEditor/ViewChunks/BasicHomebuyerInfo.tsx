import { useGetterSection } from "../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import { FormSectionLabeled } from "../../../../../appWide/FormSectionLabeled";
import { TogglerBooleanVarb } from "../../../../../appWide/TogglerBooleanVarb";
import { VarbStringLabel } from "../../../../../appWide/VarbStringLabel";
import { MuiFavoriteRating } from "../../../../../general/MuiFavoriteRating";
import { MuiRow } from "../../../../../general/MuiRow";
import { NumObjEntityEditor } from "../../../../../inputs/NumObjEntityEditor";
import { UnitsNext } from "./ViewParts/UnitsNext";

type Props = { feId: string };
export function BasicHomebuyerInfo({ feId }: Props) {
  const property = useGetterSection({ sectionName: "property", feId });
  const isMultiFamily = property.valueNext("isMultifamily");
  const isRenting = property.valueNext("isRenting");

  const firstUnit = property.firstChild("unit");

  return (
    <FormSectionLabeled {...{ label: "Basics" }}>
      <MuiRow>
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("purchasePrice")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("sqft")}
        />
        <NumObjEntityEditor
          inputMargins
          feVarbInfo={property.varbInfo("yearBuilt")}
        />
      </MuiRow>
      <MuiRow>
        <TogglerBooleanVarb
          {...{
            feVarbInfo: property.varbInfo("isMultifamily"),
            label: (
              <VarbStringLabel
                {...{ names: property.varbInfoNext("isMultifamily") }}
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
                {...{ names: property.varbInfoNext("isRenting") }}
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
            feVarbInfo={firstUnit.varbInfo("numBedrooms")}
          />
          {isRenting && (
            <NumObjEntityEditor
              inputMargins
              feVarbInfo={firstUnit.varbInfo("targetRentPeriodicEditor")}
            />
          )}
        </MuiRow>
      )}
      {isMultiFamily && (
        <UnitsNext
          {...{
            feId: property.feId,
            showRent: isRenting,
            sx: {
              marginBottom: nativeTheme.s2,
            },
          }}
        />
      )}
      <MuiFavoriteRating {...property.varbInfo("likability")} />
    </FormSectionLabeled>
  );
}
