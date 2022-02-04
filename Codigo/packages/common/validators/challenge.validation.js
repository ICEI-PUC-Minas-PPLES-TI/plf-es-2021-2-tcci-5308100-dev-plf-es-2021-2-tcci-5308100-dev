// import * as yup from 'yup';
// export class BaseChallengeDTO {
//   constructor(params) {
//     Object.keys(this).forEach((param) => {
//       this[param] = params[param];
//     });
//   }
//   test: string;
// }
// export class CreateChallengeDTO extends BaseChallengeDTO {
//   constructor(params) {
//     super(params);
//     Object.keys(this).forEach((param) => {
//       this[param] = params[param];
//     });
//   }
//   testCreate: string;
// }
// export class UpdateChallengeDTO extends BaseChallengeDTO {
//   constructor(params) {
//     super(params);
//     Object.keys(this).forEach((param) => {
//       this[param] = params[param];
//     });
//   }
//   testUpdate: string;
// }
// const validatorBase = {};
// export const createChallengeValidator: (
//   body: any,
// ) => Promise<true | Error> = async (body) => {
//   const dto = new CreateChallengeDTO(body);
//   const validator = yup.object().shape({
//     ...validatorBase,
//   });
//   try {
//     await validator.validate(dto);
//     true;
//   } catch (error) {
//     return error;
//   }
// };
// export const updateChallengeValidator: (
//   body: any,
// ) => Promise<true | Error> = async (body) => {
//   const dto = new UpdateChallengeDTO(body);
//   const validator = yup.object().shape({
//     ...validatorBase,
//   });
//   try {
//     await validator.validate(dto);
//     true;
//   } catch (error) {
//     return error;
//   }
// };
