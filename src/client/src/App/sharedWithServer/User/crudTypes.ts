import { z } from "zod";
import { SectionName, SectionNam } from "../Analyzer/SectionMetas/SectionName";
import { dbLimits } from "../utils/dbLimts";
import { message, zNanoId } from "../utils/zod";
import { DbEntry, zDbEntry } from "../Analyzer/DbEntry";
import { LoginUser, zDbEntryArr } from "./DbUser";
import { config } from "../../Constants";

export const authTokenKey = "x-auth-token";

// login
export const zLoginFormData = z.object({
  email: z.string().max(dbLimits.string.maxLength).email(message.email),
  password: z
    .string()
    .max(dbLimits.password.maxLength, message.max(dbLimits.password.maxLength)),
  // no minimum password length for logging in, so that people
  // don't get locked out if we change the minimum
});
// eventually replace this interface with one derived from baseSections
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

type ArrToParams<
  A extends readonly string[],
  B extends { [Prop in A[number]]: string }
> = B;

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
  PostSectionArr: {
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
  GetSection: {
    Req: {
      params: ArrToParams<
        typeof config.url.section.params.get,
        {
          dbStoreName: SectionName<"dbStore">;
          dbId: string;
        }
      >;
    };
    Res: {
      data: DbEntry;
    };
  };
  DeleteSection: {
    Req: {
      params: ArrToParams<
        typeof config.url.section.params.delete,
        {
          dbStoreName: SectionName<"dbStore">;
          dbId: string;
        }
      >;
    };
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
