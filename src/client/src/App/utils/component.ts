export function makeClassName(
  base: string,
  { className }: { className?: string }
) {
  return `${base} ${className ?? className}`;
}

export function processProps(
  baseClassName: string,
  props: { className?: string } & any
) {
  return {
    ...props,
    className: makeClassName(baseClassName, props),
  };
}
