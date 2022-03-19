import useToggleView from "../../../modules/customHooks/useToggleView";
import { Inf } from "../../../sharedWithServer/Analyzer/SectionMetas/Info";
import MainSectionEntry from "../../appWide/MainSection/MainSectionEntry";
import MainEntryBody from "../../appWide/MainSection/MainSectionEntry/MainEntryBody";
import MainEntryTitleRow from "../../appWide/MainSection/MainSectionEntry/MainEntryTitleRow";
import AnalysisBasics from "./AnalysisBasics";
import AnalysisDetails from "./AnalysisDetails";

export default function Deal({
  feId,
  detailsIsOpen,
}: {
  feId: string;
  detailsIsOpen: boolean;
}) {
  const feInfo = Inf.fe("analysis", feId);
  return (
    <MainSectionEntry>
      <MainEntryBody>
        <MainEntryTitleRow
          {...{ feInfo, pluralName: "deals", droptop: true }}
        />
        <div className="ListGroup-root">
          {!detailsIsOpen && <AnalysisBasics id={feId} />}
          {detailsIsOpen && <AnalysisDetails id={feId} />}
        </div>
      </MainEntryBody>
    </MainSectionEntry>
  );
}
