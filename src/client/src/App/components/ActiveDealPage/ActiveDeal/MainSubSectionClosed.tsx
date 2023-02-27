import styled from "styled-components";
import { nativeTheme } from "../../../theme/nativeTheme";
import { MainSection } from "../../appWide/GeneralSection/MainSection";

type Props = {
  titleRow: React.ReactNode;
  detailsSection?: React.ReactNode;
  className?: string;
};

export function MainSubSectionClosed({
  titleRow,
  detailsSection,
  className,
}: Props) {
  return (
    <Styled className={`MainSubSectionClosed-root ${className ?? ""}`}>
      <div className="MainSubSection-inactiveTitleRow">{titleRow}</div>
      {detailsSection && (
        <div className="MainSubSection-detailsDiv">{detailsSection}</div>
      )}
    </Styled>
  );
}

const Styled = styled(MainSection)`
  padding-top: ${nativeTheme.s25};
  padding-bottom: ${nativeTheme.s25};
  padding-right: ${nativeTheme.s25};

  .MainSubSection-detailsDiv {
    margin-top: ${nativeTheme.s25};
  }
`;
