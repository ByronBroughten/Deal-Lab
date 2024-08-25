import { BiCaretDown, BiCaretRight } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import styled from "styled-components";
import { FeVarbInfo } from "../../../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { StrictOmit } from "../../../../../../../sharedWithServer/utils/types";
import useToggle from "../../../../../../modules/customHooks/useToggle";
import theme from "../../../../../../theme/Theme";
import { DealDetailRowsNext } from "./DealDetailRows";

interface DealDetailRowDropDownProps extends DealDetailRowEndPointProps {
  varbInfo: FeVarbInfo;
}
export function DealDetailRowDropDown({
  varbInfo,
  ...rest
}: DealDetailRowDropDownProps) {
  const { value: dropped, toggle: toggleDropped } = useToggle();
  const props = {
    ...rest,
    onClick: toggleDropped,
  };
  return (
    <>
      {dropped && (
        <>
          <DealDetailRowStyled
            {...{
              ...props,
              textMarker: <BiCaretDown />,
            }}
          />
          <DealDetailRowsNext {...{ varbInfo, level: props.level }} />
        </>
      )}
      {!dropped && (
        <DealDetailRowStyled
          {...{
            ...props,
            textMarker: <BiCaretRight />,
          }}
        />
      )}
    </>
  );
}

interface DealDetailRowEndPointProps
  extends StrictOmit<DealDetailRowStyledProps, "textMarker" | "onClick"> {}
export function DealDetailRowEndPoint(props: DealDetailRowEndPointProps) {
  return (
    <DealDetailRowStyled
      {...{
        ...props,
        textMarker: <BsDot />,
      }}
    />
  );
}

interface DealDetailRowStyledProps {
  level: number;
  displayName: string;
  displayVarb: string;
  solvableText?: string;
  textMarker: React.ReactElement;
  onClick?: () => void;
}
function DealDetailRowStyled({
  displayName,
  displayVarb,
  solvableText,
  textMarker,
  ...rest
}: DealDetailRowStyledProps) {
  return (
    <Styled {...rest} className="DealDetailRow-root">
      <span className="DealDetailRow-text">
        {textMarker}
        <span className="DealDetailRow-title">{`${displayName}`}</span>
        <span className="DealDetailRow-result">{`${displayVarb}`}</span>
        {solvableText && (
          <span className="DealDetailRow-solvableText">{`(${solvableText})`}</span>
        )}
      </span>
    </Styled>
  );
}

const Styled = styled.div<{ level: number }>`
  padding-top: ${theme.s2};
  padding-bottom: ${theme.s2};
  font-size: ${theme.smallTitleSize};
  width: 100%;
  background: ${theme.light};
  cursor: pointer;
  :hover {
    background: ${theme.successLight};
  }
  .DealDetailRow-text {
    display: flex;
    margin-left: ${({ level }) => `${1 * level}rem`};
    margin-right: ${theme.s2};
  }

  .DealDetailRow-title {
    color: ${theme.primaryNext};
    font-size: ${theme.smallTitleSize};
    margin-left: ${theme.s2};
  }

  .DealDetailRow-result {
    color: ${theme.dark};
    margin-left: ${theme.s3};
  }
  .DealDetailRow-solvableText {
    color: ${theme.dark};
    margin-left: ${theme.s2};
  }
`;
