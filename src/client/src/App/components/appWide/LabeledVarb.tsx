import styled from "styled-components";
import {
  FeSectionInfo,
  FeVarbInfo,
} from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useGetterSection } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { useGetterVarb } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { nativeTheme } from "../../theme/nativeTheme";
import theme, { ThemeName } from "../../theme/Theme";

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

export interface LabeledVarbProps
  extends LabeledVarbNotFoundProps,
    FeVarbInfo {}
export function LabeledVarb({
  varbName,
  sectionName,
  feId,
  ...rest
}: LabeledVarbProps) {
  const varb = useGetterVarb({ varbName, sectionName, feId });
  return (
    <StyledLabeledVarb
      {...{
        labelText: varb.displayName,
        displayVarb: varb.displayVarb(),
        labelId: varb.varbId,
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
