import styled from "styled-components";
import theme from "../../../../theme/Theme";
import { SectionTitle } from "../../SectionTitle";

type Props = {
  sectionTitle: string;
  leftSide?: React.ReactNode;
  rightSide?: React.ReactNode;
  className?: string;
};
export function SectionTitleRow({
  sectionTitle,
  leftSide,
  rightSide,
  className,
}: Props) {
  return (
    <Styled className={`SectionTitleRow-root ${className ?? ""}`}>
      <div className="SectionTitleRow-leftSide">
        <SectionTitle
          text={sectionTitle}
          className="SectionTitleRow-sectionTitle"
        />
        <div className="SectionTitleRow-rightOfTitle">{leftSide ?? null}</div>
      </div>
      <div className="SectionTitleRow-rightSide">{rightSide ?? null}</div>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .SectionTitleRow-sectionTitle {
    display: flex;
    align-items: center;
  }
  .SectionTitleRow-rightOfTitle {
    margin-left: ${theme.s3};
  }

  .SectionTitleRow-leftSide {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .SectionTitleRow-rightSide {
    display: flex;
  }
`;
