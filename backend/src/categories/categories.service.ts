import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument } from './interfaces/ICategoriesDocument.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private categoryModel: Model<CategoryDocument>,
  ) {
  }

  async onModuleInit() {
    await this.seedDefaultCategories();
  }

  // 2. The logic to populate the DB with defaults
  private async seedDefaultCategories() {
    const defaultCategories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Salary'];

    for (const name of defaultCategories) {
      // We use findOne to avoid creating duplicates every time the app restarts
      const exists = await this.categoryModel.findOne({ name });

      if (!exists) {
        await this.categoryModel.create({
          name: name
        });
        console.log(`🌱 Default category created: ${name}`);
      }
    }
  }

  async findOrCreate(id: string | null, name: string, userId: string | null) {
    if (id) {
      return await this.categoryModel.findById(id);
    }

    let category = await this.categoryModel.findOne({ name });
    if (!category) {
      category = await this.categoryModel.create({ name, userId });
    }
    return category;
  }

  findAll() {
    return this.categoryModel.find(
      {
        userId: null
      }
    ).exec();
  }
}
