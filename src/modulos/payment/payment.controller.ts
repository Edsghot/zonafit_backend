import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';

@Controller('api/payment')
export class PaymentController {
    constructor(private servicePayment: PaymentService){}

    @Post()
    async createPayment(@Body()request: CreatePaymentDto) {
       return await this.servicePayment.createPayment(request);
      }

    @Get('/all')
    async findAll() {
      return await this.servicePayment.findAllPayments();
    }

    @Get('/getById/:id')
    async findOne(@Param('id') id: number) {
      return await this.servicePayment.findPaymentById(id);
    }

    @Put('/update/:id')
    async update(@Param('id') id: number, @Body() updatePaymentDto: CreatePaymentDto) {
        return await this.servicePayment.updatePayment(id, updatePaymentDto);
    }

    @Delete('/delete/:id')
    async remove(@Param('id') id: number) {
      return await this.servicePayment.deletePayment(id);
    }
}
