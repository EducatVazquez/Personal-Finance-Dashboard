import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {
  }
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      console.log('ERROR', error)
      if (error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  find(userId: string) {
    return this.userModel.findById(userId).exec();
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
