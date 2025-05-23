export const validateFields = (formData, isRegister = false) => {
  const { email, password, confirmPassword, firstName, lastName } = formData;
  const errors = {};

  if (!email) errors.email = "El email es requerido";
  if (!password) errors.password = "La contraseña es requerida";

  if (isRegister) {
    if (!firstName) errors.firstName = "El nombre es requerido";
    if (!lastName) errors.lastName = "El apellido es requerido";
    if (password !== confirmPassword) errors.confirmPassword = "Las contraseñas no coinciden";
  }

  return errors;
};