import { Box } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { useGoToPage } from "../appWide/customHooks/useGoToPage";
import { HollowBtn } from "../appWide/HollowBtn";
import { LabelWithInfo } from "../appWide/LabelWithInfo";
import { ModalSection } from "../appWide/ModalSection";
import { MuiSelect } from "../appWide/MuiSelect";
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
              <LabelWithInfo
                {...{
                  label: "Select Type",
                  infoTitle: "Deal Types",
                  infoText: `${dealModeLabels.homeBuyer}: estimate the costs of a home intended to be used as a primary residence.\n\n${dealModeLabels.buyAndHold}: estimate the ongoing cashflow and return on investment of a rental property.\n\n${dealModeLabels.fixAndFlip}: estimate the return on investment of buying, fixing, and selling a property.\n\n${dealModeLabels.brrrr}: "Buy, Rehab, Rent, Refinance, Repeat". A more advanced type of deal whereby a fix and flip deal is turned into a rental property.`,
                }}
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
