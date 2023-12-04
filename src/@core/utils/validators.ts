// import { useLocales } from '@/stores/locales'
import { useUser } from '@/stores/user'
import moment from 'moment'
import { isEmpty, isEmptyArray, isNullOrUndefined } from './index'

// const { getTranslationT } = useLocales()
// const translate = getTranslationT()

const { get_users, store_user, check_user_email, check_user_email_prof, check_user_phone, check_user_cin, check_user_passport } = useUser()
const { check_email_prof, check_phone, check_email, check_phone_emergency , check_cin, check_passport, loading } = storeToRefs(useUser())

const checkIsLottie = files => {
  return new Promise(resolve => {
    const fileReader = new FileReader()

    fileReader.onload = () => {
      const json = JSON.parse(fileReader.result)
      if (json.hasOwnProperty('assets') && json.hasOwnProperty('layers'))
        resolve(true)

      else
        resolve('Invalid file type, only Lottie JSON files are allowed')
    }
    fileReader.readAsText(files[0])
  })
}

export const checkEmail = async (value: unknown) => {
  await check_user_email(value)

  if (check_email.value) {
    return 'email exist';
  }
}

export const checkEmailProf = async (value: unknown) => {
  await check_user_email_prof(value)

  if (check_email_prof.value) {
    return 'email exist';
  }
}

export const checkPhone = async (value: unknown) => {
  await check_user_phone(value)
  // console.log("test", value);

  if (check_phone.value) {
    return 'phone exist';
  }
}


export const checkPhoneEmergency = async (value: unknown) => {
  await check_user_phone(value)
  // console.log("test", value);

  if (check_phone_emergency.value) {
    return 'phone exist';
  }
}
export const checkCin = async (value: unknown) => {
  await check_user_cin(value)
  // console.log("test", value);

  if (check_cin.value) {
    return 'cin exist';
  }
}

export const checkPassport = async (value: unknown) => {
  await check_user_passport(value)
  // console.log("test", value);

  if (check_passport.value) {
    return 'passport exist';
  }
}

export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'validators.obligatory_field'

  return !!String(value).trim().length || 'validators.obligatory_field'
}

export const requiredSpace = (value: unknown) => {
  if (String(value).trim().includes(' '))
    return 'validators.the_variable_contains_a_space'
}

export const dateMaxValidator = (value: unknown) => {
  if (value != null) {
    const date_now = moment()
    const today = moment(date_now.format('YYYY-MM-DD'))
    const inputDate = moment(value, 'YYYY-MM-DD')

    // console.log(inputDate.isAfter(today))
    if (inputDate.isAfter(today))
      return 'validators.max_date_error'
  }

  return !!String(value).trim().length || 'validators.max_date_error'
}

// export const dateMinValidator = (value: unknown, date: string) => {
//   if (value != null) {
//     // const date_now = moment()
//     const min_date = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
//     const inputDate = moment(value, 'YYYY-MM-DD')

//     console.log(min_date)
//     console.log(inputDate)

//     // console.log(inputDate.isBefore(today))
//     if (inputDate.isBefore(min_date))
//       return 'validators.min_date_error'
//   }
//
//   return !!String(value).trim().length || 'validators.min_date_error'
// }

export const dateMin18Validator = (value: unknown) => {
  if (value != null) {
    const date_now = moment()
    const today = moment(date_now.format('YYYY-MM-DD'))
    const max_date = today.subtract(18, 'years').format('YYYY-MM-DD')

    const inputDate = moment(value, 'YYYY-MM-DD')

    if (inputDate.isAfter(max_date))
      return 'validators.min_date_error'
  }

  return !!String(value).trim().length || 'validators.min_date_error'
}

export const dateMin18Max100Validator = (value: unknown) => {
  if (value != null) {
    const date_now = moment()
    const today = moment(date_now.format('YYYY-MM-DD'))
    const min_date = moment(date_now.format('YYYY-MM-DD')).subtract(18, 'years').format('YYYY-MM-DD')
    const max_date = moment(date_now.format('YYYY-MM-DD')).subtract(100, 'years').format('YYYY-MM-DD')
    const inputDate = moment(value, 'YYYY-MM-DD')

    if (inputDate.isAfter(min_date) || inputDate.isBefore(max_date)) {
      return 'validators.date_range_error'
    }
  }

  return !!String(value).trim().length || 'validators.date_range_error'
}

