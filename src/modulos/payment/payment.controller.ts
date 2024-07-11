import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';
import { RepairPaymentDto } from 'src/dto/paymentDto/RepairPayment.dto';
import { CreateCartDto } from 'src/dto/Cart/CreateCart.dto';

@Controller('api/payment')
export class PaymentController {
    constructor(private servicePayment: PaymentService){}

    @Post()
    async createPayment(@Body()request: CreatePaymentDto) {
       return await this.servicePayment.createPayment(request);
      }
      @Post('/repairPayment')
      async RepairPayment(@Body()request: RepairPaymentDto) {
         return await this.servicePayment.RepairPayment(request);
        }

        @Post('/insertCart')
      async InsertCart(@Body()request: CreateCartDto) {
         return await this.servicePayment.InserCart(request);
        }

    @Get('/all')
    async findAll() {
      return await this.servicePayment.findAllPayments();
    }

    @Get('/getById/:id')
    async findOne(@Param('id') id: number) {
      return await this.servicePayment.findPaymentById(id);
    }

    @Get('/user/:code')
    async getPaymentsByUserCode(@Param('code') code: number) {
      return this.servicePayment.findAllByUserCode(code);
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
