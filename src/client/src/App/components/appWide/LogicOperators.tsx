import { MenuItem } from "@mui/material";
import { LogicOperator } from "../../../sharedWithServer/StateOperators/Solvers/ValueUpdateVarb/ConditionalValueSolver";

const valueChildObj: Record<LogicOperator, string> = {
  "===": "=",
  "!==": "≠",
  ">": ">",
  ">=": "≥",
  "<": "<",
  "<=": "≤",
  "is in": "is in",
  "isn't in": "isn't in",
};

export default function LogicOperators() {
  return Object.entries(valueChildObj).map(([value, child]) => (
    <MenuItem key={value} value={value}>
      {child}
    </MenuItem>
  ));
}
