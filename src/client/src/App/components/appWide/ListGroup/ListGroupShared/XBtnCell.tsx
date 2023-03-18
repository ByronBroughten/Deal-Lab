import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { RemoveSectionXBtn } from "../../RemoveSectionXBtn";

interface Props extends FeSectionInfo {
  className?: string;
}
export function XBtnCell({ className, ...rest }: Props) {
  return (
    <td className={`XBtnCell-root ${className ?? ""}`}>
      <RemoveSectionXBtn {...rest} />
    </td>
  );
}
