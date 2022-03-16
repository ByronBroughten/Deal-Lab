import React from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import DropdownForm from "../general/DropdownForm";
import theme from "../../theme/Theme";
import { useAuthRoutes } from "../../modules/customHooks/useAuthRoutes";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { LoginFormData } from "../../sharedWithServer/User/crudTypes";
import SmallFormTextField from "../general/SmallFormTextField";

export function LoginForm() {
  const loginVarbNames: (keyof LoginFormData)[] = ["email", "password"];
  const { analyzer, handleChange } = useAnalyzerContext();
  const { varbs } = analyzer.section("login");
  const { login } = useAuthRoutes();
  return (
    <StyledLoginForm>
      {loginVarbNames.map((varbName) => (
        <SmallFormTextField
          {...{
            ...varbs[varbName].inputProps("string"),
            ...(varbName === "password" && { type: "password" }),
            onChange: handleChange,
          }}
        />
      ))}
      <Button className="submit-btn" variant="contained" onClick={login}>
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
