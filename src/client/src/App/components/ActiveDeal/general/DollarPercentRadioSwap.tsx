import { FormControl, FormControlLabel, RadioGroup } from "@material-ui/core";
import { FeSectionInfo } from "../../../sharedWithServer/SectionsMeta/Info";
import { useHandleChange } from "../../../sharedWithServer/stateClassHooks/useHandleChange";
import { useSetterSection } from "../../../sharedWithServer/stateClassHooks/useSetterSection";
import DualInputsRadioSwap from "../../general/DualInputsRadioSwap";
import Radio from "../../general/Radio";
import { NumObjEntityEditor } from "../../inputs/NumObjEntityEditor";

type Props = {
  feInfo: FeSectionInfo;
  names: { switch: string; percent: string; dollars: string };
  title: string;
  percentAdornment?: string;
  dollarEnding?: string;
  className?: string;
};

const radios = {
  percent: "%",
  dollars: "$",
};
export default function DollarPercentRadioSwap({
  feInfo,
  names,
  title,
  percentAdornment = "%",
  className,
}: Props) {
  const handleChange = useHandleChange();
  const section = useSetterSection(feInfo);

  const dollarsVarb = section.get.varb(names.dollars);
  const percentVarb = section.get.varb(names.percent);
  const switchVarb = section.get.varb(names.switch);

  const switchValue = switchVarb.value("string");
  if (!isPercentOrDollars(switchValue)) {
    throw new Error(
      `switchValue should be "percent" or "dollars" but is ${switchValue}`
    );
  }
  const radio = radios[switchValue];
  return (
    <DualInputsRadioSwap
      className={`DualPercentRadioSwap-root ${className ?? ""}`}
    >
      <FormControl component="fieldset" className="radio-part">
        <RadioGroup>
          <FormControlLabel
            value="percent"
            control={<Radio />}
            label="%"
            name={switchVarb.varbId}
            checked={radio === "%"}
            onChange={handleChange}
          />
          <FormControlLabel
            value="dollars"
            control={<Radio />}
            label="$"
            name={switchVarb.varbId}
            checked={radio === "$"}
            onChange={handleChange}
          />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className="labeled-input-group-part">
        {radio === "%" && (
          <div className="RadioSwap-editorDiv">
            <NumObjEntityEditor
              className="RadioSwap-percentEditor"
              label={title}
              feVarbInfo={percentVarb.feVarbInfo}
              endAdornment={`${percentAdornment} ${
                dollarsVarb.numberOrQuestionMark === "?"
                  ? ""
                  : ` (${dollarsVarb.displayVarb()})`
              }`}
            />
          </div>
        )}
        {radio === "$" && (
          <div className="RadioSwap-editorDiv">
            <NumObjEntityEditor
              className="RadioSwap-dollarsEditor"
              label={title}
              feVarbInfo={dollarsVarb.feVarbInfo}
              endAdornment={`${
                percentVarb.numberOrQuestionMark === "?"
                  ? ""
                  : ` (${percentVarb.displayVarb()})`
              }`}
            />
          </div>
        )}
      </FormControl>
    </DualInputsRadioSwap>
  );
}

const percentOrDollars = ["percent", "dollars"] as const;
type PercentOrDollars = typeof percentOrDollars[number];
function isPercentOrDollars(value: any): value is PercentOrDollars {
  return percentOrDollars.includes(value);
}
