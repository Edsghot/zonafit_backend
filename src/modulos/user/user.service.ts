import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/userDto/CreateUserDto.dto';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor( @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>){}

    async insertUser(request: CreateUserDto) {
      try {
          // Crear una nueva entidad de usuario utilizando los datos del DTO
          const newUser = this.userRepository.create({
              FirstName: request.firstName,
              LastName: request.lastName,
              Password: request.password,
              PhoneNumber: request.phoneNumber,
              Dni: request.dni,
              Code: request.code,
              Username: request.username,
              Access: request.access,
              RoleId: request.roleId,
              Email: request.email,
          });
  
          // Guardar la nueva entidad de usuario en la base de datos
          await this.userRepository.save(newUser);
  
          return { msg: 'User inserted successfully', success: true };
      } catch (error) {
          console.error('Failed to insert user:', error);
          return { msg: 'Failed to insert user', detailMsg: error, success: false };
      }
  }
  
  async getAllUsers() {
    try {
        const users = await this.userRepository.find();
        return { data: users, msg: 'Success', success: true };
    } catch (error) {
        console.error('Failed to get users:', error);
        return { msg: 'Failed to get users', detailMsg: error, success: false };
    }
}
  
async deleteUser(userId: number) {
    try {
        await this.userRepository.delete(userId);
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { msg: 'Failed to delete user', detailMsg: error, success: false };
    }
}

async getUserById(userId: number) {
    try {
        const user = await this.userRepository.findOne({ where: { IdUser: userId } });
        return { data: user, msg: 'Success', success: true };
    } catch (error) {
        console.error('Failed to get user by ID:', error);
        return { msg: 'Failed to get user', detailMsg: error, success: false };
    }
}

async login(username: string, password: string) {
    try {
        const user = await this.userRepository.findOne({ where: { Username: username } });
        if (!user || user.Password !== password || !user.Access) {
            return { data: null, msg: 'Invalid username or password', success: false };
        }

        return { data: user, msg: 'Success', success: true };
    } catch (error) {
        console.error('Login failed:', error);
        return { msg: 'Login failed', detailMsg: error, success: false };
    }
}

  
}
