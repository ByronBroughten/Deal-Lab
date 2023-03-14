import { Switch } from "@mui/material";
import styled from "styled-components";
import {
  useIndexTableRowActor,
  UseIndexTableRowActorProps,
} from "../../../modules/sectionActorHooks/useIndexTableRowActor";
import theme from "../../../theme/Theme";

export function IndexRow(props: UseIndexTableRowActorProps) {
  const indexRow = useIndexTableRowActor(props);
  const title = indexRow.get.value("displayName", "string");
  return (
    <Styled className="CompareTable-tableRow">
      <td className="CompareTable-tableCell">{title}</td>
      {indexRow.cells.map((cell) => {
        const value = cell.value("displayVarb", "string");
        return (
          <td className="CompareTable-tableCell" key={cell.feId}>
            {value}
          </td>
        );
      })}
      <td className="CompareTable-tableCell">
        <Switch
          {...{
            name: "compare radio",
            value: indexRow.get.feId,
            checked: indexRow.isCompared(),
            onChange: () => indexRow.toggleCompare(),
            size: "small",
            color: "primary",
          }}
        />
      </td>
    </Styled>
  );
}

const Styled = styled.tr`
  .CompareTable-tableCell {
    padding: 0 ${theme.s35};
  }

  :hover {
    background: ${theme.tertiary};
    .CompareTable-trashBtn {
      visibility: visible;
    }
  }
  :not(:first-child) {
    border-top: 1px solid ${theme.primary};
  }
`;
