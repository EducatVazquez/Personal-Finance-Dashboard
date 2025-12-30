
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactions } from './interfaces/transactions.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserDocument } from '@/users/interfaces/users.interface';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private transactionModel: Model<Transactions>,
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) { }

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transactions> {
    // 1. Determine the actual numeric change (positive for income, negative for expense)
    const amountDelta = createTransactionDto.type === 'INCOME'
      ? Math.abs(createTransactionDto.amount)
      : -Math.abs(createTransactionDto.amount);

    const transaction = {
      ...createTransactionDto,
      amount: amountDelta, // Use the signed number here
      userId: userId
    };

    // 2. Update the user balance using the same delta
    // If amountDelta is -50, $inc will correctly decrease the balance.
    await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { balance: amountDelta } }
    ).exec();

    // 3. Save the transaction record
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

  async getMonthlyStats(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 1);      // First day of the NEXT month

    const stats = await this.transactionModel.aggregate([
      {
        $match: {
          userId: userId,
          date: {
            $gte: startDate, // Start of current month
            $lt: endDate     // Before start of next month
          }
        }
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "INCOME"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "EXPENSE"] }, "$amount", 0] } },
          balance: { $sum: "$amount" }
        }
      }
    ]);

    return stats[0];
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
