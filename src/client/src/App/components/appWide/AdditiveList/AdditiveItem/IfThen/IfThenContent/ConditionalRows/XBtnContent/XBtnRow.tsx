import React from "react";
import { useAnalyzerContext } from "../../../../../../../../modules/usePropertyAnalyzer";
import { ParentFeInfo } from "../../../../../../../../sharedWithServer/SectionsMeta/relSectionTypes/ParentTypes";
import PlusBtn from "../../../../../../PlusBtn";
import XBtn from "../../../../../../Xbtn";
import { conditionalRowSectionName } from "../../ConditionalRows";

export default function XBtnRow({
  id,
  idx,
  parentInfo,
}: {
  id: string;
  idx: number;
  parentInfo: ParentFeInfo<typeof conditionalRowSectionName>;
}) {
  const feInfo = {
    sectionName: conditionalRowSectionName,
    id,
    idType: "feId",
  } as const;
  const { handleRemoveSection, handleAddSection } = useAnalyzerContext();

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
      <PlusBtn
        onClick={() => handleAddSection(conditionalRowSectionName, parentInfo)}
      />
      <XBtn onClick={() => handleRemoveSection(feInfo)} />
    </div>
  );
}
