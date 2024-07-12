import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVaucherDto } from 'src/dto/Vaucher/CreateVaucher.dto';
import { CreatePaymentDto } from 'src/dto/paymentDto/CreatePayment.dto';
import { RepairPaymentDto } from 'src/dto/paymentDto/RepairPayment.dto';
import { PaymentEntity } from 'src/entity/Payment.entity';
import { ClientEntity } from 'src/entity/client.entity';
import { MembershipEntity } from 'src/entity/membership.entity';
import { UserEntity } from 'src/entity/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { VaucherService } from '../vaucher/vaucher.service';
import { CartEntity } from 'src/entity/Carrito.entity';
import { CreateCartDto } from 'src/dto/Cart/CreateCart.dto';
import { ProductEntity } from 'src/entity/product.entity';
import { FreezingDayEntity } from 'src/entity/freezingDay.entity';
import { VaucherEntity } from 'src/entity/voucher.entity';

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
    private readonly paymentRepository: Repository<PaymentEntity>, 
    @InjectRepository(VaucherEntity)
    private readonly vaucherRepository: Repository<VaucherEntity>,) { }

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

      this.createVoucher(request.idClient,request.Total,"Pago de una membresia");
      await this.paymentRepository.save(payment);



      return { msg: 'se inserto correctamente', success: true };
    } catch (e) {
      return { msg: 'error al insertar', sucess: false, detailMsg: e };
    }
  }

  async RepairPayment(request: RepairPaymentDto){
    const { IdClient } = request;

    const client = await this.clientRepository.findOne({where: {IdClient: IdClient}});
    if (!client) {
      return { msg: 'No se encontro el cliente', success: false };
    }

    // Buscar el último pago del cliente
    const lastPayment = await this.paymentRepository.findOne({
      where: {
        Client: client,
        Due: MoreThan(0) // Utiliza el helper MoreThan para indicar que Due debe ser mayor a 0
      },
      order: { DatePayment: 'DESC' }
    });

    if (!lastPayment) {
        return {msg: "no se encontro el payment", success: false}
    }

    if(lastPayment.Due == 0){
      return {msg: "No tiene deuda", success: false}
    }

   this.createVoucher(request.IdClient,request.Amount,"pago de una deuda")

    await this.paymentRepository.save(lastPayment);

    return {msg:'Deuda pagada',success:true};
  }

  async createVoucher(idClient: number,Amount: number,description: string){
        
    var Cod;
    const vau = await this.vaucherRepository.find({
      order: { Code: 'DESC' },
    });

    if(vau.length == 0){
      Cod = 3000;
    }else{
      
    Cod = vau[0].Code;
    }
    
    const newVoucher = new VaucherEntity();
  newVoucher.Amount = Amount;
  newVoucher.Code = Cod;
  newVoucher.DateRegister = new Date();
  newVoucher.IdClient = idClient;
  newVoucher.Description = description;

  // Crear y guardar el nuevo voucher
  const voucher = this.vaucherRepository.create(newVoucher);
  await this.vaucherRepository.save(voucher);

  return { msg: "ok", success: true };
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

  async findAllByUserCode(search: string) {
    let searchCondition: any = {};

    if (search.length < 5) {
      searchCondition = { Code: Number(search) };
    } else if (/^\d+$/.test(search)) {
      searchCondition = { PhoneNumber: search };
    } else {
      searchCondition = { FirstName: search };
    }

    const client = await this.clientRepository.findOne({
      where: searchCondition,
      relations: ['Payment', 'Payment.User', 'Payment.Membership', 'Payment.FreezingDay'],
    });

    if (!client) {
      return {
        msg: 'No se encontro el cliente',
        success: false,
      };
    }

    return {
      msg: 'Lista de pagos',
      success: true,
      data: client,
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
        return {msg: `El producto con este id: ${productId} no existe`,success: false}
      }

      if (product.Stock < stockToDeduct) {
        
        return {msg: `El producto no tiene esa cantidad de stock ${productId}`,success: false}
      }

      product.Stock -= stockToDeduct;
      await this.productRepository.save(product);

      productEntities.push(product);
    }

    const newCart = new CartEntity();
    newCart.price = Price;
    newCart.products = productEntities;
    newCart.TypePayment = cartDto.TypePayment;

    var us = await this.userRepository.findOne({where:{IdUser: cartDto.IdUser}});
    if(!us){
      return {msg:" no se encontro el usuario ", sucess: false}
    }
    newCart.IdUser = cartDto.IdUser;
    newCart.CreateAt = new Date();

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
