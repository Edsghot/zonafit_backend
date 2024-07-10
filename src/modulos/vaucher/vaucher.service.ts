import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVaucherDto } from 'src/dto/Vaucher/CreateVaucher.dto';
import { VaucherEntity } from 'src/entity/voucher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VaucherService {
    constructor(
        @InjectRepository(VaucherEntity)
        private readonly voucherRepository: Repository<VaucherEntity>,
      ) {}
    
      async createVoucher(req: CreateVaucherDto) {
        var res = new VaucherEntity();
        res.amount = req.Amount;
        res.code = req.Code;
        res.dateRegister = req.DateRegister;
        res.expirationDate = req.ExpirationDate;
        res.idClient = req.clientIdClient;
        res.isActive = req.IsActive;
        const voucher = this.voucherRepository.create(res);
         await this.voucherRepository.save(voucher);
        return {msg:"ok",success: true}
      }

      async findAll() {
        var res =  this.voucherRepository.find();
        return {msg:"ok",success: true,data: res}
      }

}
