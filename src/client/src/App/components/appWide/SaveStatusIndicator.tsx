import { AiOutlineSync } from "react-icons/ai";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import styled, { css } from "styled-components";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { useGetterFeStore } from "../../sharedWithServer/stateClassHooks/useFeStore";
import { nativeTheme } from "../../theme/nativeTheme";
import { ListMenuBtn } from "./ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

type Props = {
  className?: string;
};
export function SaveStatusIndicator({ className }: Props) {
  const { saveStatus, isLoggedIn } = useGetterFeStore();
  const btnProps: Record<StateValue<"appSaveStatus">, any> = {
    unsaved: {
      $color: nativeTheme["gray-500"],
      get icon() {
        return <BsCloudSlash />;
      },
      text: "Unsaved",
    },
    saving: {
      $color: nativeTheme.complementary.main,
      get icon() {
        return <AiOutlineSync />;
      },
      text: "Saving",
    },
    saved: {
      $color: nativeTheme.secondary.main,
      get icon() {
        return <BsCloudCheck />;
      },
      text: "Saved",
    },
    saveFailed: {
      $color: nativeTheme.danger.main,
      get icon() {
        return <BsCloudSlash />;
      },
      text: "Save failed",
    },
  } as const;
  return isLoggedIn ? (
    <Styled
      {...{
        ...btnProps[saveStatus],
        className: `ChangesSyncedStatusBtn-root ${className ?? ""}`,
      }}
    />
  ) : null;
}

const Styled = styled(ListMenuBtn)<{ $color: string }>`
  background: transparent;
  white-space: nowrap;
  font-size: ${nativeTheme.fs14};

  ${({ $color }) => css`
    border: none;
    color: ${$color};
    font-size: ${nativeTheme.fs14};

    :hover {
      color: ${$color};
      background: transparent;
      cursor: auto;
    }
  `};
`;
