import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserToClient } from './interfaces/users.interface';

@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async find(@GetUser('userId') userId: string): Promise<UserToClient> {
    const user = await this.usersService.find(userId);

    // Explicitly return only the fields defined in UserToClient
    return {
      name: user.name,
      email: user.email,
      balance: user.balance,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@GetUser('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<UserToClient> {
    const updatedUser = await this.usersService.update(userId, updateUserDto);

    return {
      name: updatedUser.name,
      email: updatedUser.email,
      balance: updatedUser.balance,
    };
  }
}
