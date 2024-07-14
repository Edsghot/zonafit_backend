import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';
import { RepairPaymentDto } from 'src/dto/paymentDto/RepairPayment.dto';
import { CreateCartDto } from 'src/dto/Cart/CreateCart.dto';
import { DateRangeDto } from 'src/dto/clientDto/DateRangeDto.dto';

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

    @Get('/GetCount')
    async GetCount(){
      return await this.servicePayment.GetCount();
    }

    @Get('/getById/:id')
    async findOne(@Param('id') id: number) {
      return await this.servicePayment.findPaymentById(id);
    }

    @Get('/client/:search')
    async getPaymentsByUserCode(@Param('search') search: string) {
      return this.servicePayment.findAllByUserCode(search);
    }

    @Put('/update/:id')
    async update(@Param('id') id: number, @Body() updatePaymentDto: CreatePaymentDto) {
        return await this.servicePayment.updatePayment(id, updatePaymentDto);
    }

    @Delete('/delete/:id')
    async remove(@Param('id') id: number) {
      return await this.servicePayment.deletePayment(id);
    }

    @Get("/getPaymentByDateRange")
    async getPaymentByDateRange(@Body() request: DateRangeDto) {
      return await this.servicePayment.getPaymentByDateRange(request);
    }

    @Get("/getIncomeMembershipByDateRange")
    async getIncomeMembershipByDateRange(@Body() request: DateRangeDto) {
      return await this.servicePayment.getIncomeMembershipByDateRange(request);
    }

    
    @Get("/getIncomeProductByDateRange")
    async getIncomeProductByDateRange(@Body() request: DateRangeDto) {
      return await this.servicePayment.getIncomeProductByDateRange(request);
    }

    @Get("/getProductSoldByDateRange")
    async getProductSoldByDateRange(@Body() request: DateRangeDto) {
      return await this.servicePayment.getProductSoldByDateRange(request);
    }
}
