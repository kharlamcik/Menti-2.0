import yup from "yup"

export const usernameValidator = yup
  .string()
  .required("Требуется имя пользователя")
  .min(4, "Имя пользователя не может быть короче 4 символов.")
  .max(20, "Имя пользователя не может превышать 20 символов.")

export const inviteCodeValidator = yup
  .string()
  .required("Требуется код приглашения")
  .length(6, "Неверный код приглашения")
