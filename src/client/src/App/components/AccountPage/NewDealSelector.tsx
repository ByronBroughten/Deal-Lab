import { Box } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { ModalSection } from "../appWide/ModalSection";
import { MuiSelect } from "../appWide/MuiSelect";
import { VarbLabel } from "../appWide/VarbLabel";
import { useGoToPage } from "../customHooks/useGoToPage";
import ChunkTitle from "../general/ChunkTitle";

type Props = { isOpen: boolean; close: () => void };
export function NewDealSelector({ isOpen, close }: Props) {
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  const addActiveDeal = useAction("addActiveDeal");
  const goToActiveDeal = useGoToPage("activeDeal");
  const initNewDeal = () =>
    unstable_batchedUpdates(() => {
      addActiveDeal({ dealMode: newDealMenu.valueNext("dealMode") });
      goToActiveDeal();
    });

  return (
    <ModalSection
      {...{
        title: <ChunkTitle>New Deal</ChunkTitle>,
        show: isOpen,
        closeModal: close,
      }}
    >
      <Box>
        <MuiSelect
          {...{
            sx: { width: "100%", mt: nativeTheme.s3 },
            selectProps: { sx: { width: "100%" } },
            label: (
              <VarbLabel
                {...{ names: { sectionName: "deal", varbName: "dealMode" } }}
              />
            ),
            unionValueName: "dealMode",
            feVarbInfo: {
              ...newDealMenu.feInfo,
              varbName: "dealMode",
            },
            items: [
              ["homeBuyer", dealModeLabels.homeBuyer],
              ["buyAndHold", dealModeLabels.buyAndHold],
              ["fixAndFlip", dealModeLabels.fixAndFlip],
              ["brrrr", dealModeLabels.brrrr],
            ],
          }}
        />
        <HollowBtn
          sx={{
            mt: nativeTheme.s4,
            width: "100%",
            height: "50px",
            fontSize: nativeTheme.fs20,
          }}
          middle={"Create Deal"}
          onClick={initNewDeal}
        />
      </Box>
    </ModalSection>
  );
}
