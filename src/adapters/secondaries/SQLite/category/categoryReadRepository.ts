import Category from "../../../../core/domain/models/category/category";
import CategoryNotFoundException from "../../../../core/domain/models/category/exceptions/categoryNotFoundException";
import { ICategoryReadRepository } from "../../../../core/useCases/category/interfaces/categoryReadRepository";
import SQLiteManager from "../sqlite";
import { SQLiteCategory } from "./category";

export default class SQLiteCategoryReadRepository
  implements ICategoryReadRepository
{
  async list(): Promise<Category[]> {
    const result = await SQLiteManager.getInstance()
      .getDataSource()
      .getRepository(SQLiteCategory)
      .find();

    return result?.length ? result.map((c) => new Category(c)) : [];
  }
  async read(id: number | string): Promise<Category> {
    const result = await SQLiteManager.getInstance()
      .getDataSource()
      .getRepository(SQLiteCategory)
      .createQueryBuilder("category")
      .where("category.id = :id", { id })
      .getOne();

    if (!result) throw new CategoryNotFoundException();
    return new Category(result);
  }
}
