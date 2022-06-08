import { Button } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useLoginActor } from "../../modules/sectionActorHooks/useLoginActor";
import { LoginFormData } from "../../sharedWithServer/apiQueriesShared/login";
import theme from "../../theme/Theme";
import DropdownForm from "../general/DropdownForm";
import SmallFormTextField from "../general/SmallFormTextField";

export function LoginForm() {
  const loginVarbNames: (keyof LoginFormData)[] = ["email", "password"];
  const loginActor = useLoginActor();
  return (
    <StyledLoginForm>
      {loginVarbNames.map((varbName) => (
        <SmallFormTextField
          {...{
            key: varbName,
            ...loginActor.varb(varbName).inputProps("string"),
            ...(varbName === "password" && { type: "password" }),
          }}
        />
      ))}
      <Button
        className="submit-btn"
        variant="contained"
        onClick={() => loginActor.login()}
      >
        Login
      </Button>
    </StyledLoginForm>
  );
}
const StyledLoginForm = styled(DropdownForm)`
  .submit-btn {
    width: 100%;
    background-color: ${theme.plus.main};
    border: 1px solid ${theme.plus.main};
    :hover,
    :focus {
      background-color: ${theme.plus.dark};
    }
  }
`;
