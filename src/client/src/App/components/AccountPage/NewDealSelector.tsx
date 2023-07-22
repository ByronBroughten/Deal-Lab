import { Box } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { validateStateValue } from "../../sharedWithServer/SectionsMeta/values/valueMetas";
import { useActionNoSave } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterFeStore } from "../../sharedWithServer/stateClassHooks/useFeStore";
import { useGetterSectionOnlyOne } from "../../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../../theme/nativeTheme";
import { HollowBtn } from "../appWide/HollowBtn";
import { MuiRadioSelect } from "../appWide/MuiRadioSelect";
import { useGoToPage } from "../customHooks/useGoToPage";
import { MuiRow } from "../general/MuiRow";

export function NewDealSelector() {
  const { labSubscription } = useGetterFeStore();
  return <NewDealSelectorAddDeal />;
}

function NewDealSelectorAddDeal() {
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  const session = useGetterSectionOnlyOne("sessionStore");
  const goToActiveDeal = useGoToPage("activeDeal");
  const updateValue = useActionNoSave("updateValue");
  const setCreatingDeal = () => {
    unstable_batchedUpdates(() => {
      updateValue({
        ...session.varbInfo("isCreatingDeal"),
        value: true,
      });
      goToActiveDeal();
    });
  };

  return (
    <Box>
      <MuiRow sx={{ paddingLeft: nativeTheme.s25 }}>
        <MuiRadioSelect
          {...{
            value: newDealMenu.valueNext("dealMode"),
            onChange: (e) => {
              updateValue({
                ...newDealMenu.varbInfo("dealMode"),
                value: validateStateValue(e.target.value, "dealMode"),
              });
            },
            items: [
              ["homeBuyer", dealModeLabels.homeBuyer],
              ["buyAndHold", dealModeLabels.buyAndHold],
              ["fixAndFlip", dealModeLabels.fixAndFlip],
              ["brrrr", dealModeLabels.brrrr],
            ],
          }}
        />

        {/* <MuiSelect
        {...{
          sx: { width: "100%", mt: nativeTheme.s3 },
          selectProps: { sx: { width: "100%" } },
          label: (
            <VarbStringLabel
              {...{
                names: { sectionName: "deal", varbName: "dealMode" },
                id: "new-deal-select-deal-type",
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
      /> */}
        <HollowBtn
          sx={{
            mt: nativeTheme.s4,
            width: "100%",
            height: "50px",
            fontSize: nativeTheme.fs20,
          }}
          middle={"Create Deal"}
          onClick={setCreatingDeal}
        />
      </MuiRow>
    </Box>
  );
}

function NewDealSelectorUpgradeToPro() {}
