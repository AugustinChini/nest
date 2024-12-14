import Category from "../../domain/models/category/category";
import { ICategoryReadRepository } from "./interfaces/categoryReadRepository";

export default class GetAllCategorys {
  private categoryReadRepository: ICategoryReadRepository;

  constructor(categoryReadRepository: ICategoryReadRepository) {
    this.categoryReadRepository = categoryReadRepository;
  }

  async execute(): Promise<Category[]> {
    return this.categoryReadRepository.list();
  }
}
