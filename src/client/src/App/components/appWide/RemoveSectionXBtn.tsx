import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useRemoveSelf } from "../../sharedWithServer/stateClassHooks/useReduceActions";
import { MuiStandardProps } from "../general/StandardProps";
import { XBtn } from "./Xbtn";

interface Props extends MuiStandardProps, FeSectionInfo {}

export function RemoveSectionXBtn({ sectionName, feId, ...rest }: Props) {
  const removeSelf = useRemoveSelf();
  return (
    <XBtn
      {...{
        onClick: () => removeSelf({ sectionName, feId }),
        ...rest,
      }}
    />
  );
}
