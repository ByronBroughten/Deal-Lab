import * as React from "react";
import useOnOutsideClickRef from "./useOnOutsideClickRef";

export const useFakeDropped = () => {
  const unDropRef = React.useRef(null);
  const drop = React.useCallback(() => null, []);
  return { dropped: false, drop, unDropRef };
};

const useDropped = (fake = false) => {
  const [dropped, setDropped] = React.useState(false);
  const drop = React.useCallback(() => setDropped(true), []);
  const unDropRef = useOnOutsideClickRef(() => setDropped(false));
  return { dropped, drop, unDropRef };
};

export default useDropped;
