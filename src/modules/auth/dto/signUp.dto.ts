import { User } from '../../users/user.entity';

export class SignUpDTO implements Omit<User, 'id' | 'role'> {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
