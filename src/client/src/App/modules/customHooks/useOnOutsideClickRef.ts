import React, { MutableRefObject } from "react";

type RefTypes = {
  div: HTMLDivElement;
  th: HTMLTableCellElement;
  general: HTMLElement;
};

// this only works correctly if the ref contains the button that is used
// to open the whatever this closes. Otherwise, the mousedown on that button
// closes the list, and then the mouse up opens it
export default function useOnOutsideClickRef<T extends keyof RefTypes = "div">(
  onOutsideClick: () => void,
  _?: T
): MutableRefObject<RefTypes[T] | null> {
  const componentRef = React.useRef<RefTypes[T] | null>(null);
  // this could take an array of refs.
  // thenI would just have to get the ref down to the popper.

  React.useEffect(() => {
    function handleClickOutside(event: any): void {
      componentRef.current?.contains(event.target) || onOutsideClick();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("focusin", handleClickOutside);

    // if this use effect is unmounted, unbind the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusin", handleClickOutside);
    };
  }, [componentRef, onOutsideClick]);
  return componentRef;
}

export function useOnOutsideClickEffect(
  onOutsideClick: () => void,
  refArr: React.MutableRefObject<HTMLElement | null>[]
): void {
  React.useEffect(() => {
    function handleClickOutside(event: any): void {
      let contains = false;
      for (const ref of refArr) {
        if (ref.current?.contains(event.target)) contains = true;
      }

      if (!contains) onOutsideClick();
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("focusin", handleClickOutside);

    // if this use effect is unmounted, unbind the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("focusin", handleClickOutside);
    };
  }, [refArr, onOutsideClick]);
}
