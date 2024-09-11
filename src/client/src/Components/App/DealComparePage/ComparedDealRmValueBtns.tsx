import { nativeTheme } from "../../../theme/nativeTheme";
import { Column } from "../../general/Column";
import { DealCompareRmValueBtn } from "./CompareDealRmBtn";

type Props = { compareValueFeIds: string[] };
export function ComparedDealRmValueBtns({ compareValueFeIds }: Props) {
  return (
    <Column
      sx={{
        paddingTop: nativeTheme.comparedDealRoot.padding,
      }}
    >
      <Column sx={{ height: nativeTheme.comparedDealHead.height }} />
      <Column>
        {compareValueFeIds.map((feId, idx) => (
          <DealCompareRmValueBtn
            {...{
              key: feId,
              feId,
              sx: {
                ...(idx === 0 && {
                  borderTopLeftRadius: nativeTheme.subSection.borderRadius,
                }),
              },
            }}
          />
        ))}
      </Column>
    </Column>
  );
}
