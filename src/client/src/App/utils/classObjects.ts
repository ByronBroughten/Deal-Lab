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

export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
