import styled from "styled-components";
import theme from "../../../theme/Theme";
import SectionBtn from "../../appWide/SectionBtn";
import { useAnalyzerContext } from "../../../modules/usePropertyAnalyzer";
import { SectionName } from "../../../sharedWithServer/Analyzer/SectionMetas/SectionName";

type Props = {
  title: string;
  sectionName: SectionName<"hasOneParent">;
};
export default function AddSectionEntryBtn({ title, sectionName }: Props) {
  const { analyzer, handleAddSection } = useAnalyzerContext();
  return (
    <Styled
      className="AddSectionEntryBtn-root "
      onClick={() =>
        handleAddSection(sectionName, analyzer.parent(sectionName).feInfo)
      }
    >
      {title}
    </Styled>
  );
}

const Styled = styled(SectionBtn)`
  position: relative;
  width: 50%;
  background-color: ${({ theme }) => theme.section.light};
  color: ${theme.dark};
  :hover {
    background-color: ${({ theme }) => theme.section.border};
    color: ${theme.light};
  }
`;
