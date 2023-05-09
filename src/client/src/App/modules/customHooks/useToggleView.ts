import { capitalizeFirstLetter } from "../../sharedWithServer/utils/Str";
import useToggle from "./useToggle";

type TFirst = {
  IsOpen: boolean;
  IsClosed: boolean;
};
type TLast = {
  toggle: () => void;
  open: () => void;
  close: () => void;
};
type PropFirst<T extends string> = {
  [Prop in keyof TFirst as `${T}${Capitalize<string & Prop>}`]: TFirst[Prop];
};
type PropLast<T extends string> = {
  [Prop in keyof TLast as `${Prop}${Capitalize<string & T>}`]: TLast[Prop];
};

type Return<T extends string> = PropFirst<T> & PropLast<T>;

function useNamedToggleView<T extends string>(
  props: ReturnType<typeof useToggle>,
  viewWhat: T
): Return<T & string> {
  const capitalViewWhat = capitalizeFirstLetter(viewWhat);
  const { value, toggle, setOn, setOff } = props;
  return {
    [`${viewWhat}IsOpen`]: value,
    [`${viewWhat}IsClosed`]: !value,
    [`toggle${capitalViewWhat}`]: toggle,
    [`open${capitalViewWhat}`]: setOn,
    [`close${capitalViewWhat}`]: setOff,
  } as any;
}

export function useToggleView<T extends string = "view">(
  viewWhat?: T,
  initValue: boolean = false
): Return<T> {
  const props = useToggle(initValue);
  return useNamedToggleView(props, viewWhat ?? ("view" as T));
}
