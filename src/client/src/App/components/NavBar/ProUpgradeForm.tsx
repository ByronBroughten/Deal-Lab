import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import styled from "styled-components";
import PaymentForm from "./ProUpgradeForm/PaymentForm";

const PUBLIC_KEY =
  "pk_live_51KfFgoBcSOBChcCBVZro3R7qfYylOkC3qWGcu4spzxN95AKwwCksLcxocz25ynPkfrtf6JHaAABMajqrpbcbuYLc00T7AF1gG4";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export function ProUpgradeForm() {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}

// 4242 4242 4242 4242 04/24 292 55103
// zip? 29872

const Styled = styled.div``;
