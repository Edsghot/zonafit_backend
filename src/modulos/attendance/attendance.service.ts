import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAttendanceDto } from 'src/dto/Attendance/CreateAttendance.dto';
import { AttendanceEntity } from 'src/entity/attendance.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceService {
    constructor(@InjectRepository(AttendanceEntity)
    private readonly attendanceRepository: Repository<AttendanceEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository:Repository<ClientEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository:Repository<UserEntity>) { }

    async createAttendance(request: CreateAttendanceDto) {
        try {
          var attendance = new AttendanceEntity();
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
          
          attendance.AttendanceDate=new Date();
          await this.attendanceRepository.save(attendance);
          return { msg: 'se inserto correctamente', success: true };
        } catch (e) {
          return { msg: 'error al insertar', sucess: false, detailMsg: e.message };
        }
      }

      async findAllAttendance() {
        try {
          var attendance = await this.attendanceRepository.find();
          return { msg: 'lista de asistencia ', success: true, data: attendance };
        } catch (e) {
          return {
            msg: 'error al listar asistencia',
            success: false,
            detailMsg: e.message,
            data: null,
          };
        }
      }

      async findAllByCode(code:string) {
        try {
          const attendance = await this.attendanceRepository.query("SELECT * FROM Attendance INNER join Client on Attendance.IdClient = Client.IdClient INNER join User on Attendance.IdUser = User.IdUser where Client.Code = "+code);
      
          if (!attendance) {
            return {msg:"Asistencias con codigo "+code+" no se encontro"};
          }
          return { msg: 'Asistencias encontradas', success: true, data: attendance };
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
}
