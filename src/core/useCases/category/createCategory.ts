import Category from "../../domain/models/category/category";
import { ICategoryWriteRepository } from "./interfaces/categoryWriteRepository";
import CreateCategoryCommand from "./types/createCategoryCommand";

export default class CreateCategory {
  private categoryWriteRepository: ICategoryWriteRepository;

  constructor(categoryWriteRepository: ICategoryWriteRepository) {
    this.categoryWriteRepository = categoryWriteRepository;
  }

  async execute(command: CreateCategoryCommand): Promise<Category> {
    // save category
    const newCategory = await this.categoryWriteRepository.create(command);
    return new Category(newCategory);
  }
}
