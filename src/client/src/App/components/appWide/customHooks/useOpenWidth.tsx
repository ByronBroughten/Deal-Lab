import React from "react";
import useToggleView from "../../../modules/customHooks/useToggleView";

export function useOpenWidth() {
  const [width, setWidth] = React.useState<string | null>(null);
  const { viewIsOpen, toggleView } = useToggleView();

  const ref = React.useRef(null);

  function updateWidth() {
    if (ref.current && viewIsOpen) {
      // @ts-ignore
      const newWidth = ref.current.offsetWidth;
      setWidth(`${newWidth}px`);
    } else setWidth(null);
  }

  function trackWidthToggleView() {
    updateWidth();
    toggleView();
  }

  return { style: { width }, viewIsOpen, ref, trackWidthToggleView };
}
