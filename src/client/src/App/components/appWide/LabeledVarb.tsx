import { AiOutlineCloseCircle } from "react-icons/ai";
import styled, { css } from "styled-components";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { FeVarbInfo } from "../../sharedWithServer/SectionMetas/relSections/rel/relVarbInfoTypes";
import theme, { ThemeSectionName } from "../../theme/Theme";
import PlainBtn from "../general/PlainBtn";

type UseLabeledOutputProps = {
  feVarbInfo?: FeVarbInfo;
  displayVarb?: string;
  displayLabel?: string;
  parenthInfo?: FeVarbInfo | string;
};
function useLabeledOutput({
  feVarbInfo,
  displayLabel,
  displayVarb,
  parenthInfo,
  ...adornments
}: UseLabeledOutputProps): { displayLabel: string; displayVarb: string } {
  const { analyzer } = useAnalyzerContext();
  if (!feVarbInfo || !analyzer.hasSection(feVarbInfo))
    return {
      displayLabel: "Variable not found",
      displayVarb: "?",
    };

  displayLabel = displayLabel ?? analyzer.displayName(feVarbInfo);
  displayVarb =
    displayVarb ?? analyzer.varb(feVarbInfo).displayVarb(adornments);

  if (parenthInfo) {
    if (typeof parenthInfo === "string")
      displayVarb = `${displayVarb} (${parenthInfo})`;
    else
      displayVarb = `${displayVarb} (${analyzer
        .varb(parenthInfo)
        .displayVarb()})`;
  }
  return { displayLabel, displayVarb };
}

type Props = UseLabeledOutputProps & {
  id: string;
  onXBtnClick?: () => void;
  className?: string;
  themeSectionName?: ThemeSectionName;
};
export default function LabeledVarb({
  id,
  feVarbInfo,
  className,
  onXBtnClick,
  themeSectionName = "default",
  ...rest
}: Props) {
  const { displayLabel, displayVarb } = useLabeledOutput({
    feVarbInfo,
    ...rest,
  });
  return (
    <Styled
      className={`LabeledVarb-root ${className}`}
      {...{ $themeSectionName: themeSectionName }}
    >
      <div className="LabeledVarb-labelPositioner">
        <label htmlFor={id} className="LabeledVarb-label">
          {displayLabel}
        </label>
        {onXBtnClick && (
          <PlainBtn className="LabeledVarb-xBtn" onClick={onXBtnClick}>
            <AiOutlineCloseCircle className="icon" />
          </PlainBtn>
        )}
      </div>
      <output id={id} className="LabeledVarb-output">{`${displayVarb}`}</output>
    </Styled>
  );
}

const Styled = styled.div<{ $themeSectionName: ThemeSectionName }>`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 0;

  .LabeledVarb-labelPositioner {
    position: relative;
    z-index: 2;
    top: 4px;

    display: flex;
    justify-content: center;

    width: 100%;
    height: 11px;
    padding: 0 6px;
  }

  .LabeledVarb-label {
    position: relative;
    z-index: 3;
    bottom: 0px;
    background: ${theme.plus.light};

    ${({ $themeSectionName }) => css`
      background: ${theme[$themeSectionName].light};
    `}

    padding: 0 2px;

    font-size: 0.95rem;
    white-space: nowrap;
    color: ${theme["gray-700"]};
    font-weight: bold;
  }

  .LabeledVarb-xBtn,
  .icon {
    height: 1.1rem;
    width: 1.1rem;
  }
  .LabeledVarb-xBtn {
    padding: 0;
    /* padding-right: 2px; */
    border-radius: 1rem;

    ${({ $themeSectionName }) => css`
      background: ${theme[$themeSectionName].light};
    `}
    :hover {
      background-color: ${theme["gray-700"]};
      color: white;
    }
  }

  .LabeledVarb-output {
    position: relative;
    z-index: 1;
    text-align: center;

    ${({ $themeSectionName }) => css`
      border: 2px solid ${theme[$themeSectionName].dark};
    `}

    border-radius: ${theme.brMaterialEditor};

    padding: ${theme.s2};
    padding-top: 10px;
    padding-bottom: ${theme.s1};

    font-size: 1.05em;
    color: ${theme.dark};
  }
`;
