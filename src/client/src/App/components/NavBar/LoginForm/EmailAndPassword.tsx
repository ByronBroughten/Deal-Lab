import React from "react";
import SmallFormTextField from "../../general/SmallFormTextField";

type Props = {
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  email: { name: string; value: string };
  password: { name: string; value: string };
};
export function EmailAndPassword({ handleChange, email, password }: Props) {
  return (
    <>
      <SmallFormTextField
        {...{
          id: email.name,
          name: email.name,
          label: "Email",
          value: email.value,
          onChange: handleChange,
        }}
      />
      <SmallFormTextField
        {...{
          id: password.name,
          label: "Password",
          type: "password",
          value: password.value,
          onChange: handleChange,
        }}
      />
    </>
  );
}
