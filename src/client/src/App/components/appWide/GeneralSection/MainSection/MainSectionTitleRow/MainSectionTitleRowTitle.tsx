import { FeInfoByType } from "../../../../../sharedWithServer/SectionsMeta/Info";
import { BigStringEditor } from "../../../../inputs/BigStringEditor";

type Props = { feInfo: FeInfoByType<"hasDisplayIndex"> };
export function MainSectionTitleRowTitle({ feInfo }: Props) {
  return (
    <BigStringEditor
      {...{
        feVarbInfo: { ...feInfo, varbName: "displayName" },
        label: "Title",
        className: "MainSectionTitleRow-title",
      }}
    />
  );
}
