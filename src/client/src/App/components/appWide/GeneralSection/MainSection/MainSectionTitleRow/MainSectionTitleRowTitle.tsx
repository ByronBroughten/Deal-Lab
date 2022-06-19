import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { BigStringEditor } from "../../../../inputs/BigStringEditor";

type Props = { feInfo: FeInfoByType<"hasRowIndex"> };
export function MainSectionTitleRowTitleNext({ feInfo }: Props) {
  return (
    <BigStringEditor
      {...{
        feVarbInfo: { ...feInfo, varbName: "title" },
        label: "Title",
        className: "MainSectionTitleRow-title",
      }}
    />
  );
}
