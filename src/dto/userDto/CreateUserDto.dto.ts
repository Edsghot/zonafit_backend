export class CreateUserDto {
    readonly code: string;
    readonly username: string;
    readonly password: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber: string;
    readonly dni: string;
    readonly access: boolean;
    readonly roleId: number;
    readonly email: string;
  }
