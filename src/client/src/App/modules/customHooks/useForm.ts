import React, { ChangeEventHandler, useState } from "react";
import { omit } from "lodash";
import { pick } from "lodash";
import { z } from "zod";

interface Error {
  path: string[];
  message: string;
}

type Errors = {
  [name: string]: Error[];
};

interface Props {
  doSubmit: Function;
  initialInputs: { [key: string]: any };
  formParser: z.ZodObject<any>;
}

export type FieldError = {
  path: string[];
  message: string;
};

function validate(
  value: any,
  parser: z.ZodType<any>
): { success: boolean; errors?: FieldError[] } {
  const result = parser.safeParse(value);
  if ("error" in result) {
    return {
      success: false,
      errors: result.error.errors.map((e: any) => ({
        ...pick(e, ["message", "path"]),
      })),
    };
  }
  return pick(result, ["success"]);
}

export const useForm = ({ doSubmit, initialInputs, formParser }: Props) => {
  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState({} as Errors);

  function validateChange(currentTarget: any) {
    const parser = formParser.shape[currentTarget.name];
    const result = validate(currentTarget.value, parser);

    if (result.success) {
      if (currentTarget.name in errors) {
        return setErrors(omit(errors, [currentTarget.name]));
      }
    }

    if (!result.success) {
      setErrors({
        ...errors,
        [currentTarget.name]: result.errors,
      });
    }
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    if (!("name" in currentTarget))
      throw new Error("No name in the current target");

    validateChange(currentTarget);
    setInputs({
      ...inputs,
      [currentTarget.name]: currentTarget.value,
    });
  };

  const formToFieldErrors = (formErrors: Error[]) => {
    const fieldErrors: { [key: string]: Error[] } = {};
    for (const error of formErrors) {
      const field = error.path[0];
      if (field in fieldErrors) {
        fieldErrors[field].push(error);
      } else {
        fieldErrors[field] = [error];
      }
    }
    return fieldErrors;
  };

  const validateSubmit = () => {
    const { success, errors } = validate(inputs, formParser);
    const nextErrors = formToFieldErrors(errors || []);
    setErrors(nextErrors);
    return success;
  };

  const handleSubmit = async (event?: any) => {
    if (event) {
      event.preventDefault();
    }

    if (validateSubmit()) {
      await doSubmit(inputs);
    }
  };
  const handleToggle = (name: string) => {
    const newValue = inputs[name] ? false : true;
    setInputs({ ...inputs, [name]: newValue });
  };
  const getBasicBasics = (name: string) => {
    const value = inputs[name];
    const [type, optional] = ["text", false];
    return { value, type, optional };
  };
  const getInputBasics = (name: string) => {
    const inputBasics = getBasicBasics(name);
    const error = errors[name];
    return { name, error, ...inputBasics, onChange: handleChange };
  };

  return {
    handleSubmit,
    handleChange,
    handleToggle,
    inputs,
    errors,
    setInputs,
    getInputBasics,
    validateSubmit,
  };
};
export default useForm;
