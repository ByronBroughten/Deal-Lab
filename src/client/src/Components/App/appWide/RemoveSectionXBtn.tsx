import { FeSectionInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { FeStoreInfo } from "../../../sharedWithServer/stateSchemas/sectionStores";
import { useAction, useActionWithProps } from "../../../stateHooks/useAction";
import { MuiStandardPropsNext } from "../../general/StandardProps";
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
