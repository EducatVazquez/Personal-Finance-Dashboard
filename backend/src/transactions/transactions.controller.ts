import { Controller, Get, Post, Body, UseGuards, Param, Put, Delete, Query, BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @GetUser('userId') userId: string) {
    return this.transactionsService.create(createTransactionDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@GetUser("userId") userId: string, @Query('page') page: number = 1) {
    return this.transactionsService.findAllByUserId(userId, page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats(@GetUser('userId') userId: string, @Query('month') month: number, @Query('year') year: number) {
    if (!month || !year) {
      throw new BadRequestException('Month and year are required');
    }
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }
    if (year < 2000 || year > 2100) {
      throw new BadRequestException('Year must be between 2000 and 2100');
    }
    return this.transactionsService.getMonthlyStats(userId, month, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@GetUser('userId') userId: string, @Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.transactionsService.delete(id);
  }
}
