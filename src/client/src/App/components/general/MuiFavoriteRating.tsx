import { Box, InputLabel, Rating } from "@mui/material";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styled from "styled-components";
import {
  FeVarbInfo,
  FeVarbInfoNext,
} from "../../../sharedWithServer/SectionInfos/FeInfo";
import { numObj } from "../../../sharedWithServer/stateSchemas/StateValue/NumObj";
import { useAction } from "../../stateClassHooks/useAction";
import { useGetterVarb } from "../../stateClassHooks/useGetterVarb";
import { nativeTheme } from "../../theme/nativeTheme";
import { VarbStringLabel } from "../appWide/VarbStringLabel";

type Props = FeVarbInfo;
export function MuiFavoriteRating(feVarbInfo: Props) {
  const updateValue = useAction("updateValue");
  const varb = useGetterVarb(feVarbInfo);
  return (
    <Styled
      sx={{
        marginTop: nativeTheme.s2,
        ...nativeTheme.subSection.border,
        borderRadius: nativeTheme.muiBr0,
        paddingX: nativeTheme.s3,
        paddingY: nativeTheme.s2,
        width: "260px",
      }}
    >
      <VarbStringLabel
        {...{
          names: feVarbInfo as FeVarbInfoNext,
          label: (
            <InputLabel
              sx={{
                fontSize: nativeTheme.inputLabel.fontSize,
                color: nativeTheme.primary.main,
              }}
            >
              Likability
            </InputLabel>
          ),
        }}
      />
      <Rating
        sx={{
          color: "#ffd2da",
          "&:hover": {
            color: nativeTheme.danger.main,
          },
        }}
        value={varb.numberValue}
        onChange={(_, value) => {
          updateValue({
            ...feVarbInfo,
            value: numObj(value ?? 0),
          });
        }}
        max={10}
        name="customized-color"
        defaultValue={5}
        precision={1}
        getLabelText={(value: number) =>
          `${value} Heart${value !== 1 ? "s" : ""}`
        }
        icon={<MdFavorite className="CustomRating-icon" fontSize="inherit" />}
        emptyIcon={
          <MdFavoriteBorder className="CustomRating-icon" fontSize="inherit" />
        }
      />
    </Styled>
  );
}

const Styled = styled(Box)`
  .MuiRating-icon {
    max-width: none !important;
  }

  .CustomRating-icon {
    max-width: none !important;
  }
`;
