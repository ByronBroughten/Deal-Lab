import styled from "styled-components";
import theme from "../../theme/Theme";

const DualInputsRadioSwap = styled.div`
  display: flex;
  align-items: flex-end;

  MuiFormControl-root {
    display: flex;
    flex: 1;
  }
  .RadioSwap-editorDiv {
    display: flex;
    flex: 1;
  }
  .NumObjEditor-root {
    display: flex;
  }

  .MuiFormGroup-root {
    display: flex;
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
      background: ${({ theme }) => theme.main};
      color: ${({ theme }) => theme.primary};

      .MuiTouchRipple-root {
        color: ${({ theme }) => theme.primary};
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
