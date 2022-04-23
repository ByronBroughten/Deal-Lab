import { FormControl, FormControlLabel, RadioGroup } from "@material-ui/core";
import styled from "styled-components";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { FeInfo } from "../../../sharedWithServer/SectionMetas/Info";
import DualInputsRadioSwap from "../../general/DualInputsRadioSwap";
import Radio from "../../general/Radio";
import NumObjEditor from "../../inputs/NumObjEditor";

type Props = {
  feInfo: FeInfo;
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
  const { analyzer, handleChange } = useAnalyzerContext();
  const varbs = analyzer.section(feInfo).varbs;
  const dollarsVarb = varbs[names.dollars];
  const percentVarb = varbs[names.percent];

  const switchValue = varbs[names.switch].value("string") as
    | "percent"
    | "dollars";
  const radio = radios[switchValue];

  const dollarsValue = dollarsVarb.value("numObj");
  const percentValue = percentVarb.value("numObj");

  return (
    <Styled className={`DualPercentRadioSwap-root ${className ?? ""}`}>
      <FormControl component="fieldset" className="radio-part">
        <RadioGroup>
          <FormControlLabel
            value="percent"
            control={<Radio />}
            label="%"
            name={varbs[names.switch].fullName}
            checked={radio === "%"}
            onChange={handleChange}
          />
          <FormControlLabel
            value="dollars"
            control={<Radio />}
            label="$"
            name={varbs[names.switch].fullName}
            checked={radio === "$"}
            onChange={handleChange}
          />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className="labeled-input-group-part">
        {radio === "%" && (
          <div className="swappable-editors">
            <NumObjEditor
              className="percent-down"
              label={title}
              feVarbInfo={percentVarb.feVarbInfo}
              endAdornment={`${percentAdornment} ${
                dollarsValue.number === "?"
                  ? ""
                  : ` (${dollarsVarb.displayVarb()})`
              }`}
            />
          </div>
        )}
        {radio === "$" && (
          <div className="swappable-editors">
            <NumObjEditor
              className="dollars-down"
              label={title}
              feVarbInfo={dollarsVarb.feVarbInfo}
              endAdornment={`${
                percentValue.number === "?"
                  ? ""
                  : ` (${percentVarb.displayVarb()})`
              }`}
            />
          </div>
        )}
      </FormControl>
    </Styled>
  );
}

const Styled = styled(DualInputsRadioSwap)``;
