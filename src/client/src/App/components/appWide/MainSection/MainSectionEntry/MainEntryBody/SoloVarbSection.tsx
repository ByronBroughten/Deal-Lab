import React from "react";
import NumObjEditor from "../../../../inputs/NumObjEditor";
import styled from "styled-components";
import theme, {
  ThemeFeInfo,
  ThemeSectionName,
} from "../../../../../theme/Theme";
import ccs from "../../../../../theme/cssChunks";

type Props = {
  feInfo: ThemeFeInfo;
  varbName: string;
  title: string;
  className?: string;
};
export default function SoloVarbSection({
  feInfo,
  varbName,
  title,
  className,
}: Props) {
  const { sectionName } = feInfo;
  return (
    <Styled
      className={"SoloVarbSection-root " + className}
      {...{ sectionName }}
    >
      <div className="viewable">
        <h6 className="title-text">{title}</h6>
        <div className="light-strip">
          <NumObjEditor feVarbInfo={{ varbName, ...feInfo }} labeled={false} />
        </div>
      </div>
    </Styled>
  );
}

const Styled = styled.div<{ sectionName: ThemeSectionName }>`
  ${({ sectionName }) => ccs.subSection.main(sectionName)};

  .light-strip {
    margin-top: ${theme.s1};
    background-color: ${({ sectionName }) => theme[sectionName].light};
    padding: ${theme.s2};
    border-radius: ${theme.br1};
  }
`;
