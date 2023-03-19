import { FaUserTie } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { Text, View, ViewStyle } from "react-native";
import { useMainSectionActor } from "../../modules/sectionActorHooks/useMainSectionActor";
import { dealModeLabels } from "../../sharedWithServer/SectionsMeta/values/StateValue/unionValues";
import { timeS } from "../../sharedWithServer/utils/date";
import { nativeTheme } from "../../theme/nativeTheme";
import { reactNativeS } from "../../utils/reactNative";
import { PlainIconBtn, PlainIconBtnProps } from "../general/PlainIconBtn";
import { Row } from "./../general/Row";
import { icons } from "./../Icons";

const dealSectionNames = ["property", "financing", "mgmt"] as const;
type DealSectionName = typeof dealSectionNames[number];
export function AccountPageDeal({
  feId,
  style,
}: {
  feId: string;
  style?: ViewStyle;
}) {
  const mainDeal = useMainSectionActor({
    sectionName: "deal",
    feId,
  });

  const deal = mainDeal.get;
  const dateNumber = deal.valueNext("dateTimeFirstSaved");
  const dateCreated = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
  }).format(timeS.standardToMilliSeconds(dateNumber));

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
    },
  };

  const iconProps = {
    style: {
      color: nativeTheme.primary.main,
    },
    size: 20,
  };

  const rowProps = {
    style: reactNativeS.view({
      margin: nativeTheme.s1,
      marginRight: nativeTheme.s25,
      alignItems: "center",
    }),
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
      <Row style={{ flexWrap: "wrap" }}>
        <Row {...rowProps}>
          {icons.property(iconProps)}
          <Text {...textProps}>{names.property}</Text>
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
              ...textProps,
              style: {
                ...textProps.style,
                paddingLeft: -3,
              },
            }}
          >
            {names.financing}
          </Text>
        </Row>
        <Row {...rowProps}>
          <FaUserTie {...iconProps} />
          <Text {...textProps}>{names.mgmt}</Text>
        </Row>
        <Row {...rowProps}>
          {icons["buyAndHold"](iconProps)}
          <Text {...textProps}>{dealModeLabels[dealMode]}</Text>
        </Row>
      </Row>
      <Row style={{ justifyContent: "space-between" }}>
        <Row>
          <PillIconBtn
            {...{
              sx: {
                margin: nativeTheme.s15,
                marginRight: nativeTheme.s25,
                "&:hover": {
                  color: nativeTheme.light,
                  backgroundColor: nativeTheme.secondary.main,
                  borderColor: nativeTheme.primary.main,
                },
              },
              left: icons.edit({ size: 20 }),
              middle: "Edit",
            }}
          />
          <PillIconBtn
            {...{
              onClick: () => mainDeal.copyAndSave(),
              sx: {
                margin: nativeTheme.s1,
                marginRight: nativeTheme.s25,
                "&:hover": {
                  color: nativeTheme.light,
                  backgroundColor: nativeTheme.secondary.main,
                  borderColor: nativeTheme.primary.main,
                },
              },
              left: icons.copy({ size: 20 }),
              middle: "Copy",
            }}
          />
          <PillIconBtn
            {...{
              onClick: () => mainDeal.deleteSelf(),
              sx: {
                margin: nativeTheme.s1,
                marginRight: nativeTheme.s25,
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
        <Row {...rowProps}>
          <Text>Created </Text>
          <Text>{dateCreated}</Text>
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
          ...nativeTheme.subSection.borderLines,
          borderRadius: 5,
          paddingLeft: nativeTheme.s25,
          paddingRight: nativeTheme.s25,
          fontSize: nativeTheme.fs16,
          ...sx,
        },
      }}
    />
  );
}
