import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFreezingDayDto } from 'src/dto/freezingDayDto/CreateFreezingDay.dto';
import { PaymentEntity } from 'src/entity/Payment.entity';
import { FreezingDayEntity } from 'src/entity/freezingDay.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FreezingDayService {
    constructor(@InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(FreezingDayEntity)
    private readonly freezingDayRepository:Repository<FreezingDayEntity>) { }

    async createFreezingDay(request: CreateFreezingDayDto) {
        try {
          var freezingDay = new FreezingDayEntity();
          var res = await this.paymentRepository.findOne({ where: { PaymentId: request.idPayment } })
          if (!res) {
            return { msg: 'No se encontro el pago', success: false };
          }
          freezingDay.Payment = res;
          
          freezingDay.NumberOfDay = request.NumberOfDay;
          freezingDay.Frozen = request.Frozen;
          freezingDay.FrozenDate = request.FrozenDate;
          freezingDay.DateRegister=new Date();
          await this.freezingDayRepository.save(freezingDay);
          return { msg: 'se inserto correctamente', success: true };
        } catch (e) {
          return { msg: 'error al insertar', sucess: false, detailMsg: e.message };
        }
      }


      async findAllFreezingDay() {
        try {
          var freezingDay = await this.freezingDayRepository.find();
          return { msg: 'lista de congelados ', success: true, data: freezingDay };
        } catch (e) {
          return {
            msg: 'error al listar congelados',
            success: false,
            detailMsg: e,
            data: null,
          };
        }
      }

      async findFreezingDayById(id: number) {
        try {
          const freezingDay= await this.freezingDayRepository.findOne({ where: { IdFreezingDay: id }, relations:['Payment'] });
          if (!freezingDay) {
            throw new NotFoundException(`Congelamiento con ID ${id} no se encontro`);
          }
          return { msg: 'Congelamiento encontrado', success: true, data: freezingDay };
        } catch (error) {
          console.error('Fallo al obtener el congelamiento por ID:', error);
          return { msg: 'Fallo al obtener el congelamiento por ID', detailMsg: error, success: false };
        }
      }

      async updateFreezingDay(id: number, request: CreateFreezingDayDto) {
        try {
          const freezingDay = await this.freezingDayRepository.findOne({ where: { IdFreezingDay: id } });
          if (!freezingDay) {
            return { msg: 'No se encontro el congelamiento', success: false };
          }
          var res = await this.paymentRepository.findOne({ where: { PaymentId: request.idPayment } })
          if (!res) {
            return { msg: 'No se encontro el pago', success: false };
          }
          freezingDay.Payment = res;

          freezingDay.NumberOfDay = request.NumberOfDay;
          freezingDay.Frozen = request.Frozen;
          freezingDay.FrozenDate = request.FrozenDate;

          await this.freezingDayRepository.save(freezingDay);
    
          return {
            msg: 'Congelamiento actualizado correctamente',
            success: true,
            data: freezingDay,
          };
        } catch (error) {
          console.error('Fallo al actualizar el congelamiento:', error);
          return { msg: 'Fallo al actualizar el congelamiento', detailMsg: error, success: false };
        }
      }

      async deleteFreezingDay(id: number) {
        try {
          const freezingDay = await this.freezingDayRepository.delete(id);
          if (freezingDay.affected === 0) {
            throw new NotFoundException(`Congelamiento con ID ${id} no se encontro`);
          }
          return { msg: 'Congelamiento eliminado correctamente', success: true };
        } catch (error) {
          console.error('Fallo al eliminar el congelamiento:', error);
          return { msg: 'Fallo al eliminar el congelamiento', detailMsg: error, success: false };
        }
      }
}
