import { FormControl, InputLabel, Select } from "@material-ui/core";
import { ChangeEvent, ReactNode } from "react";
import styled from "styled-components";
import ccs from "../../theme/cssChunks";
import { getMaterialAttrs } from "./shared/getMaterialAttrs";

type Props = {
  name: string;
  value: string;
  onChange:
    | ((
        event: ChangeEvent<{
          name?: string | undefined;
          value: unknown;
        }>,
        child: ReactNode
      ) => void)
    | undefined;
  children: ReactNode;
  label?: string;
  className?: string;
};

export default function MaterialSelect({
  name,
  value,
  onChange,
  children,
  label,
  className,
}: Props) {
  return (
    <Styled {...{ className }}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select {...{ name, value, onChange }}>{children}</Select>
    </Styled>
  );
}

const Styled = styled(FormControl).attrs(
  getMaterialAttrs("material-form-control")
)`
  .MuiSelect-root {
    ${ccs.materialDraftEditor.root};
    padding-right: 20px;
    min-width: 0.7rem;
  }
  .MuiSelect-iconFilled {
    right: 0px;
  }
`;
