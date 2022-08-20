import styled, { css } from "styled-components";
import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/Info";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import theme, { ThemeName } from "../../theme/Theme";

interface LabeledVarbNotFoundProps {
  className?: string;
  onXBtnClick?: () => void;
}
export function LoadedVarbNotFound({ ...rest }: LabeledVarbNotFoundProps) {
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

interface LabeledVarbProps extends LabeledVarbNotFoundProps {
  feInfo: FeSectionInfo;
}
export function LoadedVarb({ feInfo, ...rest }: LabeledVarbProps) {
  const section = useGetterSection(feInfo);
  const { virtualVarb } = section;
  const { entityId } = section.valueInEntityInfo();
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

export function LabeledVarb() {}

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

const Styled = styled.div<{ $themeName: ThemeName }>`
  position: relative;
  z-index: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  box-shadow: ${theme.boxShadow1};
  ${({ $themeName }) =>
    css`
      background: ${theme[$themeName].light};
    `}
  border-radius: ${theme.br0};
  padding: ${theme.s2};

  .LabeledVarb-label {
    font-weight: 700;
    color: ${theme["gray-700"]};
  }
  .LabeledVarb-output {
  }
`;
