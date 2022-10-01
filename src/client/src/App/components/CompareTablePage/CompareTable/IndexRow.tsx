import { FormControl, RadioGroup } from "@material-ui/core";
import {
  useIndexTableRowActor,
  UseIndexTableRowActorProps,
} from "../../../modules/sectionActorHooks/useIndexTableRowActor";
import Radio from "../../general/Radio";
import TrashBtn from "../../general/TrashBtn";

export function IndexRow(props: UseIndexTableRowActorProps) {
  const indexRow = useIndexTableRowActor(props);
  const title = indexRow.get.value("displayName", "string");
  return (
    <tr className="CompareTable-tableRow">
      <td className="CompareTable-tableCell">
        <FormControl component="fieldset" className="radio-part">
          <RadioGroup>
            <Radio
              {...{
                name: "compare radio",
                value: indexRow.get.feId,
                checked: indexRow.isCompared(),
                onChange: () => indexRow.toggleCompare(),
              }}
            />
          </RadioGroup>
        </FormControl>
      </td>
      <td className="CompareTable-tableCell">{title}</td>
      {indexRow.cells.map((cell) => {
        const value = cell.value("displayVarb", "string");
        return <td className="CompareTable-tableCell">{value}</td>;
      })}
      <td className="CompareTable-tableCell">
        <TrashBtn
          className="CompareTable-trashBtn"
          onClick={() => indexRow.deleteSelf()}
        />
      </td>
    </tr>
  );
}
