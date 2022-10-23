import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import styled from "styled-components";
import { FeSectionInfo } from "../../../../../sharedWithServer/SectionsMeta/Info";
import theme from "../../../../../theme/Theme";
import { RemoveSectionXBtn } from "../../../RemoveSectionXBtn";
import ListMenuBtn from "./ListMenuBtn";

interface Props extends FeSectionInfo {
  viewIsOpen: boolean;
  toggleListView: () => void;
}

export function ViewAndXMenu({ viewIsOpen, toggleListView, ...feInfo }: Props) {
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
      <RemoveSectionXBtn className="ViewAndXMenu-btn" {...feInfo} />
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
