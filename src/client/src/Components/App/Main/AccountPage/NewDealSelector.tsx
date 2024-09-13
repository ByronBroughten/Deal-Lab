import { Box, SxProps } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";
import { useActionNoSave } from "../../../../modules/stateHooks/useAction";
import { useGetterSectionOnlyOne } from "../../../../modules/stateHooks/useGetterSection";
import { constants } from "../../../../sharedWithServer/Constants";
import { dealModeLabels } from "../../../../sharedWithServer/stateSchemas/schema4ValueTraits/StateValue/unionValues";
import { nativeTheme } from "../../../../theme/nativeTheme";
import { MuiRow } from "../../../general/MuiRow";
import { HollowBtn } from "../../appWide/HollowBtn";
import { MuiSelect } from "../../appWide/MuiSelect";
import { VarbStringLabel } from "../../appWide/VarbStringLabel";

type Props = { sx?: SxProps };
export function NewDealSelector(props: Props) {
  return <NewDealSelectorAddDeal {...props} />;
}

function NewDealSelectorAddDeal({ sx }: Props) {
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  const session = useGetterSectionOnlyOne("sessionStore");
  const updateValue = useActionNoSave("updateValue");
  const setCreateDeal = () => {
    unstable_batchedUpdates(() => {
      updateValue({
        ...session.varbInfo("isCreatingDeal"),
        value: true,
      });
    });
  };

  return (
    <Box sx={sx}>
      <MuiRow sx={{ paddingLeft: nativeTheme.s25 }}>
        {/* <MuiRadioSelect
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
        /> */}
        <MuiSelect
          {...{
            sx: { width: "100%", mt: nativeTheme.s4 },
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
        />
        <HollowBtn
          sx={{
            mt: nativeTheme.s4,
            width: "100%",
            height: "50px",
            fontSize: nativeTheme.fs20,
          }}
          middle={`Create ${constants.appUnit}`}
          onClick={setCreateDeal}
        />
      </MuiRow>
    </Box>
  );
}
