import {
  CardElement,
  CardElementProps,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import React, { DOMAttributes } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import styled from "styled-components";
import theme from "../../../theme/Theme";

// Test card:
// 4242 4242 4242 4242 04/24 292 55103
// zip? 29872

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

const CARD_OPTIONS: CardElementProps["options"] = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: theme.loan.main,
      color: theme.softDark,
      fontWeight: 500,
      fontFamily: "Roboto, OpenSans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: theme.loan.main }, // "#87bbfd"
    },
    invalid: {
      iconColor: theme.danger, // "#ffc7ee",
      color: theme.danger, // "#ffc7ee",
    },
  },
};

export default function PaymentForm() {
  const [success, setSuccess] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const cardElement = elements?.getElement(CardElement);

  const handleSubmit: DOMAttributes<HTMLFormElement>["onSubmit"] = async (
    event
  ) => {
    event.preventDefault();
    if (stripe && cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (!error && paymentMethod) {
        try {
          const response = await axios.post("https://localhost:4000/payment", {
            paymentMethodId: paymentMethod.id,
          });
          if (response.data.success) {
            console.log("Successful payment");
            setSuccess(true);
          }
        } catch (error) {
          console.log("Error", error);
        }
      } else {
        if (error) console.log(error.message);
      }
    }
  };

  return (
    <Styled>
      {!success && (
        <div>
          <View style={styles.pitch}>
            <View style={styles.banner}>
              <Text style={styles.upgradeToProTitle}>Upgrade to Pro</Text>
            </View>
            <View style={styles.subSectionSpace}>
              <Text style={styles.normalText}>
                <Text style={styles.boldText}>Cost:</Text> $10 per month
              </Text>
            </View>
            <View>
              <View style={styles.subSectionSpace}>
                <Text style={styles.normalText}>
                  <Text style={styles.boldText}>Benefits</Text>
                </Text>
              </View>
              <FlatList
                style={styles.list}
                renderItem={({ item }) => <Bullet text={item} />}
                data={[
                  "Save as many deals, properties, loans, and management scenarios as you want",
                  "Sort and compare saved deals with the Compare Deals table",
                ]}
              />
            </View>
          </View>
          <form onSubmit={handleSubmit}>
            <fieldset className="FormGroup">
              <div className="FormRow">
                <CardElement options={CARD_OPTIONS} />
              </div>
            </fieldset>
            <button>{`Start Pro Subscription ($10 per month)`}</button>
          </form>
        </div>
      )}
      {success && (
        <div>
          <h2>You upgraded to Pro. Analyze away.</h2>
        </div>
      )}
    </Styled>
  );
}

interface BulletProps {
  text: string;
}
function Bullet({ text }: BulletProps) {
  return (
    <View style={styles.bulletItem}>
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

  button {
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
  }

  button:active,
  button:hover {
    background-color: ${theme.deal.dark};
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 ${theme.deal.dark}
    transform: scale(0.99);
    color: ${theme.light};
  }

  h1,
  h3 {
    text-align: center;
  }
`;
