import React from "react";
import { nativeTheme } from "../../../theme/nativeTheme";
import ChunkTitle from "../../general/ChunkTitle";

type Props = { title: React.ReactNode };
export function DealSubSectionTitle({ title }: Props) {
  return (
    <ChunkTitle
      sx={{
        color: nativeTheme.primary.main,
        minWidth: "200px",
      }}
    >
      {title}
    </ChunkTitle>
  );
}
