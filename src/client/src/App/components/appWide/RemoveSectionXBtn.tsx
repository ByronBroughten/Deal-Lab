import { FeSectionInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { FeStoreInfo } from "../../sharedWithServer/SectionsMeta/sectionStores";
import { MuiStandardPropsNext } from "../general/StandardProps";
import {
  useAction,
  useActionWithProps,
} from "./../../sharedWithServer/stateClassHooks/useAction";
import { XBtn } from "./Xbtn";

interface Props extends MuiStandardPropsNext, FeSectionInfo {}
export function RemoveSectionXBtn({ sectionName, feId, ...rest }: Props) {
  const removeSelf = useAction("removeSelf");
  return (
    <XBtn
      {...{
        onClick: () =>
          removeSelf({
            sectionName,
            feId,
          }),
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
