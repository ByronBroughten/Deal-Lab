import React from "react";
import { isEqual } from "lodash";

export default function useDidChange(obj1: any, obj2: any) {
  return React.useMemo(() => {
    return !isEqual(obj1, obj2);
  }, [obj1, obj2]);
}
