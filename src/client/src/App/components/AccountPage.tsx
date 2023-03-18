import React from "react";
import { BiArchiveIn } from "react-icons/bi";
import {
  BsFillHouseAddFill,
  BsFillHouseFill,
  BsFillHousesFill,
} from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import { HiOutlineVariable } from "react-icons/hi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { SiWebcomponentsdotorg } from "react-icons/si";
import { Text, View, ViewStyle } from "react-native";
import { FeRouteName } from "../Constants/feRoutes";
import { useMainSectionActor } from "../modules/sectionActorHooks/useMainSectionActor";
import { dealModeLabels } from "../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useGetterSectionOnlyOne } from "../sharedWithServer/stateClassHooks/useGetterSection";
import { nativeTheme } from "../theme/nativeTheme";
import { useGoToPage } from "./appWide/customHooks/useGoToPage";
import { HollowBtn } from "./appWide/HollowBtn";
import { PlainIconBtn } from "./general/PlainIconBtn";
import { Row } from "./general/Row";
import { MuiBtnPropsNext } from "./general/StandardProps";
import { TrashBtn } from "./general/TrashBtn";

// Below that, show the deals menu.
// - Allow archiving—that's a great idea, good for cleaning up.
// - Filter by name
// - Filter by deal type
// - Allow sorting by
//   - Date created
//   - Date updated
//   - Maybe the default deal outputs

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
            text="Add Deal"
            icon={
              <Row>
                <BsFillHouseAddFill size={iconSize} />
              </Row>
            }
          />
          <AccountBtn
            feRouteName="compare"
            text={"Compare Deals"}
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
            text={"Input Variables"}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexWrap: "wrap",
              height: 95,
              justifyContent: "flex-start",
            }}
          >
            {icon}
            {text}
          </div>
        ),
        sx: {
          margin: accountPageElementMargin,
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

const accountPageElementMargin = nativeTheme.s3;

function AccountPageDeals() {
  const feUser = useGetterSectionOnlyOne("feUser");
  const deals = feUser.children("dealMain");
  return deals.length === 0 ? null : (
    <Row
      style={{
        ...nativeTheme.mainSection,
        flex: 1,
        height: "100%",

        margin: accountPageElementMargin,
        justifyContent: "center",
        paddingBottom: nativeTheme.s45,
      }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text
          style={{
            fontSize: nativeTheme.fs22,
            color: nativeTheme.primary.main,
          }}
        >
          Saved Deals
        </Text>

        {/* 
        - Search (property name, financing name, mgmt name, etc)
        - property name filter, 
        - loan name filter
        - mgmt name filter
        (or just have one search function that accesses all three)
        - maybe a "deal specifier" filter
        - deal type selector

        Sort by
        - date created
        - last updated 
       */}
        <View
          style={{
            marginTop: nativeTheme.s4,
            width: "100%",
          }}
        >
          {deals.map(({ feId }, idx) => (
            <AccountPageDeal
              {...{
                key: feId,
                feId,
                ...(idx === deals.length - 1 && {
                  style: { borderBottomWidth: 1 },
                }),
              }}
            />
          ))}
        </View>
      </View>
    </Row>
  );
}

const dealSectionNames = ["property", "financing", "mgmt"] as const;
type DealSectionName = typeof dealSectionNames[number];

function AccountPageDeal({ feId, style }: { feId: string; style?: ViewStyle }) {
  const mainDeal = useMainSectionActor({
    sectionName: "deal",
    feId,
  });

  const deal = mainDeal.get;

  const names = dealSectionNames.reduce((names, sectionName) => {
    names[sectionName] = deal.onlyChild(sectionName).stringValue("displayName");
    return names;
  }, {} as Record<DealSectionName, string>);

  const dealMode = deal.valueNext("dealMode");

  const textProps = {
    style: {
      color: nativeTheme.dark,
      fontSize: nativeTheme.fs18,
      marginLeft: nativeTheme.s1,
      marginRight: nativeTheme.s25,
    },
  };

  const iconProps = {
    style: {
      color: nativeTheme.primary.main,
    },
    size: 20,
  };

  return (
    <View
      style={{
        ...style,
        flex: 1,
        padding: nativeTheme.s3,
        paddingLeft: nativeTheme.s4,
        paddingRight: nativeTheme.s4,
        ...nativeTheme.formSection,
      }}
    >
      <Row style={{ justifyContent: "space-between" }}>
        <View>
          <Row>
            <Row>
              <BsFillHouseFill {...iconProps} />
              <Text {...textProps}>{names.property}</Text>
            </Row>
            <Row>
              <MdOutlineAttachMoney {...iconProps} />
              <Text {...textProps}>{names.financing}</Text>
            </Row>
            <Row>
              <FaUserTie {...iconProps} />
              <Text {...textProps}>{names.mgmt}</Text>
            </Row>
          </Row>
          <View
            style={{ paddingLeft: nativeTheme.s4, justifyContent: "center" }}
          >
            <Text>{dealModeLabels[dealMode]}</Text>
            <Text>Date Created</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center" }}>
          <TrashBtn {...{ onClick: () => mainDeal.deleteSelf() }} />
          <PlainIconBtn middle={<BiArchiveIn />} />
          <Text>Edit</Text>
        </View>
      </Row>
    </View>
  );
}
