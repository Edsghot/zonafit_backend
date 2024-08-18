import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAttendanceDto } from 'src/dto/Attendance/CreateAttendance.dto';
import { DateRangeDto } from 'src/dto/clientDto/DateRangeDto.dto';
import { AttendanceEntity } from 'src/entity/attendance.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Between, MoreThan, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { PaymentEntity } from 'src/entity/Payment.entity';

@Injectable()
export class AttendanceService {
    constructor(@InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository:Repository<ClientEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository:Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository:Repository<UserEntity>) { }

    private isSameDay(date1: Date, date2: Date): boolean {
      return date1.getFullYear() === date2.getFullYear() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getDate() === date2.getDate();
    }

    async createAttendance(request: CreateAttendanceDto) {
        try {
          var attendance = new AttendanceEntity();
          const client = await this.clientRepository.findOne({where:{Code: request.Identificador}})
          if (!client) {
            return { msg: 'No se encontro el cliente', success: false };
          }
          attendance.Client=client;
          var user=await this.userRepository.findOne({where:{IdUser:request.idUser}})
          if (!user) {
            return { msg: 'No se encontro el usuario', success: false };
          }
          attendance.User = user;
          
          attendance.AttendanceDate= moment.tz('America/Lima').toDate();

          const todaya = moment.tz('America/Lima').toDate();

          // Formatear la fecha manualmente en formato 'YYYY-MM-DD'
          const year = todaya.getFullYear();
          const month = String(todaya.getMonth() + 1).padStart(2, '0'); // Los meses son 0 indexados, por lo que se añade +1
          const day = String(todaya.getDate()).padStart(2, '0');

          const today = `${year}-${month}-${day}`; // Obtener la fecha de hoy en formato 'YYYY-MM-DD'

          // Ajuste en la consulta SQL
          var attendace = await this.attendanceRepository.query(`
              SELECT * FROM Attendance 
              WHERE IdClient = ${client.IdClient}
              AND DATE(AttendanceDate) = '${today}';
          `);
        
          if (attendace.length > 0) {
            return { msg: 'El dia de hoy ya se registro', success: false};
        }

          const payment = await this.paymentRepository.query("SELECT * FROM Payment where clientIdClient = "+client.IdClient)

          if (!payment) {
            return { msg: "No se encontró el pago de la membresía, por favor intente de nuevo.", success: false };
          }

          if(payment.QuantityDays <= 0){
            return {msg:"Ya no tiene mas dias, renueve su membresia", success:false}
          }

          payment.QuantityDays -= 1;

          await this.paymentRepository.save(payment);


          await this.attendanceRepository.save(attendance);
          return { msg: 'Se inserto correctamente', success: true };
        } catch (e) {
          return { msg: 'Error al insertar', success: false, detailMsg: e.message };
        }
      }

      async deductDaysForAbsentees() {
        const Payments = await this.paymentRepository.find({
          where: {
              QuantityDays: MoreThan(0)
          }
      });
    
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
        for (const payment of Payments) {
          var client = await this.clientRepository.findOne({where:{Payment: payment}})
          const attendance = await this.attendanceRepository.findOne({
            where: {
              Client:client,
              AttendanceDate: Between(startOfDay, endOfDay),
            },
          });
    
          if (!attendance && payment.QuantityDays > 0) {
            payment.QuantityDays -= 1;
            await this.paymentRepository.save(payment);
          }
        }
      }

      async findAllAttendance() {
        try {
          var attendance = await this.attendanceRepository.find();
          return { msg: 'Lista de asistencia ', success: true, data: attendance };
        } catch (e) {
          return {
            msg: 'Error al listar asistencia',
            success: false,
            detailMsg: e.message,
            data: null,
          };
        }
      }

      createDateWithoutTime(date: Date): Date {
        const year = date.getFullYear();
        const month = date.getMonth(); // Recuerda que los meses son indexados desde 0 (Enero es 0, Febrero es 1, etc.)
        const day = date.getDate();
        return new Date(year, month, day);
      }

      async  getAllAttendancesOfClient(searchTerm: string){
    
        let searchCondition: any = {};

    if (/^\d{4}$/.test(searchTerm)) {
      searchCondition = { Code: Number(searchTerm) };
    } else if (/^\d+$/.test(searchTerm)) {
      searchCondition = { PhoneNumber: searchTerm };
    } else {
      searchCondition = [{ FirstName: searchTerm },{ LastName: searchTerm }];
    }

    const client = await this.clientRepository.findOne({
      where: searchCondition
    });
    
        if (!client) {
            return { msg:`Cliente con término de búsqueda "${searchTerm}" no encontrado.`, success: false, data: null };
        }
    
        // Obtener todas las asistencias del cliente encontrado
        const attendances = await this.attendanceRepository.find({
            where: {Client: client}// Incluir las relaciones para obtener los objetos relacionados completos
        });
    
        return { msg:"Asistencias encontradas", success: true, data: attendances };
    }

