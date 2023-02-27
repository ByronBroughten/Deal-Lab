import { AiOutlineUnorderedList } from "react-icons/ai";
import styled from "styled-components";
import { nativeTheme } from "../../theme/nativeTheme";
import { MainSectionLargeEditBtn } from "../ActiveDealPage/ActiveDeal/MainSectionLargeEditBtn";
import { SectionTitle } from "../appWide/SectionTitle";

type Props = { title: string; editSection: () => void };
export function ComponentClosedTitleRow({ title, editSection }: Props) {
  return (
    <Styled className="MainSubSection-inactiveTitleRow">
      <SectionTitle className="UserListEditorSection-title" text={title} />
      <MainSectionLargeEditBtn
        {...{
          className: "UserListEditorSection-editIcon",
          middle: <AiOutlineUnorderedList size={20} />,
          onClick: editSection,
        }}
      />
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  .UserListEditorSection-editIcon {
    margin-left: ${nativeTheme.s15};
  }

  .UserListEditorSection-title {
    color: ${nativeTheme.primary.main};
    width: 200px;
  }
`;
