import { AiOutlineSync } from "react-icons/ai";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import styled, { css } from "styled-components";
import { useFeStore } from "../../modules/sectionActorHooks/useFeStore";
import { StateValue } from "../../sharedWithServer/SectionsMeta/values/StateValue";
import { nativeTheme } from "../../theme/nativeTheme";
import { ListMenuBtn } from "./ListGroup/ListGroupShared/ListMenuSimple/ListMenuBtn";

type Props = {
  className?: string;
};
export function SaveStatusBtn({ className }: Props) {
  const { saveStatus, isLoggedIn } = useFeStore();
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
      background-color: ${nativeTheme.fs14};
      cursor: auto;
    }
  `};
`;
