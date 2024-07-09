import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/userDto/CreateUserDto.dto';
import { UpdateUserDto } from 'src/dto/userDto/UpdateUserDto.dto';

@Controller('api/user')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    async getAllUsers() {
      return this.userService.getAllUsers();
    }
  
    @Get(':id')
    async getUserById(@Param('id') userId: number) {
      return this.userService.getUserById(userId);
    }
  
    @Post()
    async insertUser(@Body() createUserDto: CreateUserDto) {
      return this.userService.insertUser(createUserDto);
    }

    @Post('/update')
    async UpdateUser(@Body() update: UpdateUserDto) {
      return this.userService.updateUserId(update);
    }
  
    @Delete(':id')
    async deleteUser(@Param('id') userId: number) {
      return this.userService.deleteUser(userId);
    }
    @Post('/login')
    async login(@Body('UserName') Username: string, @Body('Password') Password: string) {
      return this.userService.login(Username, Password);
    }
}
