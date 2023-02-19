import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { ActionLoadBtn } from "../../GeneralSection/MainSection/StoreSectionActionMenu/ActionLoadBtn";
import { ActionSaveAsNewBtn } from "../../GeneralSection/MainSection/StoreSectionActionMenu/SaveAsNewBtn";
import { VarbListTotal } from "./VarbListGeneric/VarbListTotal";
import { VarbListMenuStyled } from "./VarbListMenuStyled";

interface Props<SN extends SectionNameByType<"varbListAllowed">>
  extends FeSectionInfo<SN> {
  totalVarbName?: string;
  className?: string;
}

export function VarbListValueMenu<
  SN extends SectionNameByType<"varbListAllowed">
>({ totalVarbName, className, ...feInfo }: Props<SN>) {
  return (
    <VarbListMenuStyled className={`VarbListMenu-root ${className ?? ""}`}>
      <div className="VarbListMenu-titleRow">
        <ActionSaveAsNewBtn {...{ ...feInfo }} />
        <ActionLoadBtn
          {...{
            loadMode: "loadAndCopy",
            loadWhat: "List",
            feInfo,
          }}
        />
        <div className="VarbListMenu-titleRowLeft">
          {totalVarbName && (
            <VarbListTotal
              varbInfo={{
                ...feInfo,
                varbName: totalVarbName,
              }}
            />
          )}
        </div>
        <div className="VarbListGeneric-titleRowRight"></div>
      </div>
    </VarbListMenuStyled>
  );
}
