import { Button } from "@material-ui/core";
import styled from "styled-components";
import theme from "../../theme/Theme";
import { StyledDropdownForm } from "../general/DropdownForm";
import SmallFormTextField from "../general/SmallFormTextField";
import { EmailAndPassword } from "./LoginForm/EmailAndPassword";
import { useAuthRoutes } from "../../modules/customHooks/useAuthRoutes";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";

function useRegisterForm() {
  const { analyzer, handleChange } = useAnalyzerContext();
  const loginForm = analyzer.section("register");
  const emailVarb = loginForm.varb("email");
  const passwordVarb = loginForm.varb("password");
  const userNameVarb = loginForm.varb("userName");

  return {
    email: {
      name: emailVarb.stringFeVarbInfo,
      value: emailVarb.value("string"),
    },
    password: {
      name: passwordVarb.stringFeVarbInfo,
      value: passwordVarb.value("string"),
    },
    userName: {
      name: userNameVarb.stringFeVarbInfo,
      value: userNameVarb.value("string"),
    },
    handleChange,
  };
}
export function RegisterForm() {
  const { handleChange, email, userName, password } = useRegisterForm();
  const { register } = useAuthRoutes();

  return (
    <StyledRegisterForm>
      <SmallFormTextField
        {...{
          id: userName.name,
          name: userName.name,
          label: "Name",
          value: userName.value,
          onChange: handleChange,
        }}
      />
      <EmailAndPassword
        {...{
          handleChange,
          email: email,
          password: password,
        }}
      />
      <Button
        className="submit-btn"
        variant="contained"
        onClick={() =>
          register({
            userName: userName.value,
            email: email.value,
            password: password.value,
          })
        }
      >
        Create Account
      </Button>
    </StyledRegisterForm>
  );
}

const StyledRegisterForm = styled(StyledDropdownForm)`
  .MuiFilledInput-underline:after {
    border-bottom: 2px solid ${theme.property.dark};
  }
  .submit-btn {
    background-color: ${theme.property.main};
    border: 1px solid ${theme.property.border};
    :hover,
    :focus {
      background-color: ${theme.property.dark};
      border: 1px solid ${theme.property.main};
    }
  }
`;
