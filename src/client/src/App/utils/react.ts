import React from "react";

export const NoProviderErr = (useContextName: string) => {
  return new Error(`${useContextName} must be used within a matching provider`);
};

type Context<T> = React.Context<T | undefined>;
type UseContext<T> = () => T;

export function makeContextUseContext<T>(
  contextName: string,
  _type: T
): [Context<T>, UseContext<T>] {
  const context = makeContext(contextName, _type);
  const useContext = contextToUseContext(context, _type);
  return [context, useContext];
}

export function makeContext<T>(
  contextName: string,
  _type: T
): React.Context<T | undefined> {
  const context = React.createContext<T | undefined>(undefined);
  context.displayName = contextName;
  return context;
}

function contextToUseContext<T>(
  Context: React.Context<any>,
  _type: T
): () => T {
  return () => {
    const context = React.useContext(Context);
    if (context === undefined) throw NoProviderErr("useQueryActorContext");
    return context;
  };
}
