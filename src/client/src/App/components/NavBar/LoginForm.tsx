import { Button } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useQueryActorContext } from "../../modules/QueriersRelative/StateQuerierGeneral";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { LoginFormData } from "../../sharedWithServer/apiQueriesShared/login";
import theme from "../../theme/Theme";
import DropdownForm from "../general/DropdownForm";
import SmallFormTextField from "../general/SmallFormTextField";

export function LoginForm() {
  const loginVarbNames: (keyof LoginFormData)[] = ["email", "password"];
  const { analyzer, handleChange } = useAnalyzerContext();
  const { varbs } = analyzer.section("login");
  const queryActor = useQueryActorContext();

  return (
    <StyledLoginForm>
      {loginVarbNames.map((varbName) => (
        <SmallFormTextField
          {...{
            key: varbName,
            ...varbs[varbName].inputProps("string"),
            ...(varbName === "password" && { type: "password" }),
            onChange: handleChange,
          }}
        />
      ))}
      <Button
        className="submit-btn"
        variant="contained"
        onClick={() => queryActor.login()}
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
