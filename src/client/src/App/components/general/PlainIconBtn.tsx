import styled from "styled-components";
import { Button } from "@material-ui/core";

export default styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;
  border-radius: 0;
  background: transparent;
  :hover {
    background: transparent;
  }
  /* .icon {
    height: 90%;
    width: 90%;
  } */
`;
