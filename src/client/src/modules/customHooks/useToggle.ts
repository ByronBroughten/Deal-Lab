import React from "react";

export function useToggle(init: boolean = false) {
  const [value, setValue] = React.useState(init);
  const toggle = React.useCallback(() => setValue((prev) => !prev), [setValue]);
  const setOn = React.useCallback(() => setValue(() => true), [setValue]);
  const setOff = React.useCallback(() => setValue(() => false), [setValue]);
  return { value, setValue, toggle, setOn, setOff };
}
