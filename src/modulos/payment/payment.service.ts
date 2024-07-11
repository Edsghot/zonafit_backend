import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVaucherDto } from 'src/dto/Vaucher/CreateVaucher.dto';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';
import { RepairPaymentDto } from 'src/dto/paymentDto/RepairPayment.dto';
import { PaymentEntity } from 'src/entity/Payment.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { MembershipEntity } from 'src/entity/membership.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { VaucherService } from '../vaucher/vaucher.service';
import { CartEntity } from 'src/entity/Carrito.entity';
import { CreateCartDto } from 'src/dto/Cart/CreateCart.dto';
import { ProductEntity } from 'src/entity/product.entity';
import { FreezingDayEntity } from 'src/entity/freezingDay.entity';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(ProductEntity)
  private readonly productRepository: Repository<ProductEntity>,
@InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>,
  @InjectRepository(FreezingDayEntity)
  private readonly freezingRepository: Repository<FreezingDayEntity>,
    @InjectRepository(MembershipEntity)
    private readonly membershipRepository: Repository<MembershipEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>, private vaucherService: VaucherService) { }

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
      payment.DateRegister = new Date();
      await this.paymentRepository.save(payment);

      return { msg: 'se inserto correctamente', success: true };
    } catch (e) {
      return { msg: 'error al insertar', sucess: false, detailMsg: e };
    }
  }

  async RepairPayment(request: RepairPaymentDto){
    const { IdClient } = request;

    const client = await this.clientRepository.find({where: {IdClient: IdClient}});
    if (!client) {
      return { msg: 'No se encontro el cliente', success: false };
    }

    // Buscar el último pago del cliente
    const lastPayment = await this.paymentRepository.findOne({
      where: { Client: client },
      order: { DatePayment: 'DESC' }
    });

    if (!lastPayment) {
        return {msg: "no se encontro el payment", success: false}
    }

    if(lastPayment.Due == 0){
      return {msg: "No tiene deuda", success: false}
    }

    lastPayment.Due = lastPayment.Due - request.Amount;
    lastPayment.Total = lastPayment.Total + request.Amount;
  
    await this.paymentRepository.save(lastPayment);


    var vaucher = new CreateVaucherDto();
      vaucher.IdClient = request.IdClient;
      vaucher.Description = "Pagando la deuda de "+request.Amount;
      vaucher.Amount = request.Amount;

     var resVaucher = await this.vaucherService.createVoucher(vaucher);

     if(!resVaucher.success){
      return {msg:"Error al registrar el vaucher", success: false};
     }

    return {msg:'Exitoso',success:true};
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
        msg: 'No se encontró el usuario',
        success: false,
        data: null,
      };
    }

    const payments = await this.paymentRepository.find({
      where: { User: user },
      relations: ['Client', 'Membership', 'FreezingDay'],
    });
    const client = await this.clientRepository.findOne({ where: { Payment: payments } });
    const membership = await this.membershipRepository.findOne({ where: { Payment: payments } });
    const freezingDay = await this.freezingRepository.findOne({ where: { Payment: payments } });

    const formattedPayments = await Promise.all(payments.map(async (payment) => {

      return {
        PaymentId: payment.PaymentId,
        StartDate: payment.StartDate,
        EndDate: payment.EndDate,
        Total: payment.Total,
        Discount: payment.Discount,
        PriceDiscount: payment.PriceDiscount,
        QuantityDays: payment.QuantityDays,
        DatePayment: payment.DatePayment,
        Due: payment.Due,
        PrePaid: payment.PrePaid,
        PaymentType: payment.PaymentType,
        PaymentReceipt: payment.PaymentReceipt,
        Observation: payment.Observation,
        DateRegister: payment.DateRegister,
        Client: client ? {
          IdClient: client.IdClient,
          Code: client.Code,
          FirstName: client.FirstName,
          LastName: client.LastName,
          PhoneNumber: client.PhoneNumber,
          Document: client.Document,
          DocumentType: client.DocumentType,
          MaritalStatus: client.MaritalStatus,
          Gender: client.Gender,
          Address: client.Address,
          Whatsapp: client.Whatsapp,
          Mail: client.Mail,
          BirthDate: client.BirthDate,
          Note: client.Note,
          Image: client.Image,
          Created: client.Created,
        } : null,
        Membership: membership ? {
          IdMembership: membership.IdMembership,
          Name: membership.Name,
          // otros campos de Membership si es necesario
        } : null,
        FreezingDay: freezingDay ? {
          IdFreezingDay: freezingDay.IdFreezingDay,
          Date: freezingDay.FrozenDate,
          // otros campos de FreezingDay si es necesario
        } : null,
      };
    }));

    return {
      msg: 'Lista de pagos',
      success: true,
      data: formattedPayments,
      dataClient: client,
      dataMembership: membership,

    };
  }
  
  async InserCart(cartDto: CreateCartDto) {
    const { Price, Products, Stocks } = cartDto;

    const productEntities: ProductEntity[] = [];

    for (let i = 0; i < Products.length; i++) {
      const productId = Products[i];
      const stockToDeduct = Stocks[i];

      const product = await this.productRepository.findOne({where:{IdProduct:productId}});

      if (!product) {
        return {msg: `Product with ID ${productId} not found`,success: false}
      }

      if (product.Stock < stockToDeduct) {
        
        return {msg: `Not enough stock for product with ID ${productId}`,success: false}
      }

      product.Stock -= stockToDeduct;
      await this.productRepository.save(product);

      productEntities.push(product);
    }

    const newCart = new CartEntity();
    newCart.price = Price;
    newCart.products = productEntities;

    var data = await this.cartRepository.save(newCart);
    return {msg: `Se inserto correctamente`,success: true, data: data}
    
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
