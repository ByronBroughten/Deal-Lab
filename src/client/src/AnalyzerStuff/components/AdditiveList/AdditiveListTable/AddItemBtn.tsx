import PlusBtn from "../../../../App/components/appWide/PlusBtn";
import { StandardBtnProps } from "../../../../App/components/general/StandardProps";

export default function AddItemBtn({ className, ...props }: StandardBtnProps) {
  return (
    <PlusBtn
      className={`AdditiveListTable-addItemBtn ${className ?? ""}`}
      {...props}
    >
      +
    </PlusBtn>
  );
}
