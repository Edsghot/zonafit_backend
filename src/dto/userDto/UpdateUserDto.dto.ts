export class UpdateUserDto {
    readonly IdUser: number;
    readonly UserName: string;
    readonly Password: string;
    readonly FirstName: string;
    readonly LastName: string;
    readonly PhoneNumber: string;
    readonly Dni: string;
    readonly RoleId: number;
    readonly Mail: string;
    readonly BirthDate: Date;
    readonly Image: string;
  }