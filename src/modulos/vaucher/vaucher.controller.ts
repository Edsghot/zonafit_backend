import { Controller, Get } from '@nestjs/common';
import { VaucherService } from './vaucher.service';

@Controller('api/vaucher')
export class VoucherController {
  constructor(private readonly voucherService: VaucherService) {}

  @Get()
  async getAllVouchers() {
    return this.voucherService.findAll();
  }
}