import { capitalize } from "lodash";
import { FaList } from "react-icons/fa";
import styled, { css } from "styled-components";
import { FeInfoByType } from "../../sharedWithServer/SectionsMeta/Info";
import theme, { ThemeName } from "../../theme/Theme";
import { DropdownList } from "./DropdownList";
import { RowIndexRows } from "./RowIndexRows";

type Props = {
  feInfo: FeInfoByType<"hasRowIndex">;
  pluralName: string;
  disabled: boolean;
  className?: string;
  dropTop?: boolean;
};

export default function RowIndexSectionList({
  feInfo,
  dropTop = false,
  className,
  pluralName,
}: Props) {
  return (
    <DropdownList
      {...{
        className: "MainsectionTitleRow-dropdownList " + className ?? "",
        title: `${capitalize(pluralName)}`,
        dropTop,
        icon: <FaList className="RowIndexSectionList-listIcon" />,
      }}
    >
      <RowIndexRows feInfo={feInfo} />
    </DropdownList>
  );
}

const Styled = styled.div<{
  sectionName: ThemeName;
  $active: boolean;
  $dropTop: boolean;
}>`
  position: relative;
  display: inline-block;

  .RowIndexSectionList-loadBtn {
    ${({ $active, sectionName }) =>
      $active &&
      css`
        color: ${theme["gray-600"]};
        /* background-color: ${theme["gray-600"]}; */
        /* border: 3px solid ${theme[sectionName].dark}; */
      `}
  }

  .RowIndexRows-root {
    ${({ $dropTop }) =>
      $dropTop &&
      css`
        bottom: 37px;
      `}
  }
`;
