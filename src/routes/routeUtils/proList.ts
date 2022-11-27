const proEmailList = [
  "byron.broughten@gmail.com",
  "byronbroughten@gmail.com",
] as const;
type ProEmail = typeof proEmailList[number];

export function isProEmail(value: any): value is ProEmail {
  return proEmailList.includes(value);
}
