import {
  useTableActor,
  UseTableActorProps,
} from "../../../modules/sectionActorHooks/useTableActor";
import ColumnHeader from "./ColumnTableHeaderRow/ColumnHeader";

interface Props extends UseTableActorProps {}
export function CompareTableHeaderRow(props: Props) {
  const table = useTableActor(props);
  return (
    <tr>
      <ColumnHeader
        {...{
          displayName: "Title",
          // 2. I don't yet have a mechanism for comparing properties
          //    - Add a button to the tableRow
          //    - When the button is clicked, it lights up, a proxy row is added
          //      and its value is the feId of the row
          //    - When the button is clicked again, that feId is used to erase the row

          //    - Whether the button is alight may be determined by whether
          //      the proxy rows contain its feId

          // 3. Make a component that takes rows and displays them in a table.
          //    It shouldn't have columns.
          //    Actually, it should allow for columns as an option

          // 3. Adding a column should create all new rows
          sortRowsAZ: () => table.sortRowsByDisplayName(),
          sortRowsZA: () => table.sortRowsByDisplayName({ reverse: true }),
        }}
      />
      {table.columns.map((col) => {
        return (
          <ColumnHeader
            {...{
              key: col.feId,
              displayName: col.displayNameOrNotFound,
              sortRowsAZ: () => table.sortRowsByColumn(col.feId),
              sortRowsZA: () =>
                table.sortRowsByColumn(col.feId, { reverse: true }),
              removeColumn: () => table.removeColumn(col.feId),
            }}
          />
        );
      })}
      <ColumnHeader
        {...{
          displayName: "Compare",
        }}
      />
      {/* <th className="ColumnHeader-trashBtn" /> */}
    </tr>
  );
}
