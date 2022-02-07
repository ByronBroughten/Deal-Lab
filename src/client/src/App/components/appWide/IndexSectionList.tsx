import styled, { css } from "styled-components";
import theme, {
  ThemeSectionName,
  themeSectionNameOrDefault,
} from "../../theme/Theme";
import SectionBtn from "./SectionBtn";
import useToggle from "../../modules/customHooks/useToggle";
import { LoadIndexSectionList } from "./LoadIndexSectionList";
import { FeInfo } from "../../sharedWithServer/Analyzer/SectionMetas/Info";
import LoginToAccessBtnTooltip from "./LoginToAccessBtnTooltip";

type Props = {
  feInfo: FeInfo<"hasIndexStore">;
  pluralName: string;
  disabled: boolean;
  className?: string;
  droptop?: boolean;
};

export default function IndexSectionList({
  feInfo,
  disabled = true,
  droptop = false,
  className,
}: Props) {
  const { value: dropped, toggle: toggleDropped } = useToggle();
  const { sectionName } = feInfo;

  return (
    <Styled
      {...{
        sectionName: themeSectionNameOrDefault(sectionName),
        className: `IndexSectionList-root ${className}`,
        active: dropped,
        droptop,
      }}
    >
      <LoginToAccessBtnTooltip>
        <SectionBtn
          className="IndexSectionList-loadBtn"
          onClick={toggleDropped}
          disabled={disabled}
        >
          Load
        </SectionBtn>
      </LoginToAccessBtnTooltip>
      {dropped && <LoadIndexSectionList feInfo={feInfo} />}
    </Styled>
  );
}

const Styled = styled.div<{
  sectionName: ThemeSectionName;
  active: boolean;
  droptop: boolean;
}>`
  position: relative;
  display: inline-block;

  .IndexSectionList-loadBtn {
    :hover {
      color: ${theme.light};
      background-color: ${theme["gray-600"]};
      border: 3px solid ${({ sectionName }) => theme[sectionName].dark};
    }

    ${({ active, sectionName }) =>
      active &&
      css`
        color: ${theme.light};
        background-color: ${theme["gray-600"]};
        border: 3px solid ${theme[sectionName].dark};
      `}
  }

  .LoadIndexSectionList-root {
    ${({ droptop }) =>
      droptop &&
      css`
        bottom: 37px;
      `}
  }
`;
