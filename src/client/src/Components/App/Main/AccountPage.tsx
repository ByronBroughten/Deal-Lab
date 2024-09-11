import { Box } from "@mui/material";
import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import {
  showDealLimitReachedMessage,
  useIsAtDealLimit,
} from "../../../modules/stateHooks/useStorageLimitReached";
import { arrSx } from "../../../modules/utils/mui";
import { constant } from "../../../sharedWithServer/Constants";
import { FeRouteName } from "../../../sharedWithServer/Constants/feRoutes";
import { nativeTheme } from "../../../theme/nativeTheme";
import { Column } from "../../general/Column";
import { MuiRow } from "../../general/MuiRow";
import { Row } from "../../general/Row";
import { MuiBtnProps } from "../../general/StandardProps";
import { HollowBtn } from "../appWide/HollowBtn";
import { useGoToPage, useMakeGoToPage } from "../customHooks/useGoToPage";
import { icons } from "../Icons";
import { SavedDeals } from "./AccountPage/SavedDeals";

const iconSize = 40;
export function AccountPage() {
  const isAtDealLimit = useIsAtDealLimit();

  const goToCreateDeal = useGoToPage("createDeal");
  const openAddDeal = () => {
    if (isAtDealLimit) {
      showDealLimitReachedMessage();
    } else {
      goToCreateDeal();
    }
  };

  return (
    <Column>
      <MuiRow sx={{ justifyContent: "center" }}>
        <Row sx={{ flexWrap: "wrap" }}>
          <AccountBtn
            onClick={openAddDeal}
            text={<Box>{`New ${constant("appUnit")}`}</Box>}
            icon={icons.addDeal({ size: iconSize })}
          />
          <AccountBtn
            feRouteName="compare"
            text={<Box>{`Compare ${constant("appUnitPlural")}`}</Box>}
            icon={icons.compareDeals({ size: iconSize })}
          />
        </Row>
        <Row
          sx={{
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <AccountBtn
            feRouteName="components"
            text={
              <div style={{ whiteSpace: "pre-line", lineHeight: "26px" }}>
                {`${constant("appUnit")}\nComponents`}
              </div>
            }
            icon={icons.dealComponents({ size: iconSize })}
          />
          <AccountBtn
            feRouteName="userVariables"
            text={<div>{`${constant("appUnit")} Variables`}</div>}
            icon={icons.variable({ size: iconSize })}
          />
        </Row>
      </MuiRow>
      <SavedDeals />
    </Column>
  );
}

const size = 180;
interface AccountBtnProps extends MuiBtnProps {
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
