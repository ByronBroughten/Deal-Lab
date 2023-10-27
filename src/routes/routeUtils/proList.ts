const proEmailList = [
  "byron.broughten@gmail.com",
  "byronbroughten@gmail.com",
  "mnpbradley@gmail.com",
  "marina.brady22@gmail.com",
] as const;
type ProEmail = (typeof proEmailList)[number];

export function isProEmail(value: any): value is ProEmail {
  return proEmailList.includes(value);
}
