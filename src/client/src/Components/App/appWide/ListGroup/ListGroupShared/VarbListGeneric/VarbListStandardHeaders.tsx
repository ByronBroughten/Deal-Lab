import { FirstContentHeader } from "./FirstContentCellAndHeader";

type Props = { contentTitle: React.ReactNode };
export function VarbListStandardHeaders({ contentTitle }: Props) {
  return (
    <tr>
      <th className="VarbListTable-nameHeader">Name</th>
      <FirstContentHeader>{contentTitle}</FirstContentHeader>
      <th className="VarbListTable-btnHeader"></th>
    </tr>
  );
}
