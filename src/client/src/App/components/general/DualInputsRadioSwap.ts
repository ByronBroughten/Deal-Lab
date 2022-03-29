import { darken } from "polished";
import styled from "styled-components";
import theme from "../../theme/Theme";
import ccs from "../../theme/cssChunks";

const DualInputsRadioSwap = styled.div.attrs(({ className, ...rest }) => ({
  className: "dual-inputs-radio-swap " + className,
  ...rest,
}))`
  display: flex;
  align-items: flex-end;

  // Radio Stuff
  /* .PrivateSwitchBase-root-1 {
    padding: 0;
  }
  .PrivateSwitchBase-input-4 {
    height: 4px;
    width: 4px;
    padding: 0;
  }
  .PrivateRadioButtonIcon-root-5 {
    height: 4px;
    width: 4px;
    padding: 0;
  } */

  .MuiInputBase-root {
    display: flex;
  }
  .MuiFormGroup-root {
  }

  .MuiSvgIcon-root {
    height: 0.9em;
  }

  fieldset.radio-part {
    padding: 0;
    margin: 0;
    label.MuiFormControlLabel-root {
      margin: 0;
      align-items: flex-start;
      height: 1.1em;
      :not(:first-child) {
        margin-top: ${theme.s2};
      }

      .MuiTypography-root {
        margin-left: ${theme.s1};
      }
    }

    .MuiButtonBase-root {
      background: ${({ theme }) => theme.light};
      color: ${({ theme }) => theme.section.dark};

      .MuiTouchRipple-root {
        color: ${({ theme }) => theme.section.light};
      }
    }
  }

  fieldset.labeled-input-group-part {
    margin-left: ${theme.s1};
  }
  .dependent {
    margin-bottom: ${theme.s1};
    margin-left: ${theme.s1};
  }
  span.equals {
    margin-right: ${theme.s1};
  }
`;

export default DualInputsRadioSwap;
