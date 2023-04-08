import { Box } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { BsFillHouseAddFill, BsFillHousesFill } from "react-icons/bs";
import { HiOutlineVariable } from "react-icons/hi";
import { SiWebcomponentsdotorg } from "react-icons/si";
import { View } from "react-native";
import { FeRouteName } from "../Constants/feRoutes";
import { useActionWithProps } from "../sharedWithServer/stateClassHooks/useAction";
import { nativeTheme } from "../theme/nativeTheme";
import { AccountPageDeals } from "./AccountPage/SavedDeals";
import { useGoToPage } from "./appWide/customHooks/useGoToPage";
import { HollowBtn } from "./appWide/HollowBtn";
import { Row } from "./general/Row";
import { MuiBtnPropsNext } from "./general/StandardProps";

// - Make them sortable
// - Maybe show default metrics depending on deal type
// - It wouldn't be too hard to add custom tags, like Keep has
//   - Maybe start with a couple, "In process", "Closed"

const iconSize = 40;
export function AccountPage() {
  const addActiveDeal = useActionWithProps("addActiveDeal", {});
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
            onClick={addActiveDeal}
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
  const goToPage = useGoToPage(feRouteName);
  return (
    <HollowBtn
      {...{
        onClick: () => {
          unstable_batchedUpdates(() => {
            onClick && onClick();
            goToPage();
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
