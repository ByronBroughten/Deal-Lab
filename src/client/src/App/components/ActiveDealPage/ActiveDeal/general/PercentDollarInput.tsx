import { FormControl, MenuItem, Select } from "@material-ui/core";
import styled from "styled-components";
import { VarbName } from "../../../../sharedWithServer/SectionsMeta/baseSectionsDerived/baseSectionsVarbsTypes";
import { SwitchTargetKey } from "../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/baseSwitchNames";
import { switchNames } from "../../../../sharedWithServer/SectionsMeta/baseSectionsVarbs/RelSwitchVarb";
import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionName } from "../../../../sharedWithServer/SectionsMeta/SectionName";
import { useSetterSection } from "../../../../sharedWithServer/stateClassHooks/useSetterSection";
import theme from "../../../../theme/Theme";
import StandardLabel from "../../../general/StandardLabel";
import { NumObjEntityEditor } from "../../../inputs/NumObjEntityEditor";

// In this case, I can just use the unitBaseName, yes?
// but...
interface Props<SN extends SectionName> extends FeSectionInfo<SN> {
  unitBaseName: string;
  dollarVarbName: VarbName<SN>;
  percentOfWhat: string;
  label: string;
  className?: string;
}
export function PercentDollarInput<SN extends SectionName>({
  unitBaseName,
  dollarVarbName,
  percentOfWhat,
  label,
  className,
  ...feInfo
}: Props<SN>) {
  const section = useSetterSection(feInfo);
  const { get } = section;

  const unitSwitchName = switchNames(unitBaseName, "dollarsPercent")
    .switch as VarbName<SN>;

  const unitSwitchValue = get.switchValue(unitBaseName, "dollarsPercent");

  const editorInfo = section.varbInfo(
    getEditorVarbName(unitBaseName, unitSwitchValue) as VarbName<SN>
  );

  function getEqualsText() {
    const varbName = getDisplayVarbName({
      unitBaseName,
      unitSwitchValue,
      dollarVarbName,
    }) as VarbName<SN>;

    const varb = section.varb(varbName);
    const displayVarb = varb.get.displayVarb();
    switch (unitSwitchValue) {
      case "percent":
        return displayVarb;
      case "dollars":
        return `${displayVarb} ${percentOfWhat}`;
      default:
        throw new Error("invalid unitSwitch");
    }
  }

  return (
    <Styled className={`DollarsPercentInput-root ${className ?? ""}`}>
      <StandardLabel>{label}</StandardLabel>
      <div className="PercentDollarInput-basePayEditorDiv">
        <FormControl
          className="PercentDollarInput-basePayFormControl"
          size="small"
          variant="filled"
        >
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={unitSwitchValue}
            onChange={(e) => {
              section
                .varb(unitSwitchName)
                .updateValue(e.target.value as string);
            }}
          >
            <MenuItem
              value={"percent"}
            >{`Percent of ${percentOfWhat}`}</MenuItem>
            <MenuItem value={"dollars"}>Dollar amount</MenuItem>
          </Select>
        </FormControl>
        <NumObjEntityEditor
          className="PercentDollarInput-basePayEditor"
          feVarbInfo={editorInfo}
          labeled={false}
        />
        <div className="PercentDollarInput-equalsDiv">
          <span className="PercentDollarInput-equals">=</span>
          <span className="PercentDollarInput-equalsText">
            {getEqualsText()}
          </span>
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  border-bottom: ${theme.borderStyle};
  padding-bottom: ${theme.s35};

  .PercentDollarInput-basePayEditorDiv {
    margin-top: ${theme.s15};
    display: flex;
  }
  .PercentDollarInput-basePayFormControl {
    border: solid 1px ${theme["gray-300"]};
    border-right: none;
    border-top-left-radius: ${theme.br0};
    .MuiSelect-root {
      padding: 9px 32px 9px 12px;
    }
    .MuiInputBase-root {
      height: 35px;
      border-top-right-radius: 0;
    }
  }
  .PercentDollarInput-basePayEditor {
    .NumObjEditor-materialDraftEditor {
      .editor-background {
        border-top-left-radius: 0;
      }
      .MuiInputBase-root {
        min-width: 40px;
        border-top-left-radius: 0;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
    }
  }
  .PercentDollarInput-equalsDiv {
    display: flex;
    align-items: center;
    padding-left: ${theme.s3};
    font-size: ${theme.infoSize};
  }

  .PercentDollarInput-equals {
    font-size: 22px;
  }

  .PercentDollarInput-equalsText {
    margin-left: ${theme.s2};
  }
`;

function getEditorVarbName(
  unitBaseName: string,
  unitSwitchValue: SwitchTargetKey<"dollarsPercent">
) {
  const names = switchNames(unitBaseName, "dollarsPercent");
  switch (unitSwitchValue) {
    case "percent":
      return `${names.percent}Editor`;
    case "dollars":
      return `${names.dollars}Editor`;
    default:
      throw new Error("unitSwitch should be 'percent' or 'dollars'");
  }
}

type GetDisplayNameProps<SN extends SectionName> = {
  unitBaseName: string;
  unitSwitchValue: SwitchTargetKey<"dollarsPercent">;
  dollarVarbName: VarbName<SN>;
};
function getDisplayVarbName<SN extends SectionName>({
  unitBaseName,
  unitSwitchValue,
  dollarVarbName,
}: GetDisplayNameProps<SN>) {
  const names = switchNames(unitBaseName, "dollarsPercent");
  switch (unitSwitchValue) {
    case "percent":
      return dollarVarbName;
    case "dollars":
      return names.percent;
    default:
      throw new Error("unitSwitchValue should be 'percent' or 'dollars'");
  }
}
