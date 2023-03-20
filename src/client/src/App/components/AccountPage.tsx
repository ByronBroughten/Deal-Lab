import { Box } from "@mui/material";
import React from "react";
import { BsFillHouseAddFill, BsFillHousesFill } from "react-icons/bs";
import { HiOutlineVariable } from "react-icons/hi";
import { SiWebcomponentsdotorg } from "react-icons/si";
import { View } from "react-native";
import { FeRouteName } from "../Constants/feRoutes";
import { nativeTheme } from "../theme/nativeTheme";
import { AccountPageDeals } from "./AccountPage/AccountPageDeals";
import { useGoToPage } from "./appWide/customHooks/useGoToPage";
import { HollowBtn } from "./appWide/HollowBtn";
import { Row } from "./general/Row";
import { MuiBtnPropsNext } from "./general/StandardProps";

// Below that, show the deals menu.

// Each accountDeal has a varbInfo for the deal
// it represents.
// You can sort them.
// Map through them and get the info you need.

// Display them in a table like gmail emails

// For each deal show
// - Property name/financing name/mgmt name
// - Deal Type: Buy and Hold
// - Possibly the default outputs for the deal type
// - Copy button
// - Edit button
// - Archive button

// - It wouldn't be too hard to add custom tags, like Keep has
//   - Maybe start with a couple, "In process", "Closed"

const iconSize = 40;
export function AccountPage() {
  return (
    <View>
      <Row
        style={{
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Row style={{ flexWrap: "wrap" }}>
          <AccountBtn
            feRouteName="activeDeal"
            text={<Box>Add Deal</Box>}
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
      </Row>
      <AccountPageDeals />
    </View>
  );
}

const size = 180;
interface AccountBtnProps extends MuiBtnPropsNext {
  feRouteName: FeRouteName;
  icon?: React.ReactNode;
  text?: React.ReactNode;
}
function AccountBtn({ icon, text, sx, feRouteName, ...rest }: AccountBtnProps) {
  const goToPage = useGoToPage(feRouteName);
  return (
    <HollowBtn
      {...{
        onClick: goToPage,
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
        sx: {
          margin: nativeTheme.dealMenuElement.margin,
          fontSize: nativeTheme.fs22,
          height: size,
          width: size,
          whiteSpace: "normal",
          ...sx,
        },
        ...rest,
      }}
    />
  );
}
