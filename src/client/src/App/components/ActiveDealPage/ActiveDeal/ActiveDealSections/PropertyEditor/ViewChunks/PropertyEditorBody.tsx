import MainSectionBody from "../../../../../appWide/GeneralSection/MainSection/MainSectionBody";
import { MainSectionTopRows } from "../../../../../appWide/MainSectionTopRows";

export function PropertyEditorBody({
  feId,
  children,
  sectionTitle,
  titleAppend,
}: {
  feId: string;
  children: React.ReactNode;
  sectionTitle: string;
  titleAppend?: string;
}) {
  return (
    <div>
      <MainSectionTopRows
        {...{
          feId,
          sectionName: "property",
          sectionTitle,
          titleAppend,
          showControls: true,
        }}
      />
      <MainSectionBody>{children}</MainSectionBody>
    </div>
  );
}
