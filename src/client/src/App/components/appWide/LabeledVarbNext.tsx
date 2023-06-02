import styled from "styled-components";
import {
  FeSectionInfo,
  FeVarbInfo,
  FeVarbInfoNext,
} from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { useGetterSections } from "../../sharedWithServer/stateClassHooks/useGetterSections";
import { nativeTheme } from "../../theme/nativeTheme";
import theme, { ThemeName } from "../../theme/Theme";
import { useVarbInfoText } from "../customHooks/useVarbInfoText";

export interface LabeledVarbProps extends LabeledVarbNotFoundProps {
  finder: FeVarbInfo | FeVarbInfo[];
}
export function LabeledVarbNext({ finder, ...rest }: LabeledVarbProps) {
  if (!Array.isArray(finder)) {
    finder = [finder];
  }

  if (finder.length === 0) {
    throw new Error("finder is empty");
  }

  const { inputLabel } = useVarbInfoText(finder[0] as FeVarbInfoNext);

  let toDisplay = "";
  const sections = useGetterSections();
  for (let i = 0; i < finder.length; i++) {
    const varb = sections.varb(finder[i]);
    if (i > 0) {
      toDisplay += " | ";
    }
    toDisplay += varb.displayVarb();
  }

  return (
    <StyledLabeledVarb
      {...{
        labelText: inputLabel,
        displayVarb: toDisplay,
        labelId: inputLabel,
        ...rest,
      }}
    />
  );
}

interface LabeledVarbNotFoundProps {
  className?: string;
  onXBtnClick?: () => void;
}
export function LabeledVarbNotFound({ ...rest }: LabeledVarbNotFoundProps) {
  return (
    <StyledLabeledVarb
      {...{
        labelId: "variable not found",
        labelText: "Variable not found",
        displayVarb: "?",
        ...rest,
      }}
    />
  );
}

export interface LoadedVarbProps extends LabeledVarbNotFoundProps {
  feInfo: FeSectionInfo;
}
export function LoadedVarb({ feInfo, ...rest }: LoadedVarbProps) {
  const section = useGetterSection(feInfo);
  const { virtualVarb } = section;
  const { entityId } = section.valueEntityInfo();
  return (
    <StyledLabeledVarb
      {...{
        labelText: virtualVarb.displayName,
        displayVarb: virtualVarb.displayVarb(),
        labelId: entityId,
        ...rest,
      }}
    />
  );
}

interface StyledLabeledVarbProps extends LabeledVarbNotFoundProps {
  labelText: string;
  displayVarb: string;
  labelId: string;
  themeName?: ThemeName;
}
export function StyledLabeledVarb({
  labelId,
  className,
  labelText,
  displayVarb,
  themeName = "deal",
}: StyledLabeledVarbProps) {
  return (
    <Styled
      {...{
        $themeName: themeName,
        className: `LabeledVarb-root ${className ?? ""}`,
      }}
    >
      <div className="LabeledVarb-labelPositioner">
        <label htmlFor={labelId} className="LabeledVarb-label">
          {labelText}
        </label>
        {/* {onXBtnClick && (
          <PlainBtn className="LabeledVarb-xBtn" onClick={onXBtnClick}>
            <AiOutlineCloseCircle className="icon" />
          </PlainBtn>
        )} */}
      </div>
      <output
        id={labelId}
        className="LabeledVarb-output"
      >{`${displayVarb}`}</output>
    </Styled>
  );
}

const Styled = styled.div`
  position: relative;
  z-index: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  box-shadow: ${theme.boxShadow1};
  background: transparent;

  border: solid 1px ${nativeTheme["gray-300"]};
  box-shadow: none;

  border-radius: ${theme.br0};
  padding: ${theme.s3};

  .LabeledVarb-label {
    white-space: nowrap;
    color: ${nativeTheme.darkBlue.main};
  }
  .LabeledVarb-output {
    margin-top: ${theme.s2};
    color: ${theme.dark};
  }
`;
