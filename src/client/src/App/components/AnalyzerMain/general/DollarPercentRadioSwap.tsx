import { FormControl, FormControlLabel, RadioGroup } from "@material-ui/core";
import styled from "styled-components";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { FeInfo } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import DualInputsRadioSwap from "../../general/DualInputsRadioSwap";
import Radio from "../../general/Radio";
import StandardLabel from "../../general/StandardLabel";
import NumObjEditor from "../../inputs/NumObjEditor";

type Props = {
  feInfo: FeInfo;
  names: { switch: string; percent: string; dollars: string };
  title: string;
  percentAdornment?: string;
  dollarEnding?: string;
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
}: Props) {
  const { analyzer, handleChange } = useAnalyzerContext();
  const varbs = analyzer.section(feInfo).varbs;
  const dollarsVarb = varbs[names.dollars];
  const percentVarb = varbs[names.percent];

  const switchValue = varbs[names.switch].value("string") as
    | "percent"
    | "dollars";
  const radio = radios[switchValue];

  return (
    <Styled className="dual-varbs-radio-swap">
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
        <StandardLabel>{title}</StandardLabel>
        {radio === "%" && (
          <div className="swappable-editors">
            <NumObjEditor
              className="percent-down"
              feVarbInfo={percentVarb.feVarbInfo}
              labeled={false}
              endAdornment={percentAdornment}
            />
            <div className="dependent">
              <span className="equals">=</span>
              {`${dollarsVarb.displayVarb()}`}
            </div>
          </div>
        )}
        {radio === "$" && (
          <div className="swappable-editors">
            <NumObjEditor
              className="dollars-down"
              feVarbInfo={dollarsVarb.feVarbInfo}
              labeled={false}
            />
            <div className="dependent">
              <span className="equals">=</span>
              {`${percentVarb.displayVarb()}`}
            </div>
          </div>
        )}
      </FormControl>
    </Styled>
  );
}

const Styled = styled(DualInputsRadioSwap)`
  .swappable-editors {
    margin-top: 7px;
  }
`;
