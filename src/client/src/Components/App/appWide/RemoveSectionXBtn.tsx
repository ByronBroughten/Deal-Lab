import {
  useAction,
  useActionWithProps,
} from "../../../modules/stateHooks/useAction";
import { FeSectionInfo } from "../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { FeStoreInfo } from "../../../sharedWithServer/stateSchemas/schema6SectionChildren/sectionStores";
import { MuiStandardProps } from "../../general/StandardProps";
import { XBtn } from "./Xbtn";

interface Props extends MuiStandardProps, FeSectionInfo {}
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

interface RmFromStoreProps extends MuiStandardProps, FeStoreInfo {}
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
