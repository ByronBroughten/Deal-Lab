import { Box } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { View } from "react-native";
import { FeRouteName } from "../Constants/feRoutes";
import {
  showDealLimitReachedMessage,
  useIsAtDealLimit,
} from "../sharedWithServer/stateClassHooks/useStorageLimitReached";
import { nativeTheme } from "../theme/nativeTheme";
import { arrSx } from "../utils/mui";
import { NewDealSelector } from "./AccountPage/NewDealSelector";
import { SavedDeals } from "./AccountPage/SavedDeals";
import { HollowBtn } from "./appWide/HollowBtn";
import { useMakeGoToPage } from "./customHooks/useGoToPage";
import ChunkTitle from "./general/ChunkTitle";
import { MuiRow } from "./general/MuiRow";
import { Row } from "./general/Row";
import { MuiBtnPropsNext } from "./general/StandardProps";
import { icons } from "./Icons";
import { useDealModeContextInputModal } from "./Modals/InputModalProvider";

const iconSize = 40;
export function AccountPage() {
  const { setModal } = useDealModeContextInputModal();
  const isAtDealLimit = useIsAtDealLimit();
  const openAddDeal = () => {
    if (isAtDealLimit) {
      showDealLimitReachedMessage();
    } else {
      setModal({
        title: <ChunkTitle>New Deal</ChunkTitle>,
        children: <NewDealSelector closeSelector={() => setModal(null)} />,
      });
    }
  };

  return (
    <View>
      <MuiRow sx={{ justifyContent: "center" }}>
        <Row style={{ flexWrap: "wrap" }}>
          <AccountBtn
            onClick={openAddDeal}
            text={<Box>New Deal</Box>}
            icon={icons.addDeal({ size: iconSize })}
          />
          <AccountBtn
            feRouteName="compare"
            text={<Box>Compare Deals</Box>}
            icon={icons.compareDeals({ size: iconSize })}
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
            icon={icons.dealComponents({ size: iconSize })}
          />
          <AccountBtn
            feRouteName="userVariables"
            text={<div>Input Variables</div>}
            icon={icons.variable({ size: iconSize })}
          />
        </Row>
      </MuiRow>
      <SavedDeals />
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
        sx: [
          {
            borderRadius: nativeTheme.br0,
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
        ...rest,
      }}
    />
  );
}
