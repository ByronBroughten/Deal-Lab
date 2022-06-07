import React from "react";
import { useSetterSection } from "../../../../../../../../sharedWithServer/stateClassHooks/useSetterSection";
import PlusBtn from "../../../../../../PlusBtn";
import XBtn from "../../../../../../Xbtn";
import { conditionalRowSectionName } from "../../ConditionalRows";

export default function XBtnRow({ feId, idx }: { feId: string; idx: number }) {
  const conditionalRow = useSetterSection({
    sectionName: conditionalRowSectionName,
    feId,
  });

  const { parent } = conditionalRow;

  const [height, setHeight] = React.useState("21px");
  const ccRef = React.useRef(null);
  React.useEffect(() => {
    if (ccRef.current) {
      const logicRows = document.getElementsByClassName(`logic-row ${idx}`);
      const logicRow = logicRows[0];
      const newHeight = `${logicRow.clientHeight}px`;

      if (newHeight !== height) {
        setHeight(newHeight);
      }
    }
  });

  return (
    <div
      className="XBtn-row content-row"
      style={{ height: height, display: "flex" }}
    >
      <PlusBtn onClick={() => parent.addChild(conditionalRowSectionName)} />
      <XBtn onClick={() => conditionalRow.removeSelf} />
    </div>
  );
}
