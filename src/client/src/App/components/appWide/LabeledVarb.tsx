import styled from "styled-components";
import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSectionsUtils/baseValues/entities";
import { useGetterVarbByEntity } from "../../sharedWithServer/stateClassHooks/useGetterVarbByEntity";
import theme from "../../theme/Theme";

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

interface LabeledVarbProps extends LabeledVarbNotFoundProps {
  entityVarbInfo: InEntityVarbInfo;
}
export function LabeledVarbNext({ entityVarbInfo, ...rest }: LabeledVarbProps) {
  // make useGetterVarbMixed
  const varb = useGetterVarbByEntity(entityVarbInfo);
  return (
    <StyledLabeledVarb
      {...{
        labelText: varb.displayName,
        displayVarb: varb.displayVarb(),
        labelId: varb.feId,
        ...rest,
      }}
    />
  );
}

interface StyledLabeledVarbProps extends LabeledVarbNotFoundProps {
  labelText: string;
  displayVarb: string;
  labelId: string;
}
function StyledLabeledVarb({
  labelId,
  className,
  labelText,
  displayVarb,
}: StyledLabeledVarbProps) {
  return (
    <Styled className={`LabeledVarb-root ${className ?? ""}`}>
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
  background: ${theme.deal.light};
  border-radius: ${theme.br0};
  padding: ${theme.s2};

  .LabeledVarb-label {
    font-weight: 700;
    color: ${theme["gray-700"]};
  }
  .LabeledVarb-output {
    font-size: 1.1rem;
  }
`;

// .LabeledVarb-labelPositioner {
//   position: relative;
//   z-index: 2;
//   top: 4px;

//   display: flex;
//   justify-content: center;

//   width: 100%;
//   height: 11px;
//   padding: 0 6px;
// }

// .LabeledVarb-label {
//   position: relative;
//   z-index: 3;
//   bottom: 0px;

//   padding: 0 2px;

//   font-size: 0.95rem;
//   white-space: nowrap;
//   color: ${theme["gray-700"]};
//   font-weight: bold;
// }

// .LabeledVarb-xBtn,
// .icon {
//   height: 1.1rem;
//   width: 1.1rem;
// }
// .LabeledVarb-xBtn {
//   padding: 0;
//   /* padding-right: 2px; */
//   border-radius: 1rem;

//   background: ${theme.plus.light};
//   :hover {
//     background-color: ${theme["gray-700"]};
//     color: white;
//   }
// }

// .LabeledVarb-output {
//   position: relative;
//   z-index: 1;
//   text-align: center;

//   border: 2px solid ${theme.plus.dark};
//   border-radius: ${theme.brMaterialEditor};

//   padding: ${theme.s2};
//   padding-top: 10px;
//   padding-bottom: ${theme.s1};

//   font-size: 1.05em;
//   color: ${theme.dark};
// }