      async findAllByCode(code:number) {
        try {
          const client = await this.clientRepository.findOne({where:{Code: code}})

          if(!client){
            return {msg:"Cliente no encontrado",success: false}
          }
          const attendance = await this.attendanceRepository.query("select * from Attendance INNER join Client on Attendance.IdClient = Client.IdClient INNER join User on Attendance.IdUser = User.IdUser where Client.Code = "+client.Code);
      
          if (!attendance || attendance.length == 0) {
            return {msg:"Asistencias con codigo "+code+" no se encontro", success: false};
          }
          
          return { msg: 'Asistencias encontradas', success: true, data: attendance,dataClient: client};
        } catch (error) {
          console.error('Fallo al obtener el asistencias por codigo:', error);
          return { msg: 'Fallo al obtener el asistencias por codigo', detailMsg: error.message, success: false };
        }
      }

      async findAllByDni(dni: string) {
        try {
          const attendance = await this.attendanceRepository.query("SELECT * FROM Attendance INNER join Client on Attendance.IdClient = Client.IdClient INNER join User on Attendance.IdUser = User.IdUser where Client.Document = "+dni);
      
          if (!attendance.length) {
            return {msg:"Asistencias con codigo "+dni+" no se encontro"};
          }
      
          return { msg: 'Asistencias encontradas', success: true, data: attendance };
        } catch (error) {
          console.error('Fallo al obtener las asistencias por DNI:', error);
          return { msg: 'Fallo al obtener las asistencias por DNI', detailMsg: error.message, success: false };
        }
      }
      

      async findAttendanceById(id: number) {
        try {
          const attendance= await this.attendanceRepository.findOne({ where: { IdAttendance: id }, relations:['Client','User'] });
          if (!attendance) {
            return {msg:`Asistencia con ID ${id} no se encontro`};
          }
          return { msg: 'Asistencia encontrado', success: true, data: attendance };
        } catch (error) {
          console.error('Fallo al obtener el asistencia por ID:', error);
          return { msg: 'Fallo al obtener el asistencia por ID', detailMsg: error.message, success: false };
        }
      }

      async updateAttendance(id: number, request: CreateAttendanceDto) {
        try {
          const attendance = await this.attendanceRepository.findOne({ where: { IdAttendance: id } });
          if (!attendance) {
            return { msg: 'No se encontro el asistencia', success: false };
          }
          const client = await this.clientRepository.createQueryBuilder('client')
            .where('client.Document = :document', { document: request.Identificador })
            .orWhere('client.Code = :code', { code: request.Identificador })
            .getOne();
          if (!client) {
            return { msg: 'No se encontro el cliente', success: false };
          }
          attendance.Client=client;
          var user=await this.userRepository.findOne({where:{IdUser:request.idUser}})
          if (!user) {
            return { msg: 'No se encontro el usuario', success: false };
          }
          attendance.User = user;

          await this.attendanceRepository.save(attendance);
    
          return {
            msg: 'Asistencia actualizado correctamente',
            success: true,
            data: attendance,
          };
        } catch (error) {
          console.error('Fallo al actualizar el asistencia:', error);
          return { msg: 'Fallo al actualizar el asistencia', detailMsg: error.message, success: false };
        }
      }

      async deleteAttendance(id: number) {
        try {
          const attendance = await this.attendanceRepository.delete(id);
          if (attendance.affected === 0) {
            return {msg:`Asistencia con ID ${id} no se encontro`};
          }
          return { msg: 'Asistencia eliminado correctamente', success: true };
        } catch (error) {
          console.error('Fallo al eliminar el asistencia:', error);
          return { msg: 'Fallo al eliminar el asistencia', detailMsg: error.message, success: false };
        }
      }

      async getAttendanceByDateRange(request:DateRangeDto){
        try{
          const data = await this.attendanceRepository.query(
              `CALL getAttendanceByDateRange('${request.StartDate}', '${request.EndDate}')`,
            );
            return {
              msg: 'Lista de asistencias completa',
              data: data[0],
              success: true,
            };
      }catch(error){
          console.error('Error al recuperar todas las asistencias:', error);
          return {
              msg: 'Error al recuperar todas las asistencias',
              detailMsg: error.message,
              success: false,
        };
      }
      }
}
