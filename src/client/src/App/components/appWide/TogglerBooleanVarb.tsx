import React from "react";
import { unstable_batchedUpdates } from "react-dom";
import { FeVarbInfo } from "../../sharedWithServer/SectionsMeta/SectionInfo/FeInfo";
import { useAction } from "../../sharedWithServer/stateClassHooks/useAction";
import { useGetterVarb } from "../../sharedWithServer/stateClassHooks/useGetterVarb";
import { Toggler } from "../general/Toggler";

export interface TogglerBooleanVarbProps {
  feVarbInfo: FeVarbInfo;

  label: React.ReactNode;
  name?: string;
  onChange?: (nextValue?: boolean) => void;
  className?: string;
}

export function TogglerBooleanVarb({
  feVarbInfo,
  onChange,
  ...rest
}: TogglerBooleanVarbProps) {
  const updateValue = useAction("updateValue");
  const boolVarb = useGetterVarb(feVarbInfo);
  const checked = boolVarb.value("boolean");
  return (
    <Toggler
      {...{
        ...rest,
        checked,
        onChange: () => {
          unstable_batchedUpdates(() => {
            const nextValue = !checked;
            updateValue({
              ...feVarbInfo,
              value: nextValue,
            });
            onChange && onChange(nextValue);
          });
        },
      }}
    />
  );
}
