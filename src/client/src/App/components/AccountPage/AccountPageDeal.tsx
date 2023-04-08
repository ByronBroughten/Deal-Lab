import { unstable_batchedUpdates } from "react-dom";
import { Text, View, ViewStyle } from "react-native";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { useActionWithProps } from "../../sharedWithServer/stateClassHooks/useAction";
import { timeS } from "../../sharedWithServer/utils/timeS";
import { nativeTheme } from "../../theme/nativeTheme";
import { reactNativeS } from "../../utils/reactNative";
import { useGoToPage } from "../appWide/customHooks/useGoToPage";
import { PlainIconBtn, PlainIconBtnProps } from "../general/PlainIconBtn";
import { useGetterSection } from "./../../sharedWithServer/stateClassHooks/useGetterSection";
import { Row } from "./../general/Row";
import { icons } from "./../Icons";

const titleProps = {
  style: {
    color: nativeTheme.primary.main,
    fontSize: nativeTheme.fs18,
    maxWidth: 800,
  },
};

const dealTypeProps = {
  style: {
    fontSize: nativeTheme.fs16,
    marginLeft: nativeTheme.s2,
  },
};

const iconProps = {
  style: {
    color: nativeTheme.primary.main,
  },
  size: 20,
};

const rowStyle = reactNativeS.view({
  margin: nativeTheme.s1,
  marginRight: nativeTheme.s25,
  alignItems: "center",
});

export function AccountPageDeal({
  feId,
  style,
}: {
  feId: string;
  style?: ViewStyle;
}) {
  const storeName = "dealMain";
  const deal = useGetterSection({ sectionName: "deal", feId });
  const goToActiveDeal = useGoToPage("activeDeal");
  const copyDeal = useActionWithProps("copyInStore", { storeName, feId });
  const deleteDeal = useActionWithProps("removeFromStore", { storeName, feId });
  const activateDeal = useActionWithProps("activateDeal", { feId });

  const dateNumber = deal.valueNext("dateTimeFirstSaved");
  const dateCreated = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  }).format(timeS.standardToMilliSeconds(dateNumber));

  const dealMode = deal.valueNext("dealMode");
  const editDeal = () => {
    unstable_batchedUpdates(() => {
      activateDeal();
      goToActiveDeal();
    });
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
        <Text {...titleProps}>{deal.stringValue("displayName")}</Text>
        {/* <Row {...rowProps}>
          {icons.property(iconProps)}
          <Text {...titleProps}>{names.property}</Text>
        </Row>
        <Row {...rowProps}>
          <MdOutlineAttachMoney
            {...{
              ...iconProps,
              style: {
                ...iconProps.style,
                marginRight: -5,
              },
            }}
          />
          <Text
            {...{
              ...titleProps,
              style: {
                ...titleProps.style,
                paddingLeft: -3,
              },
            }}
          >
            {names.financing}
          </Text>
        </Row>
        <Row {...rowProps}>
          <FaUserTie {...iconProps} />
          <Text {...titleProps}>{names.mgmt}</Text>
        </Row>
         */}
        <Row
          style={{
            ...rowStyle,
            paddingLeft: nativeTheme.s4,
          }}
        >
          <Text>Created </Text>
          <Text>{dateCreated}</Text>
        </Row>
      </Row>
      <Row style={{ justifyContent: "space-between" }}>
        <Row style={rowStyle}>
          {icons["buyAndHold"](iconProps)}
          <Text {...dealTypeProps}>{dealModeLabels[dealMode]}</Text>
        </Row>
        <Row>
          <PillIconBtn
            {...{
              sx: {
                margin: nativeTheme.s15,
                marginTop: nativeTheme.s25,
                marginRight: nativeTheme.s2,
              },
              left: icons.edit({ size: 20 }),
              middle: "Edit",
              onClick: editDeal,
            }}
          />
          <PillIconBtn
            {...{
              onClick: copyDeal,
              sx: {
                margin: nativeTheme.s1,
                marginTop: nativeTheme.s25,
                marginRight: nativeTheme.s15,
              },
              left: icons.copy({ size: 20 }),
              middle: "Copy",
            }}
          />
          <PillIconBtn
            {...{
              onClick: deleteDeal,
              sx: {
                margin: nativeTheme.s1,
                marginTop: nativeTheme.s25,
                "&:hover": {
                  color: nativeTheme.danger.dark,
                  backgroundColor: nativeTheme["gray-300"],
                  borderColor: nativeTheme.danger.dark,
                },
              },
              left: icons.delete({ size: 20 }),
              middle: "Delete",
            }}
          />
        </Row>
      </Row>
    </View>
  );
}

function PillIconBtn({ sx, ...rest }: PlainIconBtnProps) {
  return (
    <PlainIconBtn
      {...{
        ...rest,
        sx: {
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "transparent",
          color: nativeTheme.darkBlue.dark,
          borderRadius: 5,
          paddingLeft: nativeTheme.s25,
          paddingRight: nativeTheme.s25,
          fontSize: nativeTheme.fs14,
          "&:hover": {
            color: nativeTheme.light,
            backgroundColor: nativeTheme.darkBlue.main,
            borderColor: nativeTheme.darkBlue.main,
          },
          ...sx,
        },
      }}
    />
  );
}
