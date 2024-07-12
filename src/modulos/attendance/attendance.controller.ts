import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from 'src/dto/Attendance/CreateAttendance.dto';
import { DateRangeDto } from 'src/dto/clientDto/DateRangeDto.dto';

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

    @Get('/getBySearch/:search')
    async findNamePhone(@Param('search') search: string) {
      return await this.serviceAttendance.getAllAttendancesOfClient(search);
    }

    @Put('/update/:id')
    async update(@Param('id') id: number, @Body() updateAttendanceDto: CreateAttendanceDto) {
        return await this.serviceAttendance.updateAttendance(id, updateAttendanceDto);
    }

    @Delete('/delete/:id')
    async remove(@Param('id') id: number) {
      return await this.serviceAttendance.deleteAttendance(id);
    }

    @Get("/getAttendanceByDateRange")
    async getAttendanceByDateRange(@Body() request: DateRangeDto) {
      return await this.serviceAttendance.getAttendanceByDateRange(request);
    }

}
