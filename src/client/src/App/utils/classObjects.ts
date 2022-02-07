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
