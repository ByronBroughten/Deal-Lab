import { BsCloudArrowDown } from "react-icons/bs";
import { useToggleViewNext } from "../../../../../../modules/customHooks/useToggleView";
import { FeSectionInfo } from "../../../../../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { SectionNameByType } from "../../../../../../sharedWithServer/SectionsMeta/SectionNameByType";
import { SectionModal } from "../../../../ModalSection";
import { SectionIndexRows } from "../../../../SectionIndexRows";
import { StyledActionBtn } from "./StyledActionBtn";

type Props<SN extends SectionNameByType<"hasIndexStore">> = {
  loadWhat: string;
  feInfo: FeSectionInfo<SN>;
  loadMode: "load" | "loadAndCopy";
  className?: string;
  onLoad?: () => void;
};
export function ActionLoadBtn<SN extends SectionNameByType<"hasIndexStore">>({
  loadWhat,
  feInfo,
  loadMode,
  className,
  onLoad,
}: Props<SN>) {
  const { modalIsOpen, openModal, closeModal } = useToggleViewNext(
    "modal",
    false
  );
  return (
    <>
      <StyledActionBtn
        middle="Load"
        left={<BsCloudArrowDown size={23} />}
        onClick={openModal}
        className={`ActionMenuLoadBtn-root ${className ?? ""}`}
      />
      <SectionModal
        closeModal={closeModal}
        show={modalIsOpen}
        title={`Load ${loadWhat}`}
      >
        <SectionIndexRows
          {...{
            feInfo,
            onClick: () => {
              closeModal();
              onLoad && onLoad();
            },
            loadMode,
          }}
        />
      </SectionModal>
    </>
  );
}
