import React from "react";
import { useAction } from "../../../../../../../../../../modules/stateHooks/useAction";
import { useGetterSection } from "../../../../../../../../../../modules/stateHooks/useGetterSection";
import SolidBtn from "../../../../../../../SolidBtn";
import { XBtn } from "../../../../../../../Xbtn";
import { conditionalRowSectionName } from "../../ConditionalRows";

export default function XBtnRow({ feId, idx }: { feId: string; idx: number }) {
  const addChild = useAction("addChild");
  const removeSelf = useAction("removeSelf");
  const conditionalRow = useGetterSection({
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
      <SolidBtn
        onClick={() =>
          addChild({
            feInfo: parent.feInfo,
            childName: conditionalRowSectionName,
          })
        }
      />
      <XBtn onClick={() => removeSelf(conditionalRow.feInfo)} />
    </div>
  );
}