export const dateMinNowMax100Validator = (value: unknown) => {
  if (value != null) {
    const date_now = moment()
    const min_date = moment(date_now.format('YYYY-MM-DD')).format('YYYY-MM-DD')
    const max_date = moment(date_now.format('YYYY-MM-DD')).subtract(100, 'years').format('YYYY-MM-DD')
    const inputDate = moment(value, 'YYYY-MM-DD')

    if (inputDate.isAfter(min_date) || inputDate.isBefore(max_date)) {
      return 'validators.date_range_error'
    }
  }

  return !!String(value).trim().length || 'validators.date_range_error'
}

export const dateIntegrationValidator = (value: unknown, dateOfBirth: string) => {
  if (value != null) {
    const date_now = moment();
    const min_date = moment(dateOfBirth, 'YYYY-MM-DD').add(18, 'years').format('YYYY-MM-DD');
    const max_date = moment(date_now).add(1, 'months').format('YYYY-MM-DD');
    const inputDate = moment(value, 'YYYY-MM-DD');

    if (inputDate.isAfter(min_date) && inputDate.isBefore(max_date)) {
      return true; // La date est valide
    } else {
      return 'validators.date_range_error';
    }
  }

  return !!String(value).trim().length || 'validators.date_range_error';
};

export const dateMax100Validator = (value: unknown, dateMin: string) => {
  if (value != null) {
    const date_now = moment()
    const min_date = moment(dateMin, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const max_date = moment(date_now.format('YYYY-MM-DD')).add(100, 'years').format('YYYY-MM-DD')
    const inputDate = moment(value, 'YYYY-MM-DD')

    // console.log("max date : ", max_date)
    // console.log("min date : ", min_date)
    // console.log("input date : ", inputDate)

    if (inputDate.isAfter(min_date) && inputDate.isBefore(max_date)) {
      return true; // La date est valide
    } else {
      return 'validators.date_range_error';
    }
  }

  return !!String(value).trim().length || 'validators.date_range_error'
}

export const dateBetweenValidator = (value: unknown, dateMin: string) => {
  if (value != null) {
    const date_now = moment();
    const min_date = moment(dateMin, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const max_date = moment(date_now).format('YYYY-MM-DD');
    const inputDate = moment(value, 'YYYY-MM-DD');

    // console.log("max date : ", max_date)
    // console.log("min date : ", min_date)
    // console.log("input date : ", inputDate)

    if (inputDate.isAfter(min_date) && inputDate.isBefore(max_date)) {
      return true; // La date est valide
    } else {
      return 'validators.date_range_error';
    }
  }

  return !!String(value).trim().length || 'validators.date_range_error';
};

export const dateStatusContractValidator = (value: unknown, dateMin: string) => {
  if (value != null) {
    const date_now = moment();
    const min_date = moment(dateMin, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const max_date = moment(date_now).format('YYYY-MM-DD');
    const inputDate = moment(value, 'YYYY-MM-DD');

    // console.log("max date : ", max_date)
    // console.log("min date : ", min_date)
    // console.log("input date : ", inputDate)

    if (inputDate.isSameOrAfter(min_date) && inputDate.isSameOrBefore(max_date)) {
      return true; // La date est valide
    } else {
      return 'validators.date_range_error';
    }
  }

  return !!String(value).trim().length || 'validators.date_range_error';
};

export const timeMaxValidator = (date: string, time: string) => {
  // console.log(time)

  if (date != null && time != null) {
    const today_date_time = moment()
    const time_now = moment(today_date_time.format('HH:mm'), 'HH:mm')
    const date_now = moment(today_date_time.format('YYYY-MM-DD'))

    const inputTime = moment(time, 'HH:mm')
    const inputDate = moment(date, 'YYYY-MM-DD')

    if (date_now.diff(inputDate) === 0) {
      if (inputTime.isBefore(time_now))
        return 'validators.the_call_back_time_must_be_greater_than_the_hour'
    }
  }

  return (!!String(time.hours).trim().length && !String(time.minutes).trim().length && !String(time.seconds).trim().length) || 'validators.the_call_back_time_must_be_greater_than_the_hour'
}

export const lengthValidator = (value: unknown, min: number, max: number) => {
  if (String(value).trim().length > min)
    return `validators.this_field_must_be_in_minimum ${min} validators.letters`
  if (String(value).trim().length < max)
    return `validators.this_field_must_be_in_maximum ${max} validators.letters`

  return !!String(value).trim().length || `validators.this_field_must_be_in_maximum ${max} validators.letters` || `validators.this_field_must_be_in_minimum ${min} validators.letters`
}
export const maxSizeDocs = (value: unknown, max: number) => {
  // if (parseInt(value) < max)
  //   return `La taille de l\'avatar doit Ãªtre infÃ©rieure Ã  ${max} Mo`

  // return !!value || `La taille de l\'avatar doit Ãªtre infÃ©rieure Ã  ${max} Mo`
}

export const LottieValidator = async (files: unknown) => {
  return await checkIsLottie(files)
}

// ðŸ‘‰ Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'validators.the_email_field_must_be_a_valid_email'

  return re.test(String(value)) || 'validators.the_email_field_must_be_a_valid_email'
}

// ðŸ‘‰ Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)

  return (validPassword || 'validators.field_must_contain_at_least_one_uppercase_lowercase_special_character_and_digit_with_min_8_chars')
}

// ðŸ‘‰ Confirm Password Validator
export const confirmedValidator = (value: string, target: string) => {
  value === target || 'validators.the_Confirm_Password_field_confirmation_does_not_match'
}

// ðŸ‘‰ Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value)
  // console.log(valueAsNumber)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `validators.enter_number_between ${min} common.and ${max}`
}

