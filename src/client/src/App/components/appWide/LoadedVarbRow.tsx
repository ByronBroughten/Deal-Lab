import { LoadedVarb, LoadedVarbProps } from "./LabeledVarb";
import { StyledLabeledVarbRow } from "./LabeledVarbRow";

type Props = { varbPropArr: LoadedVarbProps[] };
export function LoadedVarbRow({ varbPropArr }: Props) {
  return (
    <StyledLabeledVarbRow className="LoadedVarbRow-root">
      {varbPropArr.map((props) => (
        <LoadedVarb
          {...{
            ...props,
            key: props.feInfo.feId,
          }}
        />
      ))}
    </StyledLabeledVarbRow>
  );
}
