import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { TransactionsModule } from '../transactions/transactions.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    TransactionsModule,
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
