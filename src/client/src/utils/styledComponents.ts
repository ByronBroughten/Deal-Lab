type Props = { className?: string };
export function getAttrsFn(baseClassName: string) {
  return ({ className, ...rest }: Props) => ({
    className: `${baseClassName} ${className}`,
    ...rest,
  });
}
