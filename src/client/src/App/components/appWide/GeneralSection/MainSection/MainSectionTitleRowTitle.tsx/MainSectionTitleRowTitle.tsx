import {
  FeInfo,
  InfoS,
} from "../../../../../sharedWithServer/SectionMetas/Info";
import BigStringEditor from "../../../../inputs/BigStringEditor";

type Props = { feInfo: FeInfo<"hasRowIndexStore"> };
export default function MainSectionTitleRowTitle({ feInfo }: Props) {
  return (
    <BigStringEditor
      {...{
        feVarbInfo: InfoS.feVarb("title", feInfo),
        label: "Title",
        className: "MainSectionTitleRow-title",
      }}
    />
  );
}
