import styled from "styled-components";
import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { BigStringEditor } from "../../../../inputs/BigStringEditor";

type Props = { feInfo: FeInfoByType<"hasCompareTable">; className?: string };
export function MainSectionTitleEditor({ feInfo, className }: Props) {
  return (
    <Styled
      {...{
        feVarbInfo: { ...feInfo, varbName: "displayName" },
        label: "Title",
        className: `MainSectionTitleRow-root ${className ?? ""}`,
      }}
    />
  );
}

const Styled = styled(BigStringEditor)`
  font-size: 20px;
  .DraftTextField-root {
    min-width: 150px;
  }
`;
