import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { MuiStandardPropsNext } from "../general/StandardProps";
import { XBtn } from "./Xbtn";

interface Props extends MuiStandardPropsNext, FeSectionInfo {}
export function RemoveSectionXBtn({ sectionName, feId, ...rest }: Props) {
  const removeSection = useAction("removeSelf");
  return (
    <XBtn
      {...{
        onClick: () => removeSection({ sectionName, feId }),
        ...rest,
      }}
    />
  );
}
