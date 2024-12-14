import CategoryDto from "../../../../core/domain/models/category/dto/categoryDto";
import { ICategoryWriteRepository } from "../../../../core/useCases/category/interfaces/categoryWriteRepository";
import SQLiteManager from "../sqlite";
import { SQLiteCategory } from "./category";

export default class SQLiteCategoryWriteRepository
  implements ICategoryWriteRepository
{
  async create(category: CategoryDto): Promise<CategoryDto> {
    const categoryToCreate = new SQLiteCategory(
      null,
      category.name,
      category.budget,
      category.direct,
      category.temporary
    );

    const newCategory = await SQLiteManager.getInstance()
      .getDataSource()
      .getRepository(SQLiteCategory)
      .create(categoryToCreate)
      .save();

    return newCategory.toDto();
  }
  async update(category: CategoryDto): Promise<void> {
    await SQLiteManager.getInstance()
      .getDataSource()
      .createQueryBuilder()
      .update(SQLiteCategory)
      .set({
        name: category.name,
        budget: category.budget,
        direct: category.direct,
        temporary: category.temporary,
      })
      .where("id = :id", { id: category.id })
      .execute();
  }
}
