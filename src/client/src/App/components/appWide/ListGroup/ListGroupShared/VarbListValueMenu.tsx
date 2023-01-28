import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { ActionBtnLoad } from "../../GeneralSection/MainSection/StoreSectionActionMenu/ActionBtnLoad";
import { VarbListTotal } from "./VarbListGeneric/VarbListTotal";
import { VarbListMenuStyled } from "./VarbListMenuStyled";

interface Props<SN extends SectionNameByType<"varbListAllowed">>
  extends FeSectionInfo<SN> {
  totalVarbName?: string;
  className?: string;
}

export function VarbListValueMenu<
  SN extends SectionNameByType<"varbListAllowed">
>({
  totalVarbName,
  className,
  ...feInfo
}: FeSectionInfo<SN> & { totalVarbName?: string; className?: string }) {
  return (
    <VarbListMenuStyled className={`VarbListMenu-root ${className ?? ""}`}>
      <div className="VarbListMenu-titleRow">
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
        <div className="VarbListGeneric-titleRowRight">
          <ActionBtnLoad
            {...{
              loadMode: "loadAndCopy",
              loadWhat: "List",
              feInfo,
            }}
          />
        </div>
      </div>
    </VarbListMenuStyled>
  );
}
