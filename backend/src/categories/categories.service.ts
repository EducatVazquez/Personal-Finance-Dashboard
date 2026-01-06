import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findOrCreate(name: string, userId: string | null): Promise<CategoryDocument> {
    // 1. Validation: Ensure we actually have a name before proceeding
    if (!name) {
      throw new BadRequestException('Category name is required to create a new category');
    }

    const cleanName = name.trim();

    // 2. Look for the category (Global or User-specific)
    let category = await this.categoryModel.findOne({
      name: cleanName,
      userId: null
    });

    // 3. Create if it doesn't exist
    if (!category) {
      category = await this.categoryModel.create({
        name: cleanName,
        userId
      });
    }

    return category;
  }

  findAll(userId: string) {
    return this.categoryModel.find(
      {
        $or: [
          { userId: null },
          { userId }
        ]
      }
    ).exec();
  }
}
