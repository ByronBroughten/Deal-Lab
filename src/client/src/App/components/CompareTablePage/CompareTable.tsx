import styled from "styled-components";
import {
  useTableActor,
  UseTableActorProps,
} from "../../modules/sectionActorHooks/useTableActor";
import useHowMany from "../appWide/customHooks/useHowMany";
import theme from "./../../theme/Theme";
import { CompareTableHeaderRow } from "./CompareTable/CompareTableHeaderRow";
import { CompareTableTitleRow } from "./CompareTable/CompareTableTitleRow";
import { IndexRow } from "./CompareTable/IndexRow";
import { ProxyIndexRow } from "./CompareTable/ProxyIndexRow";

interface Props extends UseTableActorProps {}
export function CompareTable(props: Props) {
  const table = useTableActor(props);
  const { filteredMinusComparedRows, compareRowProxies } = table;
  const { isAtLeastOne } = useHowMany(filteredMinusComparedRows);
  const scenarios = {
    areNone: () => (
      <tr>
        <td className="CompareTable-areNone" colSpan={6}>
          None
        </td>
      </tr>
    ),
    isAtLeastOne: () => (
      <>
        {filteredMinusComparedRows.map(({ feId }) => (
          <IndexRow feId={feId} key={feId} />
        ))}
      </>
    ),
  };
  return (
    <Styled className="CompareTable-root">
      <CompareTableTitleRow {...props} />
      <table className="CompareTable-table">
        <thead>
          {compareRowProxies.map(({ feId }) => (
            <ProxyIndexRow feId={feId} key={feId} />
          ))}
          <CompareTableHeaderRow {...props} />
        </thead>
        <tbody>
          {isAtLeastOne ? scenarios.isAtLeastOne() : scenarios.areNone()}
        </tbody>
      </table>
    </Styled>
  );
}

const Styled = styled.div`
  .CompareTable-areNone {
    text-align: center;
    padding: ${theme.s1};
  }
`;
