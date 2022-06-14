import { FaList } from "react-icons/fa";
import styled, { css } from "styled-components";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import useToggle from "../../modules/customHooks/useToggle";
import { FeInfoByType } from "../../sharedWithServer/SectionsMeta/Info";
import theme, { ThemeName, themeSectionNameOrDefault } from "../../theme/Theme";
import { LoggedInOrOutIconBtn } from "./LoggedInOrNotBtn";
import { RowIndexRows } from "./RowIndexRows";

type Props = {
  feInfo: FeInfoByType<"hasRowIndex">;
  pluralName: string;
  disabled: boolean;
  className?: string;
  droptop?: boolean;
};

export default function RowIndexSectionList({
  feInfo,
  droptop = false,
  className,
  pluralName,
}: Props) {
  const { value: dropped, toggle: toggleDropped, setOff } = useToggle();
  const { sectionName } = feInfo;

  const listRef = useOnOutsideClickRef(setOff);

  return (
    <Styled
      {...{
        sectionName: themeSectionNameOrDefault(sectionName),
        className: `RowIndexSectionList-root ${className}`,
        $active: dropped,
        $droptop: droptop,
        ref: listRef,
      }}
    >
      <LoggedInOrOutIconBtn
        {...{
          shared: {
            btnProps: {
              children: <FaList className="RowIndexSectionList-listIcon" />,
              className: "RowIndexSectionList-loadBtn",
            },
          },
          loggedIn: {
            btnProps: {
              onClick: toggleDropped,
            },
            tooltipProps: {
              title: dropped ? "" : `Saved ${pluralName}`,
            },
          },
          loggedOut: {
            btnProps: {
              disabled: true,
            },
            tooltipProps: {
              title: `Login to access saved ${pluralName}`,
            },
          },
        }}
      />
      {dropped && <RowIndexRows feInfo={feInfo} />}
    </Styled>
  );
}

const Styled = styled.div<{
  sectionName: ThemeName;
  $active: boolean;
  $droptop: boolean;
}>`
  position: relative;
  display: inline-block;

  .RowIndexSectionList-listIcon {
  }

  .RowIndexSectionList-loadBtn {
    /* :hover {
      color: ${theme.light};
      background-color: ${theme["gray-600"]};
      border: 3px solid ${({ sectionName }) => theme[sectionName].dark};
    } */

    ${({ $active, sectionName }) =>
      $active &&
      css`
        color: ${theme["gray-600"]};
        /* background-color: ${theme["gray-600"]}; */
        /* border: 3px solid ${theme[sectionName].dark}; */
      `}
  }

  .RowIndexRows-root {
    ${({ $droptop }) =>
      $droptop &&
      css`
        bottom: 37px;
      `}
  }
`;
