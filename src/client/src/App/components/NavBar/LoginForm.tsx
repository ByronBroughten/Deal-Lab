import React from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import DropdownForm from "../general/DropdownForm";
import theme from "../../theme/Theme";
import { EmailAndPassword } from "./LoginForm/EmailAndPassword";
import { useAuthRoutes } from "../../modules/customHooks/useAuthRoutes";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";

export function useLoginForm() {
  const { analyzer, handleChange } = useAnalyzerContext();
  const loginForm = analyzer.section("login");
  const emailVarb = loginForm.varb("email");
  const passwordVarb = loginForm.varb("password");

  const { varbs } = analyzer.section("login");

  return {
    email: {
      name: emailVarb.stringFeVarbInfo,
      value: emailVarb.value("string"),
      // error: boolean
      // helperText: string
    },
    password: {
      name: passwordVarb.stringFeVarbInfo,
      value: passwordVarb.value("string"),
    },
    handleChange,
  };
}

export function LoginForm() {
  // 3. produce an error message

  const { handleChange, email, password } = useLoginForm();
  const { login } = useAuthRoutes();
  return (
    <StyledLoginForm>
      <EmailAndPassword
        {...{
          handleChange,
          email,
          password,
        }}
      />
      <Button
        className="submit-btn"
        variant="contained"
        onClick={() =>
          login({
            email: email.value,
            password: password.value,
          })
        }
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
