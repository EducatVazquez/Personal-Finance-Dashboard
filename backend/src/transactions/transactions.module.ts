import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthModule } from '@/auth/auth.module';
import { TransactionSchema } from './schemas/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@/users/schemas/user.schema';
import { CategorySchema } from '@/categories/schemas/category.schema';
import { CategoriesService } from '@/categories/categories.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Transaction', schema: TransactionSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, CategoriesService],
})
export class TransactionsModule { }