// ðŸ‘‰ Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  if (Array.isArray(value))
    return value.every(val => /^-?[0-9]+$/.test(String(val))) || 'validators.this_field_must_be_an_integer'

  return /^-?[0-9]+$/.test(String(value)) || 'validators.this_field_must_be_an_integer'
}

// ðŸ‘‰ Positive Validator
export const positiveValidator = (value: unknown) => {
  return Number(value) >= 0 || 'validators.this_field_must_be_a_positive_integer'
}

// ðŸ‘‰ Positive not null Validator
export const positiveNotNullValidator = (value: unknown) => {
  return Number(value) > 0 || 'validators.this_field_must_be_a_positive_integer'
}

// ðŸ‘‰ Regex Validator
export const regexValidator = (value: unknown, regex: RegExp | string): string | boolean => {
  if (isEmpty(value))
    return true

  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)

  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || 'validators.the_Regex_field_format_is_invalid'
}

// ðŸ‘‰ Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || 'validators.the_Alpha_field_may_only_contain_alphabetic_characters'
}

// ðŸ‘‰ URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/

  return re.test(String(value)) || 'validators.URL_is_invalid'
}

// ðŸ‘‰ Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const valueAsString = String(value)

  return /^[0-9A-Z_-]*$/i.test(valueAsString) || 'validators.all_Character_are_not_valid'
}

export const vueTelInputValidator = (countryInfo: unknown) => {
  // Utilise les informations de countryInfo pour valider le numéro
  if (countryInfo?.valid === false) {
    return 'Numero de telephone invalide !';
  }
  return '';  // Numéro de téléphone valide, renvoie une chaîne vide
}

export const validatePassportNumber = (value: string, carte_id: unknown, cin: unknown, delivery_date_cin: unknown, delivery_place_cin: unknown, nationality: unknown) => {
  if (nationality === 'Tunisienne') {
    return true;
  }
  // Le champ n'est pas valide
  return "Num passport required !";
}


// export const validatePassportNumber = (value: string , carte_id: unknown, cin: unknown ,delivery_date_cin: unknown,delivery_place_cin: unknown ) => {
//   const isRequired =
//     carte_id === null &&
//     cin === null &&
//     delivery_date_cin === null &&
//     delivery_place_cin === null;

//   const rules = [];
//   if (isRequired) {
//     rules.push('required');
//   }

//   rules.push(`min:8`);
//   rules.push(`max:8`);
//   rules.push('alpha_num');

//   const isValid = validateWithRules(value, rules);
//   console.log("isvalid : ", isValid)
//   return isValid;
// }

// // Cette fonction applique des règles de validation à une valeur
// export const validateWithRules = (value : unknown, rules :unknown) => {
//   // Parcours de toutes les règles
//   for (const rule of rules) {
//     // Divise la règle en parties (par exemple, 'min:8' devient ['min', '8'])
//     const [ruleName, ruleValue] = rule.split(':');

//     // Vérifie chaque type de règle
//     switch (ruleName) {
//       case 'required':
//         if (!value) {
//           return false; // Échoue la validation si la valeur est requise mais manquante
//         }
//         break;

//       case 'min':
//         if (value.length < ruleValue) {
//           return false; // Échoue la validation si la valeur est inférieure à la longueur minimale requise
//         }
//         break;

//       case 'max':
//         if (value.length > ruleValue) {
//           return false; // Échoue la validation si la valeur dépasse la longueur maximale requise
//         }
//         break;

//       case 'alpha_num':
//         if (!/^[a-zA-Z0-9]+$/.test(value)) {
//           return false; // Échoue la validation si la valeur ne contient pas uniquement des lettres et des chiffres
//         }
//         break;

//       default:
//         break;
//     }
//   }

//   return true; // Si la valeur passe toutes les règles, elle est considérée comme valide
// }



