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
        
        var Cod;
        var vau = await this.voucherRepository.findOne({order:{DateRegister: 'DESC'}});

        Cod = vau.Code;
        if(!vau){
          Cod = 3000;
        }
        
        var res = new VaucherEntity();
        res.Amount = req.Amount;
        res.Code = Cod;
        res.DateRegister = new Date();
        res.IdClient = req.IdClient;
        res.Description = req.Description;
        const voucher = this.voucherRepository.create(res);
         await this.voucherRepository.save(voucher);
        return {msg:"ok",success: true}
      }

      async findAll() {
        var res =  this.voucherRepository.find();
        return {msg:"ok",success: true,data: res}
      }

}
