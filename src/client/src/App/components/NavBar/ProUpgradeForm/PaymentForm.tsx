import {
  CardElement,
  CardElementProps,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import React, { DOMAttributes } from "react";
import styled from "styled-components";

const CARD_OPTIONS: CardElementProps["options"] = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, OpenSans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
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
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <button>Pay</button>
        </form>
      )}
      {success && (
        <div>
          <h2>You upgraded to Pro. Analyze away.</h2>
        </div>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  width: 300px;
  .FormGroup {
    display: flex;
    margin: 0 15px 20px;
    padding: 0;
    border-style: none;
    background-color: #7795f8;
    will-change: opacity, transform;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 #829fff;
    border-radius: 4px;
  }

  .FormRow {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    margin-left: 15px;
    border-top: 1px solid #819efc;
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
    width: calc(100% - 30px);
    height: 40px;
    margin: 40px 15px 0;
    background-color: #f6a4eb;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 #ffb9f6;
    border-radius: 4px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 100ms ease-in-out;
    will-change: transform, background-color, box-shadow;
    border: none;
  }

  button:active {
    background-color: #d782d9;
    box-shadow: 0 6px 9px rgba(50, 50, 93, 0.06), 0 2px 5px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 #e298d8;
    transform: scale(0.99);
  }

  h1,
  h3 {
    text-align: center;
  }
`;
