import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from 'src/dto/Attendance/CreateAttendance.dto';

@Controller('/api/attendance')
export class AttendanceController {

    constructor(private serviceAttendance: AttendanceService){}

    @Post()
    async createAttendance(@Body()request: CreateAttendanceDto) {
       return await this.serviceAttendance.createAttendance(request);
      }

    @Get('/all')
    async findAll() {
      return await this.serviceAttendance.findAllAttendance();
    }

    @Get('/allByDni/:Dni')
    async findAllByDni(@Param('Dni') Dni:string){
        return await this.serviceAttendance.findAllByDni(Dni);
    }

    @Get('/allByCode/:Code')
    async findAllByCode(@Param('Code') Code:string){
        return await this.serviceAttendance.findAllByCode(Code);
    }

    @Get('/getById/:id')
    async findOne(@Param('id') id: number) {
      return await this.serviceAttendance.findAttendanceById(id);
    }

    @Put('/update/:id')
    async update(@Param('id') id: number, @Body() updateAttendanceDto: CreateAttendanceDto) {
        return await this.serviceAttendance.updateAttendance(id, updateAttendanceDto);
    }

    @Delete('/delete/:id')
    async remove(@Param('id') id: number) {
      return await this.serviceAttendance.deleteAttendance(id);
    }
}
