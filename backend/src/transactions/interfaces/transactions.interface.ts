import { Document } from 'mongoose';
import { ITransaction } from './ITransactions.interface';

export interface Transactions extends ITransaction, Document { }