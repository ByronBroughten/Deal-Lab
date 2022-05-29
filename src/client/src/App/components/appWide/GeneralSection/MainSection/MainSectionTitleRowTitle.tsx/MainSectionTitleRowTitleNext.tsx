import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { BigStringEditorNext } from "../../../../inputs/BigStringEditorNext";

type Props = { feInfo: FeInfoByType<"hasRowIndex"> };
export function MainSectionTitleRowTitleNext({ feInfo }: Props) {
  return (
    <BigStringEditorNext
      {...{
        feVarbInfo: { ...feInfo, varbName: "title" },
        label: "Title",
        className: "MainSectionTitleRow-title",
      }}
    />
  );
}
