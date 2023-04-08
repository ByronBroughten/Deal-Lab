import { FeSectionInfo } from "../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { useGetterSection } from "../../../../sharedWithServer/stateClassHooks/useGetterSection";
import { BigStringEditor } from "../../../inputs/BigStringEditor";
import { RemoveFromStoreXBtn } from "../../RemoveSectionXBtn";
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
