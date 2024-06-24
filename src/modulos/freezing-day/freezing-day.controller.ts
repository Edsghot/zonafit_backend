import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FreezingDayService } from './freezing-day.service';
import { CreateFreezingDayDto } from 'src/dto/freezingDayDto/CreateFreezingDay.dto';

@Controller('api/freezing-day')
export class FreezingDayController {
    constructor(private serviceFreezingDay: FreezingDayService){}

    @Post()
    async createFreezingDay(@Body()request: CreateFreezingDayDto) {
       return await this.serviceFreezingDay.createFreezingDay(request);
      }

    @Get('/all')
    async findAll() {
      return await this.serviceFreezingDay.findAllFreezingDay();
    }

    @Get('/getById/:id')
    async findOne(@Param('id') id: number) {
      return await this.serviceFreezingDay.findFreezingDayById(id);
    }

    @Put('/update/:id')
    async update(@Param('id') id: number, @Body() updatePaymentDto: CreateFreezingDayDto) {
        return await this.serviceFreezingDay.updateFreezingDay(id, updatePaymentDto);
    }

    @Delete('/delete/:id')
    async remove(@Param('id') id: number) {
      return await this.serviceFreezingDay.deleteFreezingDay(id);
    }
}
