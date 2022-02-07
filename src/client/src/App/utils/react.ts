export const NoProviderErr = (useContextName: string) => {
  return new Error(`${useContextName} must be used within a matching provider`);
};
