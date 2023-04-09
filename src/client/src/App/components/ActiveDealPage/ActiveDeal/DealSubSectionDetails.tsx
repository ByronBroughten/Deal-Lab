import styled from "styled-components";
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
        }}
      />
    </Styled>
  );
}

const Styled = styled.div`
  .MainSubSection-displayNameDiv {
    font-size: ${theme.smallTitleSize};
    margin-bottom: ${theme.s25};
  }
`;
