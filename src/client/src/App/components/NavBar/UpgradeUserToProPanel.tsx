import { Button } from "@material-ui/core";
import { StyleSheet, Text, View } from "react-native";
import styled from "styled-components";
import { goToPaymentPage } from "../../modules/services/stripeService";
import theme from "../../theme/Theme";
import { NavBarPanel } from "./NavBarPanel";

const styles = StyleSheet.create({
  banner: {},
  pitch: {
    backgroundColor: theme.light,
    borderRadius: 5,
    padding: theme.s3,
  },
  upgradeToProTitle: {
    fontSize: 20,
    color: theme.primaryNext,
  },
  subSectionSpace: {
    marginTop: theme.s3,
  },
  list: {},

  boldText: {
    color: theme.light,
  },
  normalText: { fontSize: 16 },
});

export function UpgradeUserToProPanel() {
  return (
    <Styled>
      <div>
        <View style={styles.pitch}>
          <View style={styles.banner}>
            <Text style={styles.upgradeToProTitle}>Upgrade to Pro</Text>
          </View>
          <View>
            <View style={styles.subSectionSpace}>
              <Text
                style={styles.normalText}
              >{`With Deal Lab Pro, save and load hundreds of deals, deal components, and variables. Try it out with a 7 day free trial, why don't'chya?`}</Text>
            </View>
          </View>
        </View>
        <Button className="PaymentForm-payBtn" onClick={goToPaymentPage}>
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
