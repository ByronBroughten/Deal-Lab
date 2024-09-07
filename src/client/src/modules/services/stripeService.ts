import { makeReq } from "../../sharedWithServer/apiQueriesShared/makeReqAndRes";
import { constants } from "../../sharedWithServer/Constants";
import { apiQueries } from "../apiQueriesClient";

export async function goToPaymentPage(): Promise<void> {
  const sub = constants.stripePrices.find((sub) => sub.product === "proPlan");
  if (!sub) throw new Error(`No subscription with proPlan product`);
  const res = await apiQueries.getProPaymentUrl(
    makeReq({ priceId: sub.priceId })
  );
  const { sessionUrl } = res.data;
  window.location.replace(sessionUrl);
}
export async function goToCustomerPortalPage(): Promise<void> {
  const res = await apiQueries.getCustomerPortalUrl(makeReq());
  const { sessionUrl } = res.data;
  window.location.replace(sessionUrl);
}
