import styled from "styled-components";
import { nativeTheme } from "../../theme/nativeTheme";
import { MainSectionLargeEditBtn } from "../ActiveDealPage/ActiveDeal/MainSectionLargeEditBtn";
import { SectionTitle } from "../appWide/SectionTitle";

type Props = { icon: React.ReactNode; title: string; editSection: () => void };
export function ComponentClosedTitleRow({ title, icon, editSection }: Props) {
  return (
    <Styled className="MainSubSection-inactiveTitleRow">
      <SectionTitle className="UserListEditorSection-title" text={title} />
      <MainSectionLargeEditBtn
        {...{
          sx: { borderRadius: nativeTheme.br0 },
          className: "UserListEditorSection-editIcon",
          middle: icon,
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
