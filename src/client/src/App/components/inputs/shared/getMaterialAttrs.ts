export function getMaterialAttrs(componentClassName: string) {
  return ({
    className,
    id,
    ...rest
  }: {
    className: string;
    id: string;
    [key: string]: any;
  }) => ({
    className: componentClassName + " " + className,
    variant: "filled",
    id,
    name: id,
    ...rest,
  });
}
