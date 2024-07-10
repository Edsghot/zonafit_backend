export class CreateVaucherDto {
    clientIdClient: number;  // Identificador del cliente
    Code: string;            // Código del voucher
    Amount: number;          // Monto del voucher
    ExpirationDate: Date;    // Fecha de expiración del voucher
    IsActive: boolean;       // Estado del voucher (activo o no)
    DateRegister: Date;      // Fecha de registro del voucher
  }
  