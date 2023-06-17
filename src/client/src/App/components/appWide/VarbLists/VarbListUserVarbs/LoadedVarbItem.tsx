import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import {
  DisplayNameNotFoundCell,
  EntityDisplayNameCell,
} from "../../ListGroup/ListGroupShared/DisplayNameCell";
import { VarbListItemStyledNext } from "../../ListGroup/ListGroupShared/VarbListItemStyled";
import { XBtnCell } from "../../ListGroup/ListGroupShared/XBtnCell";

type Props = { feId: string; storeId?: string };
export function LoadedVarbItem({ feId, storeId }: Props) {
  const feInfo = { sectionName: "outputItem", feId } as const;

  const outputItem = useGetterSection(feInfo);
  const varbInfo = outputItem.valueNext("valueEntityInfo");

  return (
    <VarbListItemStyledNext>
      {varbInfo ? (
        <EntityDisplayNameCell
          {...{
            focalInfo: feInfo,
            varbInfo,
          }}
        />
      ) : (
        <DisplayNameNotFoundCell />
      )}
      <XBtnCell {...{ ...feInfo, storeId }} />
    </VarbListItemStyledNext>
  );
}
