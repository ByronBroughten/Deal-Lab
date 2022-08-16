import { Server } from "http";
import Stripe from "stripe";
import request from "supertest";
import { runApp } from "../../runApp";
import { getStripe } from "../routeUtils/stripe";

const productionRoute = "/api/webhook/stripe";
describe("/api/webhook/stripe", () => {
  let stripe: Stripe;
  let server: Server;
  let route: string;
  let secret: string;
  let payload: { id: string; object: any };

  beforeEach(() => {
    route = productionRoute;
    secret = process.env.STRIPE_WEBHOOK_SECRET as string;
    stripe = getStripe();
    server = runApp();
    payload = {
      id: "evt_test_webhook",
      object: "event",
    };
  });

  afterEach(() => {
    server.close();
  });

  const exec = async () => {
    const payloadString = JSON.stringify(payload, null, 2);
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    return await request(server)
      .post(route)
      .set("stripe-signature", header)
      .send(payloadString);
  };

  it("should return 200 for the production route", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it("should return 200 for the test route", async () => {
    secret = process.env.STRIPE_WEBHOOK_SECRET_TEST as string;
    route = productionRoute + "Test";
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it("should create a customer", async () => {
    payload = {
      id: "evt_test_webhook",
      object: {
        type: "customer.created",
        data: {
          object: {
            id: "cus_test_id",
            email: "testEmail", // create a user and email with the production route
          },
        },
      },
    };
  });
});
