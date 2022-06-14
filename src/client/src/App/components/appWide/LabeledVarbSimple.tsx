import { AiOutlineCloseCircle } from "react-icons/ai";
import styled, { css } from "styled-components";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/relSections/rel/relVarbInfoTypes";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import theme, { ThemeName } from "../../theme/Theme";
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

type LabeledVarbProps = UseLabeledOutputProps & {
  feVarbInfo: FeVarbInfo;
  onXBtnClick?: () => void;
  className?: string;
  themeName?: ThemeName;
};
export function LabeledVarbSimple({
  feVarbInfo,
  className,
  onXBtnClick,
  themeName = "default",
  ...rest
}: LabeledVarbProps) {
  const varbId = GetterVarb.feVarbInfoToVarbId({
    ...feVarbInfo,
    feId: feVarbInfo.id,
  });

  const { displayLabel, displayVarb } = useLabeledOutput({
    feVarbInfo,
    ...rest,
  });
  return (
    <Styled
      className={`LabeledVarb-root ${className}`}
      {...{ $themeName: themeName }}
    >
      <div className="LabeledVarb-labelPositioner">
        <label htmlFor={varbId} className="LabeledVarb-label">
          {displayLabel}
        </label>
        {onXBtnClick && (
          <PlainBtn className="LabeledVarb-xBtn" onClick={onXBtnClick}>
            <AiOutlineCloseCircle className="icon" />
          </PlainBtn>
        )}
      </div>
      <output
        id={varbId}
        className="LabeledVarb-output"
      >{`${displayVarb}`}</output>
    </Styled>
  );
}

const Styled = styled.div<{ $themeName: ThemeName }>`
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

    ${({ $themeName }) => css`
      background: ${theme[$themeName].light};
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

    ${({ $themeName }) => css`
      background: ${theme[$themeName].light};
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

    ${({ $themeName }) => css`
      border: 2px solid ${theme[$themeName].dark};
    `}

    border-radius: ${theme.brMaterialEditor};

    padding: ${theme.s2};
    padding-top: 10px;
    padding-bottom: ${theme.s1};

    font-size: 1.05em;
    color: ${theme.dark};
  }
`;
