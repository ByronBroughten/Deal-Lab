import { FeSectionInfo } from "../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { MuiRow } from "../../../general/MuiRow";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";

interface Props extends FeSectionInfo {
  className?: string;
}
export function XBtnCell({ className, ...rest }: Props) {
  return (
    <td className={`XBtnCell-root ${className ?? ""}`}>
      <MuiRow sx={{ justifyContent: "right" }}>
        <RemoveSectionXBtn {...rest} />
      </MuiRow>
    </td>
  );
}
