import styled from "styled-components";
import { InEntityVarbInfo } from "../../sharedWithServer/SectionsMeta/baseSections/baseValues/entities";
import { useGetterVarbByEntity } from "../../sharedWithServer/stateClassHooks/useGetterVarbByEntity";
import theme from "../../theme/Theme";
import { GetterVarb } from "./../../sharedWithServer/StateGetters/GetterVarb";

type LabeledVarbProps = {
  className?: string;
  entityVarbInfo: InEntityVarbInfo;
  onXBtnClick?: () => void;
};
export function LabeledVarbNotFound({
  entityVarbInfo,
  ...rest
}: LabeledVarbProps) {
  return (
    <StyledLabeledVarb
      {...{
        entityVarbInfo,
        labelText: "Variable not found",
        displayVarb: "?",
        ...rest,
      }}
    />
  );
}

export function LabeledVarbNext({ entityVarbInfo, ...rest }: LabeledVarbProps) {
  // make useGetterVarbMixed
  const varb = useGetterVarbByEntity(entityVarbInfo);
  return (
    <StyledLabeledVarb
      {...{
        entityVarbInfo,
        labelText: varb.displayName,
        displayVarb: varb.displayVarb(),
        ...rest,
      }}
    />
  );
}

interface StyledLabeledVarbProps extends LabeledVarbProps {
  labelText: string;
  displayVarb: string;
}
function StyledLabeledVarb({
  className,
  entityVarbInfo,
  labelText,
  displayVarb,
}: StyledLabeledVarbProps) {
  const labelId = GetterVarb.mixedVarbInfoToMixedVarbId(entityVarbInfo);
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
  background: ${theme.analysis.light};
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
