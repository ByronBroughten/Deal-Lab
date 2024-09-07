import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

// Hook that alerts clicks outside of the passed ref
const useOnOutsideClickRef = (ref, onOutsideClick) => {
  useEffect(() => {
    // Alert if outside of element is clicked
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

// Component that alerts if you click outside of it
export default function OutsideAlerter({ toggle, children }) {
  const wrapperRef = useRef(null);
  useOnOutsideClickRef(wrapperRef, () => toggle(false));

  return (
    <Box onClick={() => toggle(true)} ref={wrapperRef}>
      {children}
    </Box>
  );
}
