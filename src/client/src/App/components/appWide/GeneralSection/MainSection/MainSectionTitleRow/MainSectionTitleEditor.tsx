import styled from "styled-components";
import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import theme from "../../../../../theme/Theme";
import { BigStringEditor } from "../../../../inputs/BigStringEditor";

type Props = { feInfo: FeInfoByType<"hasCompareTable">; className?: string };
export function MainSectionTitleEditor({ feInfo, className }: Props) {
  return (
    <Styled
      {...{
        feVarbInfo: { ...feInfo, varbName: "displayName" },
        placeholder: "Title",
        className: `MainSectionTitleRow-root ${className ?? ""}`,
      }}
    />
  );
}

const Styled = styled(BigStringEditor)`
  .DraftEditor-root {
    font-size: ${theme.smallTitleSize};
    padding: ${theme.s2} 0;
  }
  .DraftTextField-root {
    display: flex;
    min-width: 172px;
  }
`;
