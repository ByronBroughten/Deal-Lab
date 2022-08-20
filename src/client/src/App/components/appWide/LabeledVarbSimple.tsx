import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useGetterSections } from "../../sharedWithServer/stateClassHooks/useGetterSections";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import { ThemeName } from "../../theme/Theme";
import { StyledLabeledVarb } from "./LoadedVarb";

type useLabeledVarbProps = {
  feVarbInfo?: FeVarbInfo;
  displayVarb?: string;
  displayLabel?: string;
  parenthInfo?: FeVarbInfo | string;
};
function useLabeledVarb({
  feVarbInfo,
  displayLabel,
  displayVarb,
  parenthInfo,
  ...adornments
}: useLabeledVarbProps): { displayLabel: string; displayVarb: string } {
  const sections = useGetterSections();
  if (!feVarbInfo || !sections.hasSection(feVarbInfo))
    return {
      displayLabel: "Variable not found",
      displayVarb: "?",
    };

  const varb = sections.varb(feVarbInfo);
  displayLabel = displayLabel ?? varb.displayName;
  displayVarb = displayVarb ?? varb.displayVarb(adornments);

  if (parenthInfo) {
    if (typeof parenthInfo === "string")
      displayVarb = `${displayVarb} (${parenthInfo})`;
    else
      displayVarb = `${displayVarb} (${sections
        .varb(parenthInfo)
        .displayVarb()})`;
  }
  return { displayLabel, displayVarb };
}

type LabeledVarbProps = useLabeledVarbProps & {
  feVarbInfo: FeVarbInfo;
  onXBtnClick?: () => void;
  className?: string;
  themeName?: ThemeName;
};
export function LabeledVarbSimple({
  feVarbInfo,
  className,
  onXBtnClick,
  themeName = "default",
  ...rest
}: LabeledVarbProps) {
  const varbId = GetterVarb.feVarbInfoToVarbId(feVarbInfo);
  const { displayLabel, displayVarb } = useLabeledVarb({
    feVarbInfo,
    ...rest,
  });
  return (
    <StyledLabeledVarb
      {...{
        labelId: varbId,
        displayVarb,
        labelText: displayLabel,
        themeName,
      }}
    />
  );
}
