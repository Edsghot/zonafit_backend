import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';
import { PaymentEntity } from 'src/entity/Payment.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { MembershipEntity } from 'src/entity/membership.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>) { }

  async createPayment(request: CreatePaymentDto) {
    try {
      let payment = new PaymentEntity();
      var res = await this.clientRepository.findOne({ where: { IdClient: request.idClient } })
      if (!res) {
        return { msg: 'No se encontro el cliente', success: false };
      }
      payment.Client = res;
      var membership = await this.membershipRepository.findOne({ where: { IdMembership: request.idMembership } })
      if (!membership) {
        return { msg: 'No se encontro el membership', success: false };
      }
      payment.Membership = membership;
      var user = await this.userRepository.findOne({ where: { IdUser: request.IdUser } })
      payment.User = user;
      payment.StartDate = request.StartDate;
      payment.EndDate = request.EndDate;
      payment.Total = request.Total;
      payment.Discount = request.Discount;
      payment.PriceDiscount = request.PriceDiscount;
      payment.QuantityDays = request.QuantityDays;
      payment.DatePayment = request.DatePayment;
      payment.Due = request.Due;
      payment.PrePaid = request.PrePaid;
      payment.PaymentType = request.PaymentType;
      payment.PaymentReceipt = request.PaymentReceipt;
      payment.Observation = request.Observation;
      await this.paymentRepository.save(payment);

      return { msg: 'se inserto correctamente', success: true };
    } catch (e) {
      return { msg: 'error al insertar', sucess: false, detailMsg: e };
    }
  }

  async findAllPayments() {
    try {
      var payment = await this.paymentRepository.find();
      return { msg: 'lista de pagos ', success: true, data: payment };
    } catch (e) {
      return {
        msg: 'error al listar pagos',
        success: false,
        detailMsg: e,
        data: null,
      };
    }
  }

  async findPaymentById(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({ where: { PaymentId: id }, relations:['Client','Membreship','User'] });
      if (!payment) {
        throw new NotFoundException(`Pago con ID ${id} no se encontro`);
      }
      return { msg: 'Pago encontrado', success: true, data: payment };
    } catch (error) {
      console.error('Fallo al obtener el pago por ID:', error);
      return { msg: 'Fallo al obtener el pago por ID', detailMsg: error, success: false };
    }
  }

  async findAllByUserCode(userCode: number) {
    const user = await this.userRepository.findOne({ where: { Code: userCode } });
    if (!user) {
      return {
        msg: 'No se encontro el user',
        success: false,
        data: null,
      };
    }

    var data = this.paymentRepository.find({
      where: { User: user },
      relations: ['Client', 'Membership', 'User'],
    });

    return {
      msg: 'Pago actualizado correctamente',
      success: true,
      data: data,
    };
  }

  async updatePayment(id: number, request: CreatePaymentDto) {
    try {
      const payment = await this.paymentRepository.findOne({ where: { PaymentId: id } });
      if (!payment) {
        return { msg: 'No se encontro el pago', success: false };
      }
      var res = await this.clientRepository.findOne({ where: { IdClient: request.idClient } })
      if (!res) {
        return { msg: 'No se encontro el cliente', success: false };
      }
      payment.Client = res;
      var membership = await this.membershipRepository.findOne({ where: { IdMembership: request.idMembership } })
      if (!membership) {
        return { msg: 'No se encontro el membership', success: false };
      }
      payment.Membership=membership;
      var user = await this.userRepository.findOne({ where: { IdUser: request.IdUser } })
      if(!user){
        return{msg:"No se encontro el usuario", success:false};
      }
      payment.User = user;
      payment.StartDate = request.StartDate;
      payment.EndDate = request.EndDate;
      payment.Total = request.Total;
      payment.Discount = request.Discount;
      payment.PriceDiscount = request.PriceDiscount;
      payment.QuantityDays = request.QuantityDays;
      payment.DatePayment = request.DatePayment;
      payment.Due = request.Due;
      payment.PrePaid = request.PrePaid;
      payment.PaymentType = request.PaymentType;
      payment.PaymentReceipt = request.PaymentReceipt;
      payment.Observation = request.Observation;
      await this.paymentRepository.save(payment);

      return {
        msg: 'Pago actualizado correctamente',
        success: true,
        data: payment,
      };
    } catch (error) {
      console.error('Fallo al actualizar el pago:', error);
      return { msg: 'Fallo al actualizar el pago', detailMsg: error, success: false };
    }
  }


  async deletePayment(id: number) {
    try {
      const result = await this.paymentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Pago con ID ${id} no se encontro`);
      }
      return { msg: 'Pago eliminado correctamente', success: true };
    } catch (error) {
      console.error('Fallo al eliminar el pago:', error);
      return { msg: 'Fallo al eliminar el pago', detailMsg: error, success: false };
    }
  }
}
