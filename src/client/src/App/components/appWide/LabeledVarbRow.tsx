import { Box, SxProps } from "@mui/material";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { arrSx } from "../../utils/mui";
import { LabeledVarbFinder, LabeledVarbNext } from "./LabeledVarbNext";

type Props = {
  varbPropArr: LabeledVarbFinder[];
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
      {varbPropArr.map((finder) => {
        const arr = Array.isArray(finder) ? finder : [finder];
        const info = arr[0];
        return (
          <LabeledVarbNext
            {...{
              finder,
              key: info.feId + info.varbName,
            }}
          />
        );
      })}
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
