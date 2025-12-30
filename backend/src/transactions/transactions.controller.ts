import { Controller, Get, Post, Body, UseGuards, Param, Put, Delete, Query } from '@nestjs/common';
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
    return this.transactionsService.getMonthlyStats(userId, month, year);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.transactionsService.delete(id);
  }
}
