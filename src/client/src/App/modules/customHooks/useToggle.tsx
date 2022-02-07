import * as React from "react";

export default function useToggle(init: boolean = false) {
  const [value, setValue] = React.useState(init);
  const toggle = () => setValue((prev) => !prev);
  const setOn = () => setValue(() => true);
  const setOff = () => setValue(() => false);

  return { value, setValue, toggle, setOn, setOff };
}
