import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styled from "styled-components";
import theme from "../../../../../theme/Theme";
import XBtn from "../../../Xbtn";
import ListMenuBtn from "./ListMenuBtn";

type Props = {
  viewIsOpen: boolean;
  removeSelf: () => void;
  toggleListView: () => void;
};

export function ViewAndXMenu({
  viewIsOpen,
  toggleListView,
  removeSelf,
}: Props) {
  return (
    <Styled className="ViewAndXMenu">
      <ListMenuBtn
        themeName={"default"}
        className="ViewAndXMenu-btn"
        onClick={toggleListView}
      >
        {viewIsOpen && <FiMinimize2 size={15} />}
        {!viewIsOpen && <FiMaximize2 size={15} />}
      </ListMenuBtn>
      <XBtn className="ViewAndXMenu-btn" onClick={removeSelf} />
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  .ViewAndXMenu-btn {
    margin: ${theme.s1};
    margin-top: 0;
    width: 24px;
    height: 24px;
    :last-child {
      margin-right: 0;
    }
  }
`;
