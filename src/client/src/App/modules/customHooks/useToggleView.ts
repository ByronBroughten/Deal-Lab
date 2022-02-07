import { capitalizeFirstLetter } from "../../sharedWithServer/utils/Str";
import useToggle from "./useToggle";

type TFirst = {
  IsOpen: boolean;
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
// @ts-ignore
type Return<T extends any> = PropFirst<T> & PropLast<T>;

function returnToggleView<T extends string>(
  props: ReturnType<typeof useToggle>,
  viewWhat: T
): Return<T & string> {
  const capitalViewWhat = capitalizeFirstLetter(viewWhat);
  const { value, toggle, setOn, setOff } = props;
  return {
    [`${viewWhat}IsOpen`]: value,
    [`toggle${capitalViewWhat}`]: toggle,
    [`open${capitalViewWhat}`]: setOn,
    [`close${capitalViewWhat}`]: setOff,
  };
}

type Props<T> = { initValue?: boolean; viewWhat?: T };
export default function useToggleView<T extends undefined>(
  props?: Props<T>
): Return<"view">;
export default function useToggleView<T extends string>(
  props?: Props<T>
): Return<T>;
export default function useToggleView<T extends string | undefined>({
  initValue = true,
  viewWhat,
}: Props<T> = {}): Return<T> | Return<"view"> {
  const props = useToggle(initValue);
  if (typeof viewWhat === "string") return returnToggleView(props, viewWhat);
  else return returnToggleView(props, "view");
}
