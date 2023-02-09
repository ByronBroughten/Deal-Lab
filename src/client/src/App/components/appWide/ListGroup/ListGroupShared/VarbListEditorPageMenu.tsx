import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { BigStringEditor } from "../../../inputs/BigStringEditor";
import { ActionMenuLoadBtn } from "../../GeneralSection/MainSection/StoreSectionActionMenu/ActionMenuLoadBtn";
import { VarbListTotal } from "./VarbListGeneric/VarbListTotal";
import { VarbListMenuStyled } from "./VarbListMenuStyled";

interface Props<SN extends SectionNameByType<"varbListAllowed">>
  extends FeSectionInfo<SN> {
  totalVarbName?: string;
  className?: string;
}

export function VarbListEditorPageMenu<
  SN extends SectionNameByType<"varbListAllowed">
>({ totalVarbName, className, ...feInfo }: Props<SN>) {
  const list = useGetterSection(feInfo);
  return (
    <VarbListMenuStyled className={`VarbListMenu-root ${className ?? ""}`}>
      <div className="VarbListMenu-titleRow">
        <div className="VarbListMenu-titleRowLeft">
          <BigStringEditor
            {...{
              feVarbInfo: list.varbInfo("displayName"),
              placeholder: "Name",
              className: "VarbListMenu-title",
            }}
          />
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
          <ActionMenuLoadBtn
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
