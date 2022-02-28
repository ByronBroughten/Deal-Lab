interface PropInfos {
  [propName: string]: any;
}
export const setProtectedProps = (target: object, propInfos: PropInfos) => {
  const definePropertiesProps: PropertyDescriptorMap = {};
  for (const [name, value] of Object.entries(propInfos)) {
    definePropertiesProps[name] = { value };
  }

  Object.defineProperties(target, definePropertiesProps);
};

function isMixin<
  A extends { [arrName: string]: readonly any[] },
  K extends keyof A,
  T extends { arrs: A }
>(this: T, value: any, arrName: K): value is T["arrs"][K][number] {
  const arr: readonly any[] = this.arrs[arrName];
  return arr.includes(value);
}

export function arrsAndIsMixin<A extends { [arrName: string]: readonly any[] }>(
  arrs: A
) {
  return {
    arrs,
    is: isMixin,
  } as const;
}
