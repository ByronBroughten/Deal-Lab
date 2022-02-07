import { BiCaretDown, BiCaretRight } from "react-icons/bi";
import { GoArrowRight } from "react-icons/go";
import styled from "styled-components";
import { auth } from "../../../modules/services/authService";
import theme from "../../../theme/Theme";
import LoginToAccessBtnTooltip from "../../appWide/LoginToAccessBtnTooltip";
import MainEntryTitleRow from "../../appWide/MainSection/MainSectionEntry/MainEntryTitleRow";
import AnalysisBtn from "./AnalysisBtn";

type Props = {
  id: string;
  toggleDetails: () => void;
  showDetails: boolean;
};
const sectionName = "analysis";
export default function AnalysisTitleRow({
  id,
  toggleDetails,
  showDetails,
}: Props) {
  const feInfo = { sectionName, id, idType: "feId" } as const;
  return (
    <Styled className="AnalysisTitleRow-root">
      <h5>Analysis</h5>
      <MainEntryTitleRow
        {...{ feInfo, pluralName: "analyses", droptop: true, hideLoad: true }}
      />
      <div className="AnalysisTitleRow-analysisBtnRow">
        <AnalysisBtn
          onClick={toggleDetails}
          className="AnalysisTitleRow-analysisBtn"
          text="Details"
          leftIcon={showDetails ? <BiCaretDown /> : <BiCaretRight />}
          {...{ $isactive: showDetails }}
        />

        <LoginToAccessBtnTooltip>
          <AnalysisBtn
            href="/analyses"
            className="AnalysisTitleRow-analysisBtn"
            disabled={!auth.isLoggedIn}
            text="Compare Analyses"
            rightIcon={<GoArrowRight />}
            title="Log in to click"
          />
        </LoginToAccessBtnTooltip>
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* align-items: flex-start; */
  align-items: center;

  .MuiTooltip-root {
    background-color: red;
  }
  .MuiTooltip-tooltipPlacementBottom {
    bottom: 20px !important;
  }

  .MuiTooltip-popper {
    background: red;
    margin-top: 500px;
  }

  .AnalysisTitleRow-analysisBtnRow {
    display: flex;
  }
  .AnalysisTitleRow-analysisBtn {
    margin: ${theme.s2};
  }
`;
