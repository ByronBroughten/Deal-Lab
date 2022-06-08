import { Button } from "@material-ui/core";
import styled from "styled-components";
import { useRegisterActor } from "../../modules/sectionActorHooks/useRegisterActor";
import { RegisterFormData } from "../../sharedWithServer/apiQueriesShared/register";
import theme from "../../theme/Theme";
import { StyledDropdownForm } from "../general/DropdownForm";
import SmallFormTextField from "../general/SmallFormTextField";

export function RegisterForm() {
  const registerVarbNames: (keyof RegisterFormData)[] = [
    "userName",
    "email",
    "password",
  ];
  const registerActor = useRegisterActor();
  return (
    <StyledRegisterForm>
      {registerVarbNames.map((varbName) => (
        <SmallFormTextField
          {...{
            key: varbName,
            ...registerActor.varb(varbName).inputProps("string"),
            ...(varbName === "password" && { type: "password" }),
          }}
        />
      ))}

      <Button
        className="submit-btn"
        variant="contained"
        onClick={() => registerActor.register()}
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
