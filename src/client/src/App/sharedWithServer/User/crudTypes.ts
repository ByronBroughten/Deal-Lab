import { z } from "zod";
import { SectionName, SectionNam } from "../Analyzer/SectionMetas/SectionName";
import { maxStringLength } from "../utils/validatorConstraints";
import { message, zNanoId } from "../utils/zod";
import { DbEntry, zDbEntry } from "../Analyzer/DbEntry";
import { LoginUser, zDbEntryArr } from "./DbUser";

export const authTokenKey = "x-auth-token";

// login
export const zLoginFormData = z.object({
  email: z.string().max(maxStringLength).email(message.email),
  password: z
    .string()
    .min(5, message.min(5))
    .max(maxStringLength, message.max(maxStringLength)),
});
export type LoginFormData = z.infer<typeof zLoginFormData>;

// register
export const zRegisterFormData = zLoginFormData.extend({
  userName: z.string().min(3, message.min(3)).max(50, message.max(50)),
});
export type RegisterFormData = z.infer<typeof zRegisterFormData>;
function makeZGuestAccessSections() {
  const sections: Partial<Record<SectionName<"feGuestAccessStore">, any>> = {};
  for (const sectionName of SectionNam.arr.feGuestAccessStore) {
    sections[sectionName] = zDbEntryArr;
  }
  return z.object(sections as Record<SectionName<"feGuestAccessStore">, any>);
}
export const zGuestAccessSections = makeZGuestAccessSections();
export type GuestAccessSections = Record<
  SectionName<"feGuestAccessStore">,
  DbEntry[]
>;
export type RegisterReqPayload = {
  registerFormData: RegisterFormData;
  guestAccessSections: Record<SectionName<"feGuestAccessStore">, DbEntry[]>;
};

// Logged in
export type LoggedInUser = { _id: string };
type LoggedInReq = {
  body: {
    user: LoggedInUser;
  };
};
export type LoggedIn<T extends any> = T & LoggedInReq;

type LoginHeaders = { [authTokenKey]: string };
export function isLoginHeaders(value: any): value is LoginHeaders {
  return typeof value === "object" && typeof value[authTokenKey] === "string";
}
type Crud = {
  Login: {
    Req: {
      body: { payload: LoginFormData };
    };
    Res: {
      data: LoginUser;
      headers: LoginHeaders;
    };
  };
  Register: {
    Req: {
      body: { payload: RegisterReqPayload };
    };
    Res: Crud["Login"]["Res"];
  };
  PostEntry: {
    Req: {
      body: {
        payload: DbEntry;
        dbStoreName: SectionName<"dbStore">;
      };
    };
    Res: {
      data: string; // dbId
    };
  };
  PostEntryArr: {
    Req: {
      body: {
        payload: DbEntry[];
        dbStoreName: SectionName<"dbStore">;
      };
    };
    Res: Crud["PostEntry"]["Res"];
  };
  PostTableColumns: {
    Req: {
      body: {
        payload: DbEntry[];
        dbStoreName: SectionName<"table">;
      };
    };
    Res: {
      data: DbEntry[]; // indexRowArr
    };
  };
  PutEntry: Crud["PostEntry"];
  GetEntry: {
    Req: {
      params: {
        dbStoreName: SectionName<"dbStore">;
        dbId: string;
      };
    };
    Res: {
      data: DbEntry;
    };
  };
  DeleteEntry: {
    Req: Crud["GetEntry"]["Req"];
    Res: {
      data: string; // dbId
    };
  };
};

export type Req<K extends keyof Crud> = Crud[K]["Req"];
export type Res<K extends keyof Crud> = Crud[K]["Res"];

export type DbId = string;
export const is = {
  dbId(value: any): value is DbId {
    return zNanoId.safeParse(value).success;
  },
  dbEntry(value: any): value is DbEntry {
    return zDbEntry.safeParse(value).success;
  },
  dbEntryArr(value: any): value is DbEntry[] {
    return zDbEntryArr.safeParse(value).success;
  },
};
