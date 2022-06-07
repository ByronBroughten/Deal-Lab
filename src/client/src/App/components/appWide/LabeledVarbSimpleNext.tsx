import { AiOutlineCloseCircle } from "react-icons/ai";
import styled, { css } from "styled-components";
import { VarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useGetterSections } from "../../sharedWithServer/stateClassHooks/useGetterSections";
import { GetterVarb } from "../../sharedWithServer/StateGetters/GetterVarb";
import theme, { ThemeSectionName } from "../../theme/Theme";
import PlainBtn from "../general/PlainBtn";

type UseLabeledOutputProps = {
  feVarbInfo?: VarbInfo;
  displayVarb?: string;
  displayLabel?: string;
  parenthInfo?: VarbInfo | string;
};
function useLabeledOutput({
  feVarbInfo,
  displayLabel,
  displayVarb,
  parenthInfo,
  ...adornments
}: UseLabeledOutputProps): { displayLabel: string; displayVarb: string } {
  const sections = useGetterSections();
  if (!feVarbInfo || !sections.hasSection(feVarbInfo))
    return {
      displayLabel: "Variable not found",
      displayVarb: "?",
    };

  const varb = sections.varb(feVarbInfo);
  displayLabel = displayLabel ?? varb.displayName;
  displayVarb = displayVarb ?? varb.displayVarb(adornments);

  if (parenthInfo) {
    if (typeof parenthInfo === "string")
      displayVarb = `${displayVarb} (${parenthInfo})`;
    else
      displayVarb = `${displayVarb} (${sections
        .varb(parenthInfo)
        .displayVarb()})`;
  }
  return { displayLabel, displayVarb };
}

type LabeledVarbProps = UseLabeledOutputProps & {
  feVarbInfo: VarbInfo;
  onXBtnClick?: () => void;
  className?: string;
  themeSectionName?: ThemeSectionName;
};
export function LabeledVarbSimpleNext({
  feVarbInfo,
  className,
  onXBtnClick,
  themeSectionName = "default",
  ...rest
}: LabeledVarbProps) {
  const varbId = GetterVarb.feVarbInfoToVarbId(feVarbInfo);
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
