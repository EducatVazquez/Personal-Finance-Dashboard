
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactions } from './interfaces/transactions.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private transactionModel: Model<Transactions>,
  ) { }

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transactions> {
    const transaction = {
      ...createTransactionDto,
      amount: createTransactionDto.type === 'INCOME' ? Math.abs(createTransactionDto.amount) : -Math.abs(createTransactionDto.amount),
      userId: userId
    }
    const createdTransaction = new this.transactionModel(transaction);
    return createdTransaction.save();
  }

  async findAllByUserId(userId: string, page: number = 1): Promise<Transactions[]> {
    const skip = (page - 1) * 10;
    return this.transactionModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10)
      .exec();
  }

  async findOneById(id: string): Promise<Transactions> {
    const transaction = await this.transactionModel.findById(id).exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transactions> {
    const updatedTransaction = await this.transactionModel.findByIdAndUpdate(id, updateTransactionDto, { new: true }).exec();

    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return updatedTransaction;
  }

  async delete(id: string): Promise<Transactions> {
    const deletedTransaction = await this.transactionModel.findByIdAndDelete(id).exec();

    if (!deletedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return deletedTransaction;
  }
}
