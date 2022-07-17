import { CompositeDecorator, Editor, EditorState } from "draft-js";
import { darken, lighten } from "polished";
import React from "react";
import { css } from "styled-components";
import styled from "styled-components/macro";
import useOnOutsideClickRef from "../../modules/customHooks/useOnOutsideClickRef";
import { getEntityStrategy } from "../../modules/draftjs/getEntityStrategies";
import { insertEntity } from "../../modules/draftjs/insert";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/Info";
import ErrorMessage from "../appWide/ErrorMessage";
import ItemOrCommaSpan, {
  CommaSpan,
  ItemSpan,
} from "./ListEditor/ItemOrCommaSpan";
import { useDraftInput } from "./useDraftInput";

export const inputHeight = css`
  height: calc(1.5em + 0.5rem + 2px);
`;
const focusTransition = css`
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  :focus-within {
    box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
    border-color: #80bdff;
    color: #495057;
    background-color: #fff;
    outline: 0;
  }
`;

const shellCss = css`
  ${inputHeight}
  padding: 0.25rem 0.5rem;
  /* height: calc(1.5em + 0.25rem + 2px); */
  /* padding: 0.125rem 0.25rem; */
  border: 1px solid #ced4da;
  border-radius: 0.2rem;

  background-color: #fff;
  background-clip: padding-box;

  line-height: 1.5;
  font-size: 0.875rem;
  font-weight: 400;
  color: #495057;
  overflow: hidden;
  ${focusTransition}
`;

const compositeDecorator = new CompositeDecorator([
  {
    strategy: getEntityStrategy("IMMUTABLE"),
    component: ItemOrCommaSpan,
  },
]);

export function ListEditorNext({
  feVarbInfo,
  ...rest
}: {
  feVarbInfo: FeVarbInfo;
  className?: string;
}) {
  const { onChange, editorState } = useDraftInput({
    ...feVarbInfo,
    valueType: "stringArray",
    compositeDecorator,
  });

  // this will eventually come from the varb
  const error = false;
  const editor = React.useRef<Editor>(null);

  const insertEntityOrComma = (char: string, editorState: EditorState) => {
    editorState = insertEntity(editorState, char);
    return editorState;
  };

  const handleBeforeKeyInput = (
    char: string,
    editorState: EditorState
  ): "handled" => {
    editorState = insertEntityOrComma(char, editorState);
    onChange(editorState);
    return "handled";
  };

  const [dropped, setDropped] = React.useState(false);
  const componentRef = useOnOutsideClickRef(() => setDropped(false));

  return (
    <StyledWrapper
      {...rest}
      ref={componentRef}
      onClick={() => {
        setDropped(true);
      }}
    >
      {" "}
      <span className="full-input">
        <span className="pre-input"> list</span>
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={onChange}
          handleBeforeInput={handleBeforeKeyInput}
          handleReturn={() => "handled"}
          blockStyleFn={() => "inlineBlock"}
          handlePastedFiles={() => "handled"}
          handleDroppedFiles={() => "handled"}
          handleDrop={() => "handled"}
          stripPastedStyles
        />
      </span>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {dropped && (
        <div className="listInfo">
          <ItemSpan>item 1</ItemSpan>
          <CommaSpan>,</CommaSpan>
          <ItemSpan>item 2</ItemSpan>
          <CommaSpan>,</CommaSpan>
          ...
        </div>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div.attrs(({ className, ...rest }) => ({
  className: className,
  ...rest,
}))`
  display: flex;
  position: relative;
  flex: 1;
  color: ${(props) => darken(0.15, props.theme.info)};

  span.full-input {
    display: flex;
    flex: 1;
    border-radius: 1rem 0.2rem 0.2rem 1rem;
    position: relative;
    ${focusTransition}
  }

  span.pre-input {
    border: 1px solid ${(props) => lighten(0.2, props.theme.secondary)};
    border-right: none;
    padding: 0 0.25rem 0 0.5rem;
    border-radius: 1rem 0 0 1rem;
  }

  div.listInfo {
    position: absolute;
    top: 30px;
    left: 34px;
    border: 1px solid ${(props) => lighten(0.3, props.theme.secondary)};
    border-radius: 0 0 0.2rem 0.2rem;
    padding: 0 0.2rem 0 0.2rem;
    font-size: 80%;
    background-color: ${(props) => lighten(0.45, props.theme.secondary)};
  }

  // when using css on this, override flex with none or something and set the width.
  div.DraftEditor-root {
    display: flex;
    flex: 1;
    ${shellCss}
    border-radius: 0 0.2rem 0.2rem 0;
    min-width: 136px;

    :focus-within {
      box-shadow: 0 0 0 0;
    }
  }

  // inner styling shell
  div.DraftEditor-editorContainer {
    white-space: nowrap;
  }

  // the extent of the actual typed content of the editor
  div.public-DraftEditor-content {
    display: inline-block;
  }

  .public-DraftStyleDefault-block {
  }
`;
