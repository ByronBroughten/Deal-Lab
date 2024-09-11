import { Button } from "@mui/material";
import styled from "styled-components";
import { stripeS } from "../../../../modules/services/stripeS";
import theme from "../../../../theme/Theme";
import { Column } from "../../../general/Column";
import { TextNext } from "../../../general/TextNext";
import { NavBarPanel } from "./NavBarPanel";

export function UpgradeUserToProPanel() {
  return (
    <Styled>
      <div>
        <Column
          sx={{
            backgroundColor: theme.light,
            borderRadius: 5,
            padding: theme.s3,
          }}
        >
          <Column>
            <TextNext sx={{ fontSize: 20, color: theme.primaryNext }}>
              Upgrade to Pro
            </TextNext>
          </Column>
          <Column>
            <Column sx={{ marginTop: theme.s3 }}>
              <TextNext
                sx={{ fontSize: 16 }}
              >{`Save and load hundreds of deals, components, and variables. Try it out with a 7 day free trial`}</TextNext>
            </Column>
          </Column>
        </Column>
        <Button
          className="PaymentForm-payBtn"
          onClick={() => stripeS.goToPaymentPage()}
        >
          Upgrade Page
        </Button>
      </div>
    </Styled>
  );
}

const Styled = styled(NavBarPanel)`
  border: solid 1px ${theme.primaryBorder};
  border-radius: 0 0 ${theme.br0} ${theme.br0};
  border-top: none;
  box-shadow: ${theme.boxShadow1};
  .PaymentForm-payBtn {
    display: block;
    font-size: 16px;
    width: 100%;
    height: 40px;
    margin-top: ${theme.s3};
    background-color: ${theme.primaryNext};
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 ${theme.deal.main}
    border-radius: 4px;
    color: ${theme.light};
    
    cursor: pointer;
    transition: all 100ms ease-in-out;
    will-change: transform, background-color, box-shadow;
    border: none;

    :active,
    :hover {
      background-color: ${theme.deal.dark};
      box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 ${theme.deal.dark}
      transform: scale(0.99);
      color: ${theme.light};
    }
  }
`;
