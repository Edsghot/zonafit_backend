export class CreatePaymentDto{

    idClient: number;

    idMembership: number;

    IdUser: number;
    
    StartDate: Date;

    EndDate: Date;

    Total: number;

    Discount: number;

    PriceDiscount: number;

    QuantityDays: number;

    DatePayment: Date;

    Due: number;

    PrePaid: number;

    PaymentType: string;

    PaymentReceipt: string;

    Observation: string;
}