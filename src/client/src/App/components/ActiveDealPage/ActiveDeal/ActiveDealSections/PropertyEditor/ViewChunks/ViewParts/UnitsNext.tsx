import { FeIdProp } from "../../../../../../../sharedWithServer/SectionsMeta/SectionInfo/NanoIdInfo";
import { useGetterSection } from "../../../../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../../../../../../theme/nativeTheme";
import { SubSectionBtn } from "../../../../../../appWide/GeneralSection/GeneralSectionTitle/SubSectionBtn";
import { StyledActionBtn } from "../../../../../../appWide/GeneralSection/MainSection/StyledActionBtn";
import { LabeledVarbRow } from "../../../../../../appWide/LabeledVarbRow";
import { MuiRow } from "../../../../../../general/MuiRow";
import { icons } from "../../../../../../Icons";
import { useDealModeContextInputModal } from "../../../../../../Modals/InputModalProvider";
import { UnitList } from "../Units/UnitList";

export function UnitsNext({ feId }: FeIdProp) {
  const property = useGetterSection({ sectionName: "property", feId });
  const hasUnits = property.childFeIds("unit").length > 0;
  const { setModal } = useDealModeContextInputModal();
  const openUnits = () =>
    setModal({
      title: "Units",
      children: <UnitList {...{ feId }} />,
    });
  return (
    <>
      <MuiRow>
        {hasUnits && (
          <>
            <StyledActionBtn
              {...{
                onClick: openUnits,
                middle: "Edit Units",
                left: icons.edit(),
                sx: {
                  fontSize: nativeTheme.inputLabel.fontSize,
                  marginRight: nativeTheme.s35,
                  border: `solid 1px ${nativeTheme["gray-300"]}`,
                  height: "60px",
                  borderRadius: nativeTheme.muiBr0,
                },
              }}
            />
            <LabeledVarbRow
              {...{
                varbPropArr: property.varbInfoArr(
                  "numUnits",
                  "numBedrooms",
                  "targetRentYearly"
                ),
              }}
            />
          </>
        )}
        {!hasUnits && (
          <SubSectionBtn
            {...{
              onClick: openUnits,
              left: icons.addUnit({ size: 22 }),
              middle: "Add Units",
              sx: {
                fontSize: nativeTheme.inputLabel.fontSize,
                borderRadius: nativeTheme.muiBr0,
                lineHeight: "1.2rem",
                height: 60,
                width: 140,
                ...nativeTheme.editorMargins,
              },
            }}
          />
        )}
      </MuiRow>
    </>
  );
}
