import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';
import { RepairPaymentDto } from 'src/dto/paymentDto/RepairPayment.dto';
import { CreateCartDto } from 'src/dto/Cart/CreateCart.dto';
import { DateRangeDto } from 'src/dto/clientDto/DateRangeDto.dto';
import { UpdatePaymentDto } from 'src/dto/paymentDto/UpdatePayment.dto';
import { CreateClasesDto } from 'src/dto/paymentDto/createClases.dto';

@Controller('api/payment')
export class PaymentController {
  constructor(private servicePayment: PaymentService) { }

  @Post()
  async createPayment(@Body() request: CreatePaymentDto) {
    return await this.servicePayment.createPayment(request);
  }
  
  @Post('/createClase')
  async createClase(@Body() request: CreateClasesDto) {
    return await this.servicePayment.createClases(request);
  }

  @Post('/repairPayment')
  async RepairPayment(@Body() request: RepairPaymentDto) {
    return await this.servicePayment.RepairPayment(request);
  }

  @Post('/insertCart')
  async InsertCart(@Body() request: CreateCartDto) {
    return await this.servicePayment.InserCart(request);
  }

  @Get('/all')
  async findAll() {
    return await this.servicePayment.findAllPayments();
  }

  @Post('/paymentProduct')
  async paymentProduct(@Body() request: DateRangeDto) {
    return await this.servicePayment.DetailProduct(request);
  }

  @Get('/GetCount')
  async GetCount() {
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

  @Put('/update')
  async update(@Body() updatePaymentDto: UpdatePaymentDto) {
    return await this.servicePayment.updatePayment(updatePaymentDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: number) {
    return await this.servicePayment.deletePayment(id);
  }

  @Post("/getPaymentByDateRange")
  async getPaymentByDateRange(@Body() request: DateRangeDto) {
    return await this.servicePayment.getPaymentByDateRange(request);
  }

  @Post("/getIncomeMembershipByDateRange")
  async getIncomeMembershipByDateRange(@Body() request: DateRangeDto) {
    return await this.servicePayment.getIncomeMembershipByDateRange(request);
  }


  @Post("/getIncomeProductByDateRange")
  async getIncomeProductByDateRange(@Body() request: DateRangeDto) {
    return await this.servicePayment.getIncomeProductByDateRange(request);
  }

  @Post("/getProductSoldByDateRange")
  async getProductSoldByDateRange(@Body() request: DateRangeDto) {
    return await this.servicePayment.getProductSoldByDateRange(request);
  }
}
