import { Controller } from '@nestjs/common';
import { MembershipService } from './membership.service';

@Controller('membership')
export class MembershipController {
    constructor(private membershipService: MembershipService){
        
    }
}
