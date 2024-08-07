import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFreezingDayDto } from 'src/dto/freezingDayDto/CreateFreezingDay.dto';
import { PaymentEntity } from 'src/entity/Payment.entity';
import { FreezingDayEntity } from 'src/entity/freezingDay.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';

@Injectable()
export class FreezingDayService {
    constructor(@InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(FreezingDayEntity)
    private readonly freezingDayRepository:Repository<FreezingDayEntity>) { }

    async createFreezingDay(request: CreateFreezingDayDto) {
      try {
        // Buscar el pago asociado al IdPayment
        const payment = await this.paymentRepository.findOne({ where: { PaymentId: request.IdPayment } });
    
        if (!payment) {
          return { msg: 'No se encontró el pago', success: false };
        }

        if(payment.QuantityDays <= request.NumberOfDay){
           payment.QuantityDays += request.NumberOfDay -payment.QuantityDays;
        }
    
        // Crear una nueva instancia de FreezingDayEntity
        const freezingDay = new FreezingDayEntity();
        freezingDay.Payment = payment;
        freezingDay.NumberOfDay = request.NumberOfDay;
        freezingDay.Frozen = request.Frozen;
        freezingDay.FrozenDate = request.FrozenDate;
        freezingDay.DateRegister = moment.tz('America/Lima').toDate(); // Fecha actual en Lima
    
        // Guardar el objeto FreezingDayEntity en la base de datos
        await this.freezingDayRepository.save(freezingDay);
    
        return { msg: 'Se insertó correctamente', success: true };
      } catch (e) {
        return { msg: 'Error al insertar', success: false, detailMsg: e.message };
      }
    }


      async findAllFreezingDay() {
        try {
          var freezingDay = await this.freezingDayRepository.find();
          return { msg: 'Lista de congelados ', success: true, data: freezingDay };
        } catch (e) {
          return {
            msg: 'Error al listar congelados',
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
          var res = await this.paymentRepository.findOne({ where: { PaymentId: request.IdPayment } })
          if (!res) {
            return { msg: 'No se encontro el pago', success: false };
          }
          freezingDay.Payment[0] = res;

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
