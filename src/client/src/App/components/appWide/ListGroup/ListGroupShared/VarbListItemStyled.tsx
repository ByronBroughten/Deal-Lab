import styled from "styled-components";
import theme from "../../../../theme/Theme";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function VarbListItemStyledNext({ className, children }: Props) {
  return (
    <Styled className={`VarbListItem-root ${className ?? ""}`}>
      {children}
    </Styled>
  );
}

const Styled = styled.tr`
  td {
    padding-top: ${theme.s15};
    padding-bottom: ${theme.s15};
  }

  .DraftTextField-root {
    min-width: 40px;
  }

  td.VarbListTable-nameCell {
    .DraftTextField-root {
      min-width: 60px;
    }
  }
  .LabeledValueEditor-equationEditor {
    .DraftEditor-root {
      min-width: 70px;
    }
  }

  .VarbListItem-contentCellDiv {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: flex-end;
  }

  .XBtnCell-root {
    text-align: right;
  }

  .XBtn {
    visibility: hidden;
  }
  :hover {
    .XBtn {
      visibility: visible;
    }
  }

  .ellipsis {
    display: flex;
    align-items: flex-end;
    position: relative;

    line-height: 20px;

    height: ${theme.unlabeledInputHeight};
    font-size: 1.7rem;
    margin-left: 0.125rem;
  }
`;
