import { SxProps } from "@mui/material";
import { StyleSheet, Text } from "react-native";
import { timeS } from "../../../sharedWithServer/utils/timeS";
import { nativeTheme } from "../../../theme/nativeTheme";
import theme from "../../../theme/Theme";
import { MuiRow } from "../../general/MuiRow";
import { HollowBtn } from "../appWide/HollowBtn";
import { icons } from "../Icons";
import {
  InfoModalOptions,
  InfoModalState,
  useInfoModal,
} from "./InfoModalProvider";
import { ModalSection } from "./ModalSection";

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: theme.dark,
  },
});

function getInfoModalOptions(modalState: InfoModalState): InfoModalOptions {
  return {
    title: "",
    info: "",
    moreInfoLink: "",
    timeSet: 0,
    ...modalState,
  };
}

interface Props {
  modalWrapperProps?: { sx?: SxProps };
}
export function InfoModal({ modalWrapperProps }: Props) {
  const { modalState, setModal } = useInfoModal();
  const { info, timeSet, title, moreInfoLink } =
    getInfoModalOptions(modalState);
  return (
    <ModalSection
      {...{
        title: (
          <MuiRow sx={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
            {icons.info({
              size: 30,
              style: {
                color: nativeTheme.complementary.main,
                marginRight: nativeTheme.s25,
                marginTop: nativeTheme.s15,
              },
            })}
            <MuiRow sx={{ flexWrap: "noWrap" }}>{title}</MuiRow>
          </MuiRow>
        ),
        show: Boolean(modalState),
        closeModal: () => {
          if (timeSet && timeSet < timeS.now() - 200) {
            setModal(null);
          }
        },
        modalSectionProps: {
          sx: { flex: 1, minWidth: 500, maxWidth: 600, zIndex: 5 },
        },
        modalWrapperProps,
      }}
    >
      <Text style={styles.text}>{info}</Text>
      {moreInfoLink && (
        <HollowBtn
          {...{
            href: moreInfoLink,
            target: "none",
          }}
          sx={{
            fontSize: 18,
            paddingX: nativeTheme.s3,
            marginTop: nativeTheme.s3,
            width: "50%",
            borderColor: nativeTheme["gray-300"],
            boxShadow: nativeTheme.oldShadow1,
          }}
          middle="More Info"
        />
      )}
    </ModalSection>
  );
}
