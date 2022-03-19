import { BiCaretDown, BiCaretRight } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import styled from "styled-components";
import useToggle from "../../../../modules/customHooks/useToggle";
import { SpecificVarbInfo } from "../../../../sharedWithServer/Analyzer/SectionMetas/relSections/rel/relVarbInfoTypes";
import { InVarbInfo } from "../../../../sharedWithServer/Analyzer/StateSection/StateVarb";
import theme from "../../../../theme/Theme";
import useHowMany from "../../../appWide/customHooks/useHowMany";
import { AnalysisDetailRows } from "../AnalysisDetailRows";

export function AnalysisDetailRow({
  level,
  displayName,
  displayVarb,
  solvableText,
  inVarbInfos = [],
  varbInfo,
}: {
  level: number;
  displayName: string;
  displayVarb: string;
  solvableText?: string;
  inVarbInfos?: InVarbInfo[];
  varbInfo?: SpecificVarbInfo;
}) {
  const { value: dropped, toggle: toggleDropped } = useToggle();
  const { isAtLeastOne, areNone } = useHowMany(inVarbInfos);

  return (
    <>
      <Styled
        {...{ level, onClick: toggleDropped }}
        className="AnalysisDetails-row"
      >
        <span className="BasicAnalysis-item">
          {isAtLeastOne && (
            <>
              {!dropped && <BiCaretRight />}
              {dropped && <BiCaretDown />}
            </>
          )}
          {areNone && <BsDot />}
          <span className="title">{`${displayName}`}</span>
          <span className="result">{`${displayVarb}`}</span>
          {solvableText && (
            <span className="solvableText">{`(${solvableText})`}</span>
          )}
        </span>
      </Styled>
      {isAtLeastOne && dropped && varbInfo && (
        <AnalysisDetailRows
          {...{
            focalVarbInfo: varbInfo,
            inVarbInfos,
            level,
          }}
        />
      )}
    </>
  );
}

const Styled = styled.div<{ level: number }>`
  padding-left: ${({ level }) => `${1 * level}rem`};
  padding-top: ${theme.s2};
  padding-bottom: ${theme.s2};

  font-size: 1em;

  :hover {
    background: ${theme.analysis.light};
  }
  cursor: pointer;

  .BasicAnalysis-item {
    display: flex;
  }

  span.title {
    font-weight: bold;
    margin-left: ${theme.s2};
  }

  span.result {
    color: ${theme.dark};
    margin-left: ${theme.s2};
  }
  span.solvableText {
    color: ${theme["gray-700"]};
    color: ${theme.dark};
    margin-left: ${theme.s2};
  }
`;
