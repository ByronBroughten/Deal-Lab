import styled from "styled-components";
import { nativeTheme } from "../../../theme/nativeTheme";
import theme from "../../../theme/Theme";
import { LabeledVarbProps } from "../../appWide/LabeledVarb";
import { LabeledVarbRow } from "../../appWide/LabeledVarbRow";

type Props = {
  displayName: React.ReactNode;
  detailVarbPropArr: LabeledVarbProps[];
};

export function DealSubSectionDetails({
  displayName,
  detailVarbPropArr,
}: Props) {
  return (
    <Styled className="MainSubSection-detailsDiv">
      <div className="MainSubSection-displayNameDiv">{displayName}</div>
      <LabeledVarbRow
        {...{
          varbPropArr: detailVarbPropArr,
          className: "MainSubSection-labeledVarbRow",
        }}
      />
    </Styled>
  );
}

const Styled = styled.div`
  .MainSubSection-displayNameDiv {
    font-size: ${theme.smallTitleSize};
  }
  .MainSubSection-labeledVarbRow {
    margin-top: ${nativeTheme.s25};
    margin-left: -${nativeTheme.s25};
    .LabeledVarb-label,
    .LabeledVarb-output {
      font-size: ${theme.infoSize};
    }
  }
`;
