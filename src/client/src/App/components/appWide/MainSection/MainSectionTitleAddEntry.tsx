import AddSectionEntryBtn from "./AddSectionEntryBtn";
import { MainSectionTitleStyled } from "./MainSectionTitle";
import styled from "styled-components";
import { themeSectionNameOrDefault } from "../../../theme/Theme";
import { SectionName } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";

type Props = {
  title: string;
  sectionName: SectionName<"hasOneParent">;
  btnTitle: string;
};
export default function MainSectionTitleAddEntry({
  title,
  sectionName,
  btnTitle,
}: Props) {
  return (
    <Styled
      {...{ sectionName: themeSectionNameOrDefault(sectionName) }}
      className="main-section-title"
    >
      <h4>{title}</h4>
      <AddSectionEntryBtn {...{ sectionName, title: btnTitle }} />
      <h4 className="MainSectionTitleAddEntry-invisibleTitle">{title}</h4>
    </Styled>
  );
}
const Styled = styled(MainSectionTitleStyled)`
  z-index: 0;
  .MainSectionTitleAddEntry-invisibleTitle {
    visibility: hidden;
  }
`;
