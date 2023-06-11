export class SignInParams {
  /** Hashed password */
  password: string;
  email: string;
}

export class SignInDTO {
  token: string;
  role: string;
}
