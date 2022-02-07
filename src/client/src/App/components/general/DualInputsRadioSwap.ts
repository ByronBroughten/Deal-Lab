import { darken } from "polished";
import styled from "styled-components";
import theme from "../../theme/Theme";
import ccs from "../../theme/cssChunks";

export default styled.div.attrs(({ className, ...rest }) => ({
  className: "dual-inputs-radio-swap " + className,
  ...rest,
}))`
  display: flex;
  flex: 0;
  align-items: flex-start;

  .MuiFormGroup-root {
    border-radius: ${theme.br1};
    padding: ${theme.s1};
    ${ccs.coloring.section.lightNeutral};
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
  .swappable-editors {
    margin-top: ${theme.s2};
    display: flex;
    align-items: flex-end;
  }
  .dependent {
    margin-bottom: ${theme.s1};
    margin-left: ${theme.s1};
  }
  span.equals {
    margin-right: ${theme.s1};
  }
`;
