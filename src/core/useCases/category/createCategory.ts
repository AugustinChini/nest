import Category from "../../domain/models/category/category";
import CategoryNotUpdatedException from "../../domain/models/category/exceptions/categoryNotUpdatedError";
import { ICategoryWriteRepository } from "./interfaces/categoryWriteRepository";
import CreateCategoryCommand from "./types/createCategoryCommand";

export default class CreateCategory {
  private categoryWriteRepository: ICategoryWriteRepository;

  constructor(categoryWriteRepository: ICategoryWriteRepository) {
    this.categoryWriteRepository = categoryWriteRepository;
  }

  async execute(command: CreateCategoryCommand): Promise<Category> {
    if (
      command.name &&
      command.budget > 0 &&
      typeof command.direct === "boolean"
    ) {
      const newCategory = await this.categoryWriteRepository.create(command);
      return new Category(newCategory);
    }
    throw new CategoryNotUpdatedException();
  }
}
