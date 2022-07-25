import { Button } from "@material-ui/core";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import styled from "styled-components";
import { constants } from "../../Constants";
import { apiQueries } from "../../modules/useQueryActionsTest/apiQueriesClient";
import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import theme from "../../theme/Theme";

const styles = StyleSheet.create({
  banner: {},
  pitch: {
    backgroundColor: theme.mgmt.light,
    borderRadius: 3,
    padding: theme.s3,
  },
  upgradeToProTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.softDark,
  },
  subSectionSpace: {
    marginTop: theme.s3,
  },
  list: {},
  bulletItem: {
    marginTop: theme.s2,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    flex: 1,
  },
  bullet: {
    width: 12,
  },
  bulletText: {
    flex: 1,
  },
  boldText: {
    fontWeight: "bold",
    color: theme.softDark,
  },
  normalText: { fontSize: 16 },
});

async function goToPaymentPage(): Promise<void> {
  const res = await apiQueries.upgradeUserToPro(
    makeReq({
      priceId: constants.upgradeUserToPro.priceId,
    })
  );
  const { sessionUrl } = res.data;
  window.location.replace(sessionUrl);
}

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
              <Text style={styles.normalText}>
                <Text style={styles.boldText}>Benefits</Text>
              </Text>
            </View>
            <FlatList
              style={styles.list}
              renderItem={({ item, index }) => (
                <Bullet text={item} key={`${index}`} />
              )}
              data={[
                "Save as many deals, properties, loans, and management scenarios as you want",
                "Sort and compare saved deals with the Compare Deals table",
              ]}
            />
            <View style={styles.subSectionSpace}>
              <Text style={styles.normalText}>
                <Text style={styles.boldText}>Cost</Text> $10 per month
              </Text>
            </View>
          </View>
        </View>
        <Button className="PaymentForm-payBtn" onClick={goToPaymentPage}>
          Go to Payment Page
        </Button>
      </div>
    </Styled>
  );
}

interface BulletProps {
  text: string;
  key: string;
}
function Bullet({ text, key }: BulletProps) {
  return (
    <View style={styles.bulletItem} key={key}>
      <View style={styles.row}>
        <View style={styles.bullet}>
          <Text style={styles.normalText}>{"\u2022" + " "}</Text>
        </View>
        <View style={styles.bulletText}>
          <Text style={styles.normalText}>{text}</Text>
        </View>
      </View>
    </View>
  );
}

const Styled = styled.div`
  width: 600px;
  min-width: 300px;
  background: ${theme.light};
  padding: ${theme.s4};
  border-radius: 0 0, ${theme.br1} ${theme.br1};

  .Title-text {
    color: ${theme["gray-700"]};
    font-size: ${theme.f3};
    font-weight: 700;
  }

  .FormGroup {
    margin-top: ${theme.s4};
    padding: 0;
    border-style: none;
    background-color: ${theme.loan.light};
    will-change: opacity, transform;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 ${theme.loan.main}
    border-radius: 4px;
  }

  .FormRow {
    border-top: 1px solid ${theme.loan.main};
    display: flex;
    align-items: center;
    padding-left: 15px;
  }

  .StripeElement--webkit-autofill {
    background: transparent !important;
  }

  .StripeElement {
    width: 100%;
    padding: 11px 15px 11px 0;
  }

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

  

  h1,
  h3 {
    text-align: center;
  }
`;
