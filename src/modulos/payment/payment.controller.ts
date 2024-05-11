import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';

@Controller('api/payment')
export class PaymentController {
    constructor(private servicePayment: PaymentService){}

    @Post()
    async createPayment(@Body()request: CreatePaymentDto) {
       return await this.servicePayment.createPayment(request);
      }
}
