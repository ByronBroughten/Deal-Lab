const dealMode = ["buyAndHold", "fixAndFlip"] as const;
type DealMode = typeof dealMode[number];

const authStatuses = ["guest", "user"] as const;
export type AuthStatus = typeof authStatuses[number];
