import { Box, SxProps } from "@mui/material";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { arrSx } from "../../utils/mui";
import { LabeledVarb, LabeledVarbProps } from "./LabeledVarb";

type Props = {
  varbPropArr: LabeledVarbProps[];
  className?: string;
  sx?: SxProps;
};
export function LabeledVarbRow({ varbPropArr, className, sx }: Props) {
  return (
    <StyledLabeledVarbRow
      sx={[
        {
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        },
        ...arrSx(sx),
      ]}
      className={className}
    >
      {varbPropArr.map((props) => (
        <LabeledVarb
          {...{
            ...props,
            key: props.feId + props.varbName,
          }}
        />
      ))}
    </StyledLabeledVarbRow>
  );
}

export const StyledLabeledVarbRow = styled(Box)`
  .LabeledVarb-root {
    margin: ${theme.s25};
    margin-left: 0;
    margin-right: ${theme.s35};
  }

  .LabeledVarb-label,
  .LabeledVarb-output {
    font-size: 18px;
  }
`;
