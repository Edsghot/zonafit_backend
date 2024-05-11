import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';
import { PaymentEntity } from 'src/entity/Payment.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { MembershipEntity } from 'src/entity/membership.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
    constructor( @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>){}

    async createPayment(request: CreatePaymentDto) {
        try {
          let payment = new PaymentEntity();
          var res = await this.clientRepository.findOne({where:{IdClient:request.idClient}})
          if(!res){
            return { msg: 'No se encontro el cliente', success: false };
          }
            payment.Client= res;
            var membership = await this.membershipRepository.findOne({where: {IdMembership:request.idMembership}})
            if(!membership){
                return { msg: 'No se encontro el membership', success: false };
              }
          payment.Membership = membership;
          var user = await this.userRepository.findOne({where:{IdUser:request.IdUser}})
          payment.User = user;
          payment.StartDate = request.StartDate;
          payment.EndDate = request.EndDate;
          payment.Total = request.Total;
          payment.Discount= request.Discount;
          payment.PriceDiscount= request.PriceDiscount;
          payment.QuantityDays= request.QuantityDays;
          payment.DatePayment= request.DatePayment;
          payment.Due= request.Due;
          payment.PrePaid= request.PrePaid;
          payment.PaymentType= request.PaymentType;
          payment.PaymentReceipt= request.PaymentReceipt;
          payment.Observation= request.Observation;
          await this.paymentRepository.save(payment);

          return { msg: 'se inserto correctamente', success: true };
        } catch (e) {
          return { msg: 'error al insertar', sucess: false, detailMsg: e };
        }
      }
}
