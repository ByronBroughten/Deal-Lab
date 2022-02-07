import { listGroupCss } from "./ListGroup";
import styled from "styled-components";
import { StandardProps } from "../../../general/StandardProps";

type Props = StandardProps & {
  titleText?: string;
};
export default function ListGroupShell({
  className,
  titleText,
  children,
}: Props) {
  return (
    <Styled className={`ListGroup-root ` + className ?? ""}>
      <div className="ListGroup-viewable">
        {titleText && (
          <div className="ListGroup-titleRow">
            <h6 className="ListGroup-titleText">{titleText}</h6>
          </div>
        )}

        <div className="ListGroup-lists">{children}</div>
      </div>
    </Styled>
  );
}

const Styled = styled.div`
  ${listGroupCss}
`;
