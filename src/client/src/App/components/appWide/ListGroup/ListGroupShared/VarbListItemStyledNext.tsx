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
  .DraftTextField-root {
    min-width: 40px;
  }

  .LabeledValueEditor-nameEditor {
    .DraftEditor-root {
      min-width: 60px;
    }
  }
  .LabeledValueEditor-equationEditor {
    .DraftEditor-root {
      min-width: 70px;
    }
  }

  .NumObjEditor-calcIconPositioner {
    bottom: 1px;
  }

  td.VarbListTable-nameCell {
    .DraftTextField-root {
      min-width: 50px;
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
