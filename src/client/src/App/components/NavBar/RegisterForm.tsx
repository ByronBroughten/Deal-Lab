import { Button } from "@material-ui/core";
import styled from "styled-components";
import { useAnalyzerContext } from "../../modules/usePropertyAnalyzer";
import { useAuthQueryActions } from "../../modules/useQueryActions/useAuthQueryActions";
import { RegisterFormData } from "../../sharedWithServer/apiQueriesShared/register";
import theme from "../../theme/Theme";
import { StyledDropdownForm } from "../general/DropdownForm";
import SmallFormTextField from "../general/SmallFormTextField";

export function RegisterForm() {
  const { analyzer, handleChange } = useAnalyzerContext();
  const { varbs } = analyzer.section("register");
  const { nextRegister } = useAuthQueryActions();
  // this ensures that the fields are in the corect order
  const registerVarbNames: (keyof RegisterFormData)[] = [
    "userName",
    "email",
    "password",
  ];
  return (
    <StyledRegisterForm>
      {registerVarbNames.map((varbName) => (
        <SmallFormTextField
          {...{
            ...varbs[varbName].inputProps("string"),
            ...(varbName === "password" && { type: "password" }),
            onChange: handleChange,
          }}
        />
      ))}

      <Button className="submit-btn" variant="contained" onClick={nextRegister}>
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
