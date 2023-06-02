import { Box } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { BsFillHouseAddFill, BsFillHousesFill } from "react-icons/bs";
import { HiOutlineVariable } from "react-icons/hi";
import { SiWebcomponentsdotorg } from "react-icons/si";
import { View } from "react-native";
import { FeRouteName } from "../Constants/feRoutes";
import { useToggleView } from "../modules/customHooks/useToggleView";
import { nativeTheme } from "../theme/nativeTheme";
import { arrSx } from "../utils/mui";
import { NewDealSelector } from "./AccountPage/NewDealSelector";
import { AccountPageDeals } from "./AccountPage/SavedDeals";
import { HollowBtn } from "./appWide/HollowBtn";
import { useMakeGoToPage } from "./customHooks/useGoToPage";
import { MuiRow } from "./general/MuiRow";
import { Row } from "./general/Row";
import { MuiBtnPropsNext } from "./general/StandardProps";

const iconSize = 40;
export function AccountPage() {
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
      <NewDealSelector
        {...{
          isOpen: addDealIsOpen,
          close: closeAddDeal,
        }}
      />
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
