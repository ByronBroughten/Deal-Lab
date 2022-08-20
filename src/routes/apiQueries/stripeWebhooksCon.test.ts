import { Server } from "http";
import Stripe from "stripe";
import request from "supertest";
import { constants } from "../../client/src/App/Constants";
import { timeS } from "../../client/src/App/sharedWithServer/utils/date";
import { runApp } from "../../runApp";
import { getStripe } from "../routeUtils/stripe";
import { DbUser } from "./shared/DbSections/DbUser";
import { LoadedDbUser } from "./shared/DbSections/LoadedDbUser";
import { stripeSubToValues } from "./stripeWebhooks";
import { createAndGetDbUser, deleteUserTotally } from "./test/testDbUser";
const productionRoute = "/api/webhook/stripe";
describe(productionRoute, () => {
  let stripe: Stripe;
  let server: Server;
  let route: string;
  let secret: string;
  let loadedDbUser: LoadedDbUser;
  let payload: { id: string; type: string; data: any };
  let customerId: string;

  beforeEach(async () => {
    route = productionRoute;
    customerId = "cus_test_id";
    secret = process.env.STRIPE_WEBHOOK_SECRET as string;
    stripe = getStripe();
    server = runApp();
    loadedDbUser = await createAndGetDbUser(productionRoute);
    payload = {
      id: "evt_test_webhook",
      type: "event_type",
      data: {},
    };
  });

  afterEach(async () => {
    await deleteUserTotally(loadedDbUser);
    server.close();
  });

  const makeCreateCustomerPayload = () => {
    return {
      ...payload,
      type: "customer.created",
      data: {
        object: {
          id: customerId,
          email: loadedDbUser.email,
        },
      },
    };
  };

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
  describe("customer.created", () => {
    beforeEach(() => {
      payload = makeCreateCustomerPayload();
    });
    it("should return 200 and add the customer id to the user in the db", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      const dbUser = await DbUser.initBy("userId", loadedDbUser.userId);
      const customerId = await dbUser.getOnlySectionValue({
        storeName: "stripeInfoPrivate",
        varbName: "customerId",
      });
      expect(customerId).toBe(customerId);
    });
    it("should return 200 for the test route", async () => {
      secret = process.env.STRIPE_WEBHOOK_SECRET_TEST as string;
      route = productionRoute + "Test";
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
  describe("customer.subscription", () => {
    const { priceId } = constants.stripePrices[0];
    let subId: string;
    let subscription: Stripe.Subscription;

    beforeEach(async () => {
      payload = makeCreateCustomerPayload();
      await exec();
      subId = "sub_test_id";
      subscription = {
        id: subId,
        status: "active",
        current_period_end: timeS.now(),
        items: {
          data: [{ price: { id: priceId } }],
        },
      } as Stripe.Subscription;

      payload = {
        ...payload,
        type: "customer.subscription.updated",
        data: { object: subscription },
      };
    });
    it("should return status 200 and create a subscription concurrent", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      const dbUser = await LoadedDbUser.getBy("userId", loadedDbUser.userId);
      const subList = dbUser.get.childList("stripeSubscription");
      const sub = subList.getByValue("subId", subId);

      const expectedVals = stripeSubToValues(subscription);
      expect(sub.allValues).toEqual(expectedVals);
    });
    it("should return status 200 and change the subscription status to canceled concurrent", async () => {
      await exec();
      subscription.status = "canceled";
      await exec();

      const dbUser = await LoadedDbUser.getBy("userId", loadedDbUser.userId);
      const subList = dbUser.get.childList("stripeSubscription");
      const sub = subList.getByValue("subId", subId);

      expect(sub.valueNext("status")).toBe("canceled");
      const expectedVals = stripeSubToValues(subscription);
      expect(sub.allValues).toEqual(expectedVals);
    });
  });
});
