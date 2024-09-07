import React from "react";
import styled from "styled-components";
import { ThemeName } from "../../../../../../theme/Theme";

type Props = {
  className?: string;
  sectionName: ThemeName;
  children?: React.ReactNode;
};
export default function BasicSectionInfo({
  className,
  sectionName,
  children,
  ...rest
}: Props) {
  return (
    <Styled
      {...{
        className: `BasicSectionInfo-root ${className}`,
        ...rest,
      }}
    >
      <div className="BasicSectionInfo-viewable">{children}</div>
    </Styled>
  );
}
const Styled = styled.div`
  .BasicSectionInfo-viewable {
    display: flex;
    flex-direction: row;
  }
`;
