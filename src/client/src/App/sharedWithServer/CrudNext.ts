import { LoginCrudSchema } from "./Crud/Login";
import { RegisterCrudSchema } from "./Crud/Register";

export type CrudNext = {
  nextRegister: RegisterCrudSchema;
  nextLogin: LoginCrudSchema;
  nextSection: {
    post: {
      req: {
        body: {
          payload: any;
        };
      };
      res: {
        data: string; // dbId
      };
    };
  };
};

export type NextReq<
  R extends keyof CrudNext,
  O extends keyof CrudNext[R]
> = CrudNext[R][O]["req" & keyof CrudNext[R][O]];

export type NextRes<
  R extends keyof CrudNext,
  O extends keyof CrudNext[R]
> = CrudNext[R][O]["res" & keyof CrudNext[R][O]];
