import { MenuItem } from "@material-ui/core";
import React from "react";
import { LogicOperator } from "../../sharedWithServer/StateSolvers/SolveValueVarb/UserVarbValueSolver";

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
