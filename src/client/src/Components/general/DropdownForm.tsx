import styled from "styled-components";
import theme from "../../theme/Theme";

export default function DropdownForm({ children, ...rest }: { children: any }) {
  return (
    <StyledDropdownForm {...rest}>
      <div>{children}</div>
    </StyledDropdownForm>
  );
}

export const StyledDropdownForm = styled.form.attrs(
  ({ className, ...rest }) => ({
    className: "dropdown-form " + className,
    ...rest,
  })
)`
  width: 300px;
  padding: ${theme.s3};
  .small-form-text-field {
    :not(:first-child) {
      margin-top: ${theme.s3};
    }
  }

  .submit-btn {
    width: 100%;
    margin-top: ${theme.s3};
    color: ${theme["gray-700"]};
    :hover,
    :focus {
      color: ${theme.light};
      font-weight: bold;
    }
    .MuiTouchRipple-root {
      visibility: hidden;
    }
  }
`;
