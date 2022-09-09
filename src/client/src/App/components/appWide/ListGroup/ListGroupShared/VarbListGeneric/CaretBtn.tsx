import { BiCaretDown, BiCaretUp } from "react-icons/bi";
import PlainBtn from "../../../../general/PlainBtn";

type BiCaretBtnProps = { dropped: boolean; onClick: () => void };
export function CaretBtn({ dropped, onClick }: BiCaretBtnProps) {
  return (
    <PlainBtn onClick={onClick}>
      {dropped && <BiCaretUp />}
      {!dropped && <BiCaretDown />}
    </PlainBtn>
  );
}
