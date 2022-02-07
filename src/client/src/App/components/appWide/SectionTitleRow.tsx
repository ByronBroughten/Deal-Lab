import React from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";
import useToggleView from "../../modules/customHooks/useToggleView";
import theme from "../../theme/Theme";

type Props = {
  [key: string]: any;
  title?: string;
  leftSide?: any;
  rightSide?: any;
};

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

export default React.forwardRef(
  ({ title, leftSide, rightSide, className, ...rest }: Props, ref) => (
    <Styled
      className={"section-title-row " + className}
      ref={ref as any}
      {...rest}
    >
      <Box display="flex" className="left-side">
        {leftSide}
      </Box>
      <Box display="flex" className="right-side">
        {rightSide}
      </Box>
    </Styled>
  )
);

const Styled = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;

  .right-side {
    button {
      margin-left: ${theme.s2};
    }
    .toggle-view-btn {
      padding: 0;
      .icon {
        height: ${theme.smallToggleViewIcon};
        width: ${theme.smallToggleViewIcon};
      }
    }
  }
`;
