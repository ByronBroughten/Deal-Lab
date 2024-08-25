import { Box, SxProps } from "@mui/material";
import styled from "styled-components";
import { ValueInEntityInfo } from "../../../../sharedWithServer/StateGetters/Identifiers/ValueInEntityInfo";
import { useGetterMainOnlyChild } from "../../../stateClassHooks/useMain";
import ccs from "../../../theme/cssChunks";
import { nativeTheme } from "../../../theme/nativeTheme";
import { arrSx } from "../../../utils/mui";
import {
  OnVarbSelect,
  VarbSelectorCollection,
} from "./NumObjVarbSelector/VarbSelectorCollection";

export type CollectionProps = {
  collectionId: string;
  collectionName: string;
  rowInfos: ValueInEntityInfo[];
}[];

type Props = {
  sx?: SxProps;
  nameFilter: string;
  onVarbSelect: OnVarbSelect;
  collectionProps: CollectionProps;
};

export function VarbSelector({
  sx,
  onVarbSelect,
  nameFilter,
  collectionProps,
}: Props) {
  const latent = useGetterMainOnlyChild("latentDealSystem");
  return (
    <Styled
      sx={[
        {
          border: `1px solid ${nativeTheme.complementary.light}`,
          borderRadius: nativeTheme.muiBr0,
          borderTopTightRadius: 0,
          borderBottomRightRadius: 0,
          maxHeight: 300,
          overflowY: "auto",
          overflowX: "hidden",
        },
        ...arrSx(sx),
      ]}
    >
      {collectionProps.map(({ rowInfos, collectionId, ...rest }) => {
        const rowInfosNext = rowInfos.filter((info) => {
          const { variableLabel } = latent.varbByFocalMixed(info);
          return variableLabel.toLowerCase().includes(nameFilter.toLowerCase());
        });
        return rowInfosNext.length > 0 ? (
          <VarbSelectorCollection
            {...{
              key: collectionId,
              onVarbSelect,
              rowInfos: rowInfosNext,
              ...rest,
            }}
          />
        ) : null;
      })}
    </Styled>
  );
}

const Styled = styled(Box)`
  ${ccs.dropdown.scrollbar};
`;
