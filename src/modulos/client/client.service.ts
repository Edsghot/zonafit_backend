import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from 'src/entity/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
    constructor( @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>){}

    
}
