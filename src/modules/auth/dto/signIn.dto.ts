// Описание данных, необходимых для входа в систему
export class SignInParams {
  email: string; // логин
  password: string; // пароль
}

// Описание данных, возвращаемых при логине
export class SignInDTO {
  token: string; // Токен
  role: string; // Роль
}
