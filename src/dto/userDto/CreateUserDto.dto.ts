export class CreateUserDto {
    readonly UserName: string;
    readonly Password: string;
    readonly FirstName: string;
    readonly LastName: string;
    readonly PhoneNumber: string;
    readonly Dni: string;
    readonly Access: boolean;
    readonly RoleId: number;
    readonly Mail: string;
    readonly BirthDate: Date;
    readonly Image: string;
  }
