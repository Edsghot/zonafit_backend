import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVaucherDto } from 'src/dto/Vaucher/CreateVaucher.dto';
import { ClientEntity } from 'src/entity/client.entity';
import { VaucherEntity } from 'src/entity/voucher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VaucherService {
    constructor(
        @InjectRepository(VaucherEntity)
        private readonly voucherRepository: Repository<VaucherEntity>,
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>
      ) {}
    
      

      async findAll() {
        const vouchers = await this.voucherRepository.find();
        return { msg: "ok", success: true, data: vouchers };
      }

      async findAllCode(code: number) {

        var client = await this.clientRepository.findOne({where:{Code: code}});
        if(!client){
          return { msg: "No se encontro el cliente", success: false };    
        }
        const vouchers = await this.voucherRepository.find({where: {IdClient: client.IdClient}});
        return { msg: "Lista de vaucher del cliente "+client.FirstName, success: true,data: vouchers };
      }
}
