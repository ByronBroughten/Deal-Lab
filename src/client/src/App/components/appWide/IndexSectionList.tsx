import styled, { css } from "styled-components";
import theme, {
  ThemeSectionName,
  themeSectionNameOrDefault,
} from "../../theme/Theme";
import useToggle from "../../modules/customHooks/useToggle";
import { LoadIndexSectionList } from "./LoadIndexSectionList";
import { FeInfo } from "../../sharedWithServer/Analyzer/SectionMetas/Info";
import LoginToAccessBtnTooltip from "./LoginToAccessBtnTooltip";
import { LoggedInOrOutIconBtn } from "./LoggedInOrNotBtn";
import { FaList } from "react-icons/fa";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";

type Props = {
  feInfo: FeInfo<"hasIndexStore">;
  pluralName: string;
  disabled: boolean;
  className?: string;
  droptop?: boolean;
};

export default function IndexSectionList({
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
        className: `IndexSectionList-root ${className}`,
        $active: dropped,
        $droptop: droptop,
        ref: listRef,
      }}
    >
      <LoggedInOrOutIconBtn
        {...{
          shared: {
            btnProps: {
              children: <FaList className="IndexSectionList-listIcon" />,
              className: "IndexSectionList-loadBtn",
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
      {dropped && <LoadIndexSectionList feInfo={feInfo} />}
    </Styled>
  );
}

const Styled = styled.div<{
  sectionName: ThemeSectionName;
  $active: boolean;
  $droptop: boolean;
}>`
  position: relative;
  display: inline-block;

  .IndexSectionList-listIcon {
  }

  .IndexSectionList-loadBtn {
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

  .LoadIndexSectionList-root {
    ${({ $droptop }) =>
      $droptop &&
      css`
        bottom: 37px;
      `}
  }
`;
