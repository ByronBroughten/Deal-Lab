import styled from "styled-components";
import theme from "../../../theme/Theme";

type Props = {
  children: React.ReactNode;
  className?: string;
};
export function MainSection({ className, ...rest }: Props) {
  return <Styled className={`MainSection-root ${className}`} {...rest} />;
}

const Styled = styled.div`
  background: ${theme.light};
  padding: ${theme.s4};
  border-radius: ${theme.br0};
  box-shadow: ${theme.boxShadow1};
  .MainSectionBody-root {
    margin-top: ${theme.s3};
  }
  .MainSectionTitleRow-xBtn {
    visibility: hidden;
  }
  :hover {
    .MainSectionTitleRow-xBtn {
      visibility: visible;
    }
  }
`;
