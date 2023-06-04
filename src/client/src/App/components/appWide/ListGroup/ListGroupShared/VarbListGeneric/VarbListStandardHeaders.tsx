type Props = { contentTitle: React.ReactNode };
export function VarbListStandardHeaders({ contentTitle }: Props) {
  return (
    <tr>
      <th className="VarbListTable-nameHeader">Name</th>
      <th className="VarbListTable-firstContentHeader VarbListTable-extensionHeader">
        {contentTitle}
      </th>
      <th className="VarbListTable-btnHeader"></th>
    </tr>
  );
}
