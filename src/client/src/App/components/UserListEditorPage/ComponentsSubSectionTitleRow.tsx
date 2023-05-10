import styled from "styled-components";
import { nativeTheme } from "../../theme/nativeTheme";
import { MainSectionLargeEditBtn } from "../ActiveDealPage/ActiveDeal/MainSectionLargeEditBtn";
import ChunkTitle from "../general/ChunkTitle";

type Props = { icon: React.ReactNode; title: string; editSection: () => void };
export function ComponentClosedTitleRow({ title, icon, editSection }: Props) {
  return (
    <Styled className="MainSubSection-inactiveTitleRow">
      <ChunkTitle sx={{ color: nativeTheme.primary.main, width: "250px" }}>
        {title}
      </ChunkTitle>
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
`;
