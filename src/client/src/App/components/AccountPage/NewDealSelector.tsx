import { Box } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterFeStore } from "../../sharedWithServer/stateClassHooks/useFeStore";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { MuiSelect } from "../appWide/MuiSelect";
import { VarbStringLabel } from "../appWide/VarbStringLabel";
import { useGoToPage } from "../customHooks/useGoToPage";

type Props = { closeSelector: () => void };
export function NewDealSelector(props: Props) {
  const { labSubscription } = useGetterFeStore();
  return <NewDealSelectorAddDeal {...props} />;
}

function NewDealSelectorAddDeal({ closeSelector }: Props) {
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  const addActiveDeal = useAction("addActiveDeal");
  const goToActiveDeal = useGoToPage("activeDeal");
  const initNewDeal = () =>
    unstable_batchedUpdates(() => {
      addActiveDeal({ dealMode: newDealMenu.valueNext("dealMode") });
      goToActiveDeal();
      closeSelector();
    });
  return (
    <Box>
      <MuiSelect
        {...{
          sx: { width: "100%", mt: nativeTheme.s3 },
          selectProps: { sx: { width: "100%" } },
          label: (
            <VarbStringLabel
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
  );
}

function NewDealSelectorUpgradeToPro() {}
