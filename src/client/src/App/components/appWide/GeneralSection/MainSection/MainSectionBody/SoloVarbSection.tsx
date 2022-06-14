import React from "react";
import styled from "styled-components";
import ccs from "../../../../../theme/cssChunks";
import theme, { ThemeFeInfo, ThemeName } from "../../../../../theme/Theme";
import NumObjEditor from "../../../../inputs/NumObjEditor";

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

const Styled = styled.div<{ sectionName: ThemeName }>`
  ${({ sectionName }) => ccs.subSection.main(sectionName)};

  .light-strip {
    margin-top: ${theme.s1};
    background-color: ${({ sectionName }) => theme[sectionName].light};
    padding: ${theme.s2};
    border-radius: ${theme.br1};
  }
`;
