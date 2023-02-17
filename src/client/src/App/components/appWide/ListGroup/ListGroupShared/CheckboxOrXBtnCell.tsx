import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { CheckboxCell } from "./CheckboxCell";
import { XBtnCell } from "./XBtnCell";

interface Props extends FeSectionInfo {
  className?: string;
  checkmarkVarbName?: string;
}
export function CheckboxOrXBtnCell({ checkmarkVarbName, ...rest }: Props) {
  return checkmarkVarbName ? (
    <CheckboxCell
      {...{
        ...rest,
        varbName: checkmarkVarbName,
      }}
    />
  ) : (
    <XBtnCell {...rest} />
  );
}
