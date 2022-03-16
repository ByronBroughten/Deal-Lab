import { RegisterFormData } from "../User/crudTypes";
import { Obj } from "../utils/Obj";
import Analyzer from "./../Analyzer";

// function useRegisterForm() {
//   const { analyzer, handleChange } = useAnalyzerContext();
//   const loginForm = analyzer.section("register");
//   const emailVarb = loginForm.varb("email");
//   const passwordVarb = loginForm.varb("password");
//   const userNameVarb = loginForm.varb("userName");

//   return {
//     email: {
//       name: emailVarb.stringFeVarbInfo,
//       value: emailVarb.value("string"),
//     },
//     password: {
//       name: passwordVarb.stringFeVarbInfo,
//       value: passwordVarb.value("string"),
//     },
//     userName: {
//       name: userNameVarb.stringFeVarbInfo,
//       value: userNameVarb.value("string"),
//     },
//     handleChange,
//   };
// }

// export const req = {
//   register(analyzer: Analyzer, registerFormData: RegisterFormData) {

//     const varbs = analyzer.section("register").varbs;
//     Obj.keys(varbs).reduce((registerFormData, varbName) => {
//       registerFormData[varbName as any as keyof RegisterFormData] = {
//         name: varbs[varbName].stringFeVarbInfo,
//         value: varbs[varbName].value("string")
//       }
//       return registerFormData;
//     }, {} as RegisterFormData)

//     for (const varbName of Obj.keys(registerForm.varbs)) {

//     }

//     return {
//       body: {
//         payload: {
//           registerFormData,
//           guestAccessSections: analyzer.dbEntryArrs("feGuestAccessStore"),
//         },
//       },
//     };
//   }
// }
