import { StrictOmit } from "../../../../client/src/App/sharedWithServer/utils/types";
import { DbSectionBase, DbSectionProps } from "./Bases/DbSectionBase";
import { DbSections } from "./DbSections";

interface DbUserProps
  extends StrictOmit<DbSectionProps<"user">, "sectionName"> {}
class DbUser extends DbSectionBase<"user"> {
  constructor(props: DbUserProps) {
    super({ ...props, sectionName: "user" });
  }
  get dbSections() {
    return new DbSections(this.dbSectionsProps);
  }
  get serverOnlyUser() {
    return this.dbSections.oneAndOnly("serverOnlyUser");
  }
  

  // getUserEncryptedPassword(user: UserDbRaw): string {
  //   const dbUser = ServerUser.init(user);
  //   const userSection = dbUser.firstSectionPackHeadSection("serverOnlyUser");

  //   // I can query get the first varb. I don't need
  //   // to query anything else.

  //   const { encryptedPassword } = userSection.dbVarbs;
  //   if (encryptedPassword === undefined) {
  //     throw new Error("There is no encrypted password");
  //   }
  //   return encryptedPassword as string;
  // }

  // private validatePassword({
  //   attemptedPassword,
  //   encryptedPassword,
  //   res,
  // }: ValidatePasswordProps) {
  //   const isValidPw = await bcrypt.compare(
  //     attemptedPassword,
  //     encryptedPassword
  //   );
  //   if (!isValidPw) {
  //     res.status(400).send("Invalid password.");
  //     throw new ResHandledError("handled in validatePassword");
  //   }
  // }
}

type ValidatePasswordProps = {
  attemptedPassword: string;
  encryptedPassword: string;
  res: Response;
};
