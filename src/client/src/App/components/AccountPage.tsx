import { Box } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { BsFillHouseAddFill, BsFillHousesFill } from "react-icons/bs";
import { HiOutlineVariable } from "react-icons/hi";
import { SiWebcomponentsdotorg } from "react-icons/si";
import { View } from "react-native";
import { FeRouteName } from "../Constants/feRoutes";
import { useToggleView } from "../modules/customHooks/useToggleView";
import { dealModeLabels } from "../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useAction } from "../sharedWithServer/stateClassHooks/useAction";
import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../theme/nativeTheme";
import { arrSx } from "../utils/mui";
import { AccountPageDeals } from "./AccountPage/SavedDeals";
import {
  useGoToPage,
  useMakeGoToPage,
} from "./appWide/customHooks/useGoToPage";
import { HollowBtn } from "./appWide/HollowBtn";
import { ModalSection } from "./appWide/ModalSection";
import { MuiSelect } from "./appWide/MuiSelect";
import ChunkTitle from "./general/ChunkTitle";
import { MuiRow } from "./general/MuiRow";
import { Row } from "./general/Row";
import { MuiBtnPropsNext } from "./general/StandardProps";

const iconSize = 40;
export function AccountPage() {
  const newDealMenu = useGetterSectionOnlyOne("newDealMenu");
  const addActiveDeal = useAction("addActiveDeal");
  const goToActiveDeal = useGoToPage("activeDeal");
  const initNewDeal = () =>
    unstable_batchedUpdates(() => {
      addActiveDeal({ dealMode: newDealMenu.valueNext("dealMode") });
      goToActiveDeal();
    });
  const { addDealIsOpen, openAddDeal, closeAddDeal } = useToggleView("addDeal");
  return (
    <View>
      <MuiRow sx={{ justifyContent: "center" }}>
        <Row style={{ flexWrap: "wrap" }}>
          <AccountBtn
            onClick={openAddDeal}
            text={<Box>New Deal</Box>}
            icon={<BsFillHouseAddFill size={iconSize} />}
          />
          <AccountBtn
            feRouteName="compare"
            text={<Box>Compare Deals</Box>}
            icon={<BsFillHousesFill size={iconSize} />}
          />
        </Row>
        <Row
          style={{
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <AccountBtn
            feRouteName="components"
            text={
              <div style={{ whiteSpace: "pre-line", lineHeight: "26px" }}>
                {"Deal\nComponents"}
              </div>
            }
            icon={<SiWebcomponentsdotorg size={iconSize} />}
          />
          <AccountBtn
            feRouteName="userVariables"
            text={<div>Input Variables</div>}
            icon={<HiOutlineVariable size={iconSize} />}
          />
        </Row>
      </MuiRow>
      <AccountPageDeals />
      <ModalSection
        {...{
          title: <ChunkTitle>New Deal</ChunkTitle>,
          show: addDealIsOpen,
          closeModal: closeAddDeal,
        }}
      >
        <Box>
          <MuiSelect
            {...{
              sx: { width: "100%", mt: nativeTheme.s3 },
              selectProps: { sx: { width: "100%" } },
              label: "Select type",
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
    </View>
  );
}

const size = 180;
interface AccountBtnProps extends MuiBtnPropsNext {
  feRouteName?: FeRouteName;
  onClick?: () => void;
  icon?: React.ReactNode;
  text?: React.ReactNode;
}
function AccountBtn({
  icon,
  text,
  sx,
  feRouteName,
  onClick,
  ...rest
}: AccountBtnProps) {
  const makeGoToPage = useMakeGoToPage();
  return (
    <HollowBtn
      {...{
        onClick: () => {
          unstable_batchedUpdates(() => {
            onClick && onClick();
            if (feRouteName) {
              makeGoToPage(feRouteName)();
            }
          });
        },
        middle: (
          <Box
            sx={{
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              height: 95,
              lineHeight: 1.1,
            }}
          >
            {icon}
            {text}
          </Box>
        ),
        sx: [
          {
            margin: nativeTheme.dealMenuElement.margin,
            fontSize: nativeTheme.fs22,
            height: size,
            width: size,
            whiteSpace: "normal",

            borderColor: nativeTheme.primary.main,
            color: nativeTheme.primary.main,
            "&:hover": {
              color: nativeTheme.light,
              backgroundColor: nativeTheme.secondary.main,
              borderColor: nativeTheme.secondary.main,
            },
          },
          ...arrSx(sx),
        ],
        ...rest,
      }}
    />
  );
}
