import {
  required,
  email,
  sameAs,
  minLength,
  helpers
} from "vuelidate/lib/validators";
import IDValidator from "id-validator";

var Validator = new IDValidator();

const idcard = value => {
  return !helpers.req(value) || Validator.isValid(value);
};

export { required, email, sameAs, minLength, idcard };
