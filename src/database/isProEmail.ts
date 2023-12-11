export function isProEmail(value: any): value is string {
  const proEmailList = [
    "byron.broughten@gmail.com",
    "byronbroughten@gmail.com",
    "mnpbradley@gmail.com",
    "marina.brady22@gmail.com",
  ] as const;
  return proEmailList.includes(value);
}
