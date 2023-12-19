import { Box } from "@mui/material";
import { rem } from "polished";
import styled from "styled-components";
import { useGetterSection } from "../../../../../../stateClassHooks/useGetterSection";
import theme from "../../../../../../theme/Theme";
import { nativeTheme } from "../../../../../../theme/nativeTheme";
import ConditionalRows from "./ConditionalRowList/ConditionalRows";
import LogicRow from "./ConditionalRowList/LogicRow";

type Props = {
  viewIsOpen: boolean;
  toggleView: () => void;
  feId: string;
};
export function ConditionalRowList({ viewIsOpen, toggleView, feId }: Props) {
  const numVarbItem = useGetterSection({
    sectionName: "conditionalRowList",
    feId,
  });

  const conditionalRowIds = numVarbItem.childFeIds("conditionalRow");
  return (
    <Styled className="variable-content">
      <div className="inner-div">
        {!viewIsOpen && (
          <>
            <LogicRow feId={conditionalRowIds[0]} />
            <Box
              className="ellipsis"
              sx={{
                display: "flex",
                alignItems: "flex-end",
                position: "relative",
                lineHeight: "20px",
                height: nativeTheme.unlabeledInputHeight,
                fontSize: "1.7rem",
                marginLeft: "0.125rem",
              }}
            >
              {"..."}
            </Box>
          </>
        )}
        {viewIsOpen && <ConditionalRows {...{ conditionalRowIds }} />}
        {/* <ToggleViewBtn viewIsOpen={viewIsOpen} onClick={toggleView} /> */}
      </div>
    </Styled>
  );
}

const Styled = styled.tr`
  .trash-btn {
    background: transparent;
    .icon {
      height: ${theme.unlabeledInputHeight};
      width: ${theme.unlabeledInputHeight};
    }
  }

  td.type {
    .MuiSelect-root {
      width: ${rem("50px")};
    }
  }

  .ellipsis {
    display: flex;
    align-items: flex-end;
    position: relative;

    line-height: 20px;

    height: ${theme.unlabeledInputHeight};
    font-size: 1.7rem;
    margin-left: 0.125rem;
  }
`;
