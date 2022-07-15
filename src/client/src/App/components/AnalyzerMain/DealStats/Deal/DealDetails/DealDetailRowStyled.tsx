import { BiCaretDown, BiCaretRight } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import styled from "styled-components";
import useToggle from "../../../../../modules/customHooks/useToggle";
import { FeVarbInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { StrictOmit } from "../../../../../sharedWithServer/utils/types";
import theme from "../../../../../theme/Theme";
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
          <DealDetailRowsNext
            {...{
              varbInfo,
              level: props.level,
            }}
          />
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
        <span className="title">{`${displayName}`}</span>
        <span className="result">{`${displayVarb}`}</span>
        {solvableText && (
          <span className="solvableText">{`(${solvableText})`}</span>
        )}
      </span>
    </Styled>
  );
}

const Styled = styled.div<{ level: number }>`
  .DealDetailRow-text {
    margin-left: ${({ level }) => `${1 * level}rem`};
    margin-right: ${theme.s2};
  }
  /* padding-left: ${({ level }) => `${1 * level}rem`}; */
  padding-top: ${theme.s2};
  padding-bottom: ${theme.s2};
  font-size: 1em;
  width: 100%;

  background: ${theme.deal.light};

  :hover {
    background: ${theme.deal.main};
  }
  cursor: pointer;

  .DealDetailRow-text {
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
