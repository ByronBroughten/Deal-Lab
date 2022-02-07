import React from "react";

export type Adornment = React.ReactElement<any, any> | string;
export type Adornments = {
  startAdornment: Adornment;
  endAdornment: Adornment;
};
export type PropAdornments = Partial<Adornments>;

interface GetAdornmentsProps {
  pAdornments: PropAdornments;
  vAdornments: Adornments;
  editorTextStatus: string;
  displayValue: string;
}

function getAdornments({
  pAdornments,
  vAdornments,
  editorTextStatus,
  displayValue,
}: GetAdornmentsProps): Adornments {
  let startAdornment = pAdornments.startAdornment ?? vAdornments.startAdornment;
  let endAdornment = pAdornments.endAdornment ?? vAdornments.endAdornment;

  if (editorTextStatus === "solvableText") {
    return {
      startAdornment: "",
      endAdornment: (
        <>
          <span className="input-extra">{`=${startAdornment}`}</span>
          <span className="result">{displayValue}</span>
          {endAdornment}
        </>
      ),
    };
  } else return { startAdornment, endAdornment };
}

export default function useGetEndAdornments(props: GetAdornmentsProps) {
  return getAdornments(props);

  return React.useMemo(() => {
    return getAdornments(props);
  }, [...Object.values(props)]);
}
