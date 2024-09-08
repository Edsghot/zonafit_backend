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
import * as moment from 'moment-timezone';
import { DateRangeDto } from 'src/dto/clientDto/DateRangeDto.dto';
import { UpdatePaymentDto } from 'src/dto/paymentDto/UpdatePayment.dto';
import { CreateClasesDto } from 'src/dto/paymentDto/createClases.dto';

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

    async DetailProduct(request: DateRangeDto){
      try{
        const data = await this.paymentRepository.query(
            `CALL GetDetailPaymentProduct('${request.StartDate}', '${request.EndDate}')`,
          );
  
          if (!data[0] || Object.keys(data[0]).length === 0) {
            return {
                msg: 'No se encontró datos',
                success: false,
            };
          }
          return {
            msg: 'Lista de ingresos de ventas',
            data: data[0],
            success: true,
          };
    }catch(error){
        console.error('Error al recuperar todas las ventas', error);
        return {
            msg: 'Error al recuperar todas las ventas del producto',
            detailMsg: error.message,
            success: false,
      };
  }
  }


  async createClases(request: CreateClasesDto) {
    try {
      let payment = new PaymentEntity();
      var res = await this.clientRepository.findOne({ where: { Code: 1000 } })
      if (!res) {
        return { msg: 'FALTA CREAR UN USUARIO, COMUNICATE CON EL ADMINISTRADOR DEL SISTEMA', success: false };
      }
      payment.Client = res;
      var membership = await this.membershipRepository.findOne({ where: { IdMembership: 100 } })
      if (!membership) {
        return { msg: 'FALTA CREAR UNA MEMBRESIA, COMUNICATE CON EL ADMINISTRADOR DEL SISTEMA', success: false };
      }
      payment.Membership = membership;

      
      var user = await this.userRepository.findOne({ where: { IdUser: request.IdUser } })
      payment.User = user;
      payment.StartDate = moment.tz('America/Lima').toDate();
      payment.EndDate = moment.tz('America/Lima').toDate();
      payment.Total = request.Total;
      payment.Discount = 0;
      payment.PriceDiscount = 0;
      payment.QuantityDays = 1;
      payment.DatePayment = moment.tz('America/Lima').toDate();
      payment.Due = 0;
      payment.PrePaid = request.Total;
      payment.PaymentType = request.PaymentType;
      payment.PaymentReceipt = request.PaymentReceipt;
      payment.Observation = request.Observation;
      payment.DateRegister = moment.tz('America/Lima').toDate();
      

      var vaucher = await this.createVoucher(res.IdClient,request.Total,"Pago de una clase",user.IdUser,request.PaymentType);
      
      if(!vaucher.success){
        return {msg: vaucher.msg,success:false}
      }
     
      await this.paymentRepository.save(payment);

      return { msg: 'Se registro correctamente la clase', success: true };
    } catch (e) {
      return { msg: 'Error al insertar', sucess: false, detailMsg: e };
    }
  }

  
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
      payment.DateRegister = moment.tz('America/Lima').toDate();
      

      var vaucher = await this.createVoucher(request.idClient,request.Total,"Pago de una membresia",user.IdUser,request.PaymentType);
      
      if(!vaucher.success){
        return {msg: vaucher.msg,success:false}
      }
     
      await this.paymentRepository.save(payment);



      return { msg: 'Se inserto correctamente', success: true };
    } catch (e) {
      return { msg: 'Error al insertar', sucess: false, detailMsg: e };
    }
  }

  async RepairPayment(request: RepairPaymentDto){
    const { IdClient } = request;

    const client = await this.clientRepository.findOne({where: {IdClient: IdClient}});
    if (!client) {
      return { msg: 'No se encontro el cliente', success: false };
    }

    // Buscar el último pago del cliente
    var lastPayment = await this.paymentRepository.query("SELECT * FROM Payment WHERE clientIdClient = "+client.IdClient+" AND Due > 0");

    if (!lastPayment[0]) {
        return {msg: "no se encontro el payment", success: false}
    }

    if(lastPayment[0].Due == 0){
      return {msg: "No tiene deuda", success: false}
    }

    lastPayment[0].Due -= request.Amount;
    lastPayment[0].Total += request.Amount;

   var res = await this.createVoucher(request.IdClient,request.Amount,"pago de una deuda",request.IdUser,request.TypePayment);

   if(!res.success){
    return {msg:res.msg,success:false}
   }
   lastPayment[0].TotalAmount
    await this.paymentRepository.save(lastPayment[0]);

    return {msg:'Deuda pagada',success:true};
  }

  async createVoucher(idClient: number,Amount: number,description: string,idUser:number,typePayment:string){
        
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
      newVoucher.DateRegister = moment.tz('America/Lima').toDate();;
      newVoucher.IdClient = idClient;
      newVoucher.Description = description;
    var user = await this.userRepository.findOne({where: {IdUser: idUser}});
    if(!user){
      return {msg: "User not found", success: false}
  }
  newVoucher.IdUser = idUser;
  newVoucher.TypePayment = typePayment;

  // Crear y guardar el nuevo voucher
  const voucher = this.vaucherRepository.create(newVoucher);
  await this.vaucherRepository.save(voucher);

  return { msg: "ok", success: true };
  }

  async updateVoucher(idVoucher: number,Amount: number,typePayment:string){
      
    var voucher = await this.vaucherRepository.findOne({where: {VoucherId: idVoucher}});

    if(!voucher){
      return {msg:"No se encontro el voucher", success: false}
    }

    voucher.Amount = Amount;
    voucher.TypePayment = typePayment;


    await this.vaucherRepository.save(voucher);

  return { msg: "ok", success: true };
  }

  async GetCount(){
    const paymentCount = await this.paymentRepository.count();
      const totalRevenue = await this.paymentRepository
        .createQueryBuilder('payment')
        .select('SUM(payment.Total)', 'sum')
        .getRawOne();
      const productCount = await this.productRepository.count();
      const clientCount = await this.clientRepository.count();

      return {
        msg: "Lista de totales",
        success: true,
        data: {
          paymentCount,
          totalRevenue: totalRevenue.sum || 0,  // Si no hay pagos, devolver 0
          productCount,
          clientCount,
        }
      };
  }

  async findAllPayments() {
    try {
      var payment = await this.paymentRepository.find();
      return { msg: 'Lista de pagos ', success: true, data: payment };
    } catch (e) {
      return {
        msg: 'Error al listar pagos',
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

    if (/^\d{4}$/.test(search)) {
      searchCondition = { Code: Number(search) };
    } else if (/^\d+$/.test(search)) {
      searchCondition = { PhoneNumber: search };
    } else {
      searchCondition = [{ FirstName: search },{ LastName: search }];
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
    newCart.CreateAt = moment.tz('America/Lima').toDate();;

    var vaucher = await this.createVoucher(99,cartDto.Price,"Compra de productos",cartDto.IdUser,cartDto.TypePayment);
      
      if(!vaucher.success){
        return {msg: vaucher.msg,success:false}
      }

    var data = await this.cartRepository.save(newCart);
    return {msg: `Se inserto correctamente`,success: true, data: data}
    
  }

  async updatePayment(request: UpdatePaymentDto) {
    try {
      const payment = await this.paymentRepository.findOne({ where: { PaymentId: request.idPayment } });
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

  async getPaymentByDateRange(request: DateRangeDto){
    try{
      const data = await this.paymentRepository.query(
          `CALL getPaymentByDateRange('${request.StartDate}', '${request.EndDate}')`,
        );
        return {
          msg: 'Lista de pagos completa',
          data: data[0],
          success: true,
        };
  }catch(error){
      console.error('Error al recuperar todos los pagos:', error);
      return {
          msg: 'Error al recuperar todos los pagos',
          detailMsg: error.message,
          success: false,
    };
  }
  }

  async getIncomeMembershipByDateRange(request: DateRangeDto){
    try{
      const data = await this.paymentRepository.query(
          `CALL getIncomeMembershipByDateRange('${request.StartDate}', '${request.EndDate}')`,
        );

        if (!data[0] || Object.keys(data[0]).length === 0) {
          return {
              msg: 'No se encontró datos',
              success: false,
          };
        }
        return {
          msg: 'Lista de ingresos de membresia completa',
          data: data[0],
          success: true,
        };
  }catch(error){
      console.error('Error al recuperar todos los ingresos de membresia:', error);
      return {
          msg: 'Error al recuperar todos los ingresos de membresia',
          detailMsg: error.message,
          success: false,
    };
  }
  }

  async getIncomeProductByDateRange(request: DateRangeDto){
    try{
      const data = await this.productRepository.query(
          `CALL getIncomeProductByDateRange('${request.StartDate}', '${request.EndDate}')`,
        );
        if (!data[0] || Object.keys(data[0]).length === 0) {
          return {
              msg: 'No se encontró datos',
              success: false,
          };
        }
        return {
          msg: 'Lista de ingresos de producto completa',
          data: data[0],
          success: true,
        };
  }catch(error){
      console.error('Error al recuperar todos los ingresos de producto:', error);
      return {
          msg: 'Error al recuperar todos los ingresos de producto',
          detailMsg: error.message,
          success: false,
    };
  }
  }

  async getProductSoldByDateRange(request: DateRangeDto){
    try{
      const data = await this.productRepository.query(
          `CALL getProductSoldByDateRange('${request.StartDate}', '${request.EndDate}')`,
        );
        return {
          msg: 'Lista de venta de productos completa',
          data: data[0],
          success: true,
        };
  }catch(error){
      console.error('Error al recuperar todas las ventas de productos:', error);
      return {
          msg: 'Error al recuperar todas las ventas de productos',
          detailMsg: error.message,
          success: false,
    };
  }
  }
}
