import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { FeStoreInfo } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { MuiStandardPropsNext } from "../general/StandardProps";
import { useActionWithProps } from "./../../sharedWithServer/stateClassHooks/useAction";
import { XBtn } from "./Xbtn";

interface Props extends MuiStandardPropsNext, FeSectionInfo {}
export function RemoveSectionXBtn({ sectionName, feId, ...rest }: Props) {
  const removeSection = useActionWithProps("removeSelf", { sectionName, feId });
  return (
    <XBtn
      {...{
        onClick: removeSection,
        ...rest,
      }}
    />
  );
}

interface RmFromStoreProps extends MuiStandardPropsNext, FeStoreInfo {}
export function RemoveFromStoreXBtn({
  storeName,
  feId,
  ...rest
}: RmFromStoreProps) {
  const removeSection = useActionWithProps("removeFromStore", {
    storeName,
    feId,
  });
  return (
    <XBtn
      {...{
        onClick: removeSection,
        ...rest,
      }}
    />
  );
}
