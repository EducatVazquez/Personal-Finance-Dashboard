
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactions } from './interfaces/transactions.interface';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserDocument } from '@/users/interfaces/users.interface';
import { CategoryDocument } from '@/categories/interfaces/ICategoriesDocument.interface';
import { CategoriesService } from '@/categories/categories.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction')
    private transactionModel: Model<Transactions>,
    @InjectModel('User')
    private userModel: Model<UserDocument>,
    @InjectModel('Category')
    private categoryModel: Model<CategoryDocument>,
    private categoriesService: CategoriesService,
  ) { }

  private getAmountAccordingToTypeOfTransaction(type: string, amount: number) {
    const amountDelta = type === 'INCOME'
      ? Math.abs(amount)
      : -Math.abs(amount);
    return amountDelta;
  }

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transactions> {
    // 1. Determine the actual numeric change (positive for income, negative for expense)
    let category: CategoryDocument | null = null;
    if (createTransactionDto.category_id) {
      category = await this.categoryModel.findById(createTransactionDto.category_id);
      if (!category) {
        throw new NotFoundException(`Category with ID ${createTransactionDto.category_id} not found`);
      }
    } else {
      category = await this.categoriesService.findOrCreate(null, createTransactionDto.newCategoryName, userId);
    }

    const amountDelta = this.getAmountAccordingToTypeOfTransaction(createTransactionDto.type, createTransactionDto.amount);

    const transaction = {
      ...createTransactionDto,
      amount: amountDelta, // Use the signed number here
      userId: userId,
      category_id: category?._id
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

    if (!stats || stats.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
      };
    }

    return stats[0];
  }

  async findOneById(id: string): Promise<Transactions> {
    const transaction = await this.transactionModel.findById(id).exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userId: string): Promise<Transactions> {

    const updatedBalance = await this.userModel.findByIdAndUpdate(userId, { $inc: { balance: this.getAmountAccordingToTypeOfTransaction(updateTransactionDto.type, updateTransactionDto.amount) } });

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
