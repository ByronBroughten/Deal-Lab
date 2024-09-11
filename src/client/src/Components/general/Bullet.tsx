import React from "react";
import theme from "../../theme/Theme";
import { Column } from "./Column";
import { Row } from "./Row";
import { TextNext } from "./TextNext";

interface BulletProps {
  text: string | React.ReactElement;
  key: string;
}

export function Bullet({ text, key }: BulletProps) {
  return (
    <Column
      sx={{
        marginTop: theme.s2,
        alignItems: "flex-start",
      }}
      key={key}
    >
      <Row>
        <Column sx={{ width: 12 }}>
          <TextNext sx={{ fontSize: 16 }}>{"\u2022" + " "}</TextNext>
        </Column>
        <Column sx={{ flex: 1 }}>
          <TextNext sx={{ fontSize: 16 }}>{text}</TextNext>
        </Column>
      </Row>
    </Column>
  );
}
