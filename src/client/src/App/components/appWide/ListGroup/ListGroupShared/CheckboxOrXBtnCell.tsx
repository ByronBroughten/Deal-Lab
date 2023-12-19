import { FeSectionInfo } from "../../../../../sharedWithServer/SectionInfos/FeInfo";
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
