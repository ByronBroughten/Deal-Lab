import { Button } from "@material-ui/core";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import styled from "styled-components";
import { goToPaymentPage } from "../../modules/services/stripeService";
import theme from "../../theme/Theme";
import { NavBarPanel } from "./NavBarPanel";

const styles = StyleSheet.create({
  banner: {},
  pitch: {
    backgroundColor: theme.property.main,
    borderRadius: 3,
    padding: theme.s3,
  },
  upgradeToProTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.softDark,
  },
  subSectionSpace: {
    marginTop: theme.s1,
  },
  list: {},

  boldText: {
    fontWeight: "bold",
    color: theme.softDark,
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
              >{`Save and load hundreds of properties, deals, and whatever else.\nAnd hey, there's a 7 day free trial, so give it a try.`}</Text>
            </View>
          </View>
        </View>
        <Button className="PaymentForm-payBtn" onClick={goToPaymentPage}>
          View Offer
        </Button>
      </div>
    </Styled>
  );
}

const Styled = styled(NavBarPanel)`
  .PaymentForm-payBtn {
    display: block;
    font-size: 16px;
    width: 100%;
    height: 40px;
    margin-top: ${theme.s3};
    background-color: ${theme.deal.main};
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 ${theme.deal.main}
    border-radius: 4px;
    color: ${theme.softDark};
    font-weight: 600;
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
