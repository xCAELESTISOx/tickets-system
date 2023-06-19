import { SignUpDTO } from '../../auth/dto/signUp.dto';

// Описание данных, которые необходимы для создания пользователя.
// Наследует все поля из класса SignUpDTO, который используется при авторизации
export class CreateUserDTO extends SignUpDTO {}
