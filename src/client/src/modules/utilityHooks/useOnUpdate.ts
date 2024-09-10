import React, { useEffect, useRef } from "react";

export default function useOnUpdate(func: Function, dependencies: any[]) {
  const updateRef = useRef(false);
  useEffect(() => {
    if (updateRef.current) {
      func();
    } else {
      updateRef.current = true;
    }
  }, dependencies);
}
