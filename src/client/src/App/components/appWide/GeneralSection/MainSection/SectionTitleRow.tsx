import styled from "styled-components";

type Props = {
  leftSide?: React.ReactNode;
  rightSide?: React.ReactNode;
  className?: string;
};
export function SectionTitleRow({ leftSide, rightSide, className }: Props) {
  return (
    <Styled className={`SectionTitleRow-root ${className ?? ""}`}>
      <div className="SectionTitleRow-leftSide">{leftSide ?? null}</div>
      <div className="SectionTitleRow-rightSide">{rightSide ?? null}</div>
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .SectionTitleRow-leftSide {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .SectionTitleRow-rightSide {
    display: flex;
  }
`;
