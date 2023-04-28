import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useSetterVarb } from "../../sharedWithServer/stateClassHooks/useSetterVarb";
import { Toggler } from "../general/Toggler";

interface Props {
  feVarbInfo: FeVarbInfo;

  label: React.ReactNode;
  name?: string;
  onChange?: (nextValue?: boolean) => void;
  className?: string;
}

export function TogglerBooleanVarb({ feVarbInfo, onChange, ...rest }: Props) {
  const boolVarb = useSetterVarb(feVarbInfo);
  const checked = boolVarb.value("boolean");
  return (
    <Toggler
      {...{
        ...rest,
        checked,
        onChange: () => {
          unstable_batchedUpdates(() => {
            const nextValue = !checked;
            boolVarb.updateValue(nextValue);
            onChange && onChange(nextValue);
          });
        },
      }}
    />
  );
}
