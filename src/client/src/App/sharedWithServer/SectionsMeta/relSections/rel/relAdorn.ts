export const relAdorn = {
  money: { startAdornment: "$", unit: "money" } as const,
  get moneyMonth() {
    return {
      ...this.money,
      endAdornment: "/month",
    };
  },
  get moneyYear() {
    return {
      ...this.money,
      endAdornment: "/year",
    };
  },
};
