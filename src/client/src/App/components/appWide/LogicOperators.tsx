import React from "react";
import { MenuItem } from "@material-ui/core";
import { LogicOperator } from "../../sharedWithServer/Analyzer/methods/solveVarbs/solveAndUpdateValue/updateUserVarb";

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
