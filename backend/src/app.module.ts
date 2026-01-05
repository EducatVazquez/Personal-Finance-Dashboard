import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [TransactionsModule, AuthModule, MongooseModule.forRoot(process.env.MONGO_URI!), UsersModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
