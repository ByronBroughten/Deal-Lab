import { FeSectionInfo } from "../../../../../sharedWithServer/StateGetters/Identifiers/FeInfo";
import { SectionNameByType } from "../../../../../sharedWithServer/stateSchemas/SectionNameByType";
import { useGetterSection } from "../../../../stateClassHooks/useGetterSection";
import { BigStringEditor } from "../../../inputs/BigStringEditor";
import { RemoveFromStoreXBtn } from "../../RemoveSectionXBtn";
import { VarbListTotal } from "./VarbListGeneric/VarbListTotal";
import { VarbListMenuStyled } from "./VarbListMenuStyled";

interface Props<SN extends SectionNameByType<"hasIndexStore">>
  extends FeSectionInfo<SN> {
  totalVarbName?: string;
  className?: string;
}

export function VarbListEditorPageMenu<
  SN extends SectionNameByType<"hasIndexStore">
>({ totalVarbName, className, ...feInfo }: Props<SN>) {
  const list = useGetterSection(feInfo);
  return (
    <VarbListMenuStyled className={`VarbListMenu-root ${className ?? ""}`}>
      <div className="VarbListMenu-titleRow">
        <div className="VarbListMenu-titleRowLeft">
          <BigStringEditor
            {...{
              className: "VarbListMenu-title",
              feVarbInfo: list.varbInfo("displayName"),
              placeholder: "Template name",
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
        <RemoveFromStoreXBtn
          {...{
            sx: { width: 22, height: 22, padding: 0 },
            feId: list.feId,
            storeName: list.mainStoreName,
          }}
        />
      </div>
    </VarbListMenuStyled>
  );
}
