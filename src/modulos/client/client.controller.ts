import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from 'src/dto/clientDto/CreateClientDto.dto';

@Controller('api/client')
export class ClientController {


    constructor (private clientService: ClientService){}


    @Post()
    async create(@Body() createClientDto: CreateClientDto) {
        return await this.clientService.insertClient(createClientDto);
    }

    @Get()
    async findAll() {
        return await this.clientService.getAllClients();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.clientService.getClientById(+id);
    }

    @Get('dni/:dni')
    async findByDni(@Param('dni') dni: string) {
        return await this.clientService.getClientByDni(dni);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.clientService.deleteClient(+id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateClientDto: CreateClientDto) {
        return await this.clientService.updateClient(id, updateClientDto);
    }
}
