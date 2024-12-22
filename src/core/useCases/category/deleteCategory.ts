import CategoryNotDeletedError from "../../domain/models/category/exceptions/categoryNotDeletedError";
import { ICategoryWriteRepository } from "./interfaces/categoryWriteRepository";
import DeleteCategoryCommand from "./types/deleteCategoryCommand";

export default class DeleteCategory {
  private categoryWriteRepository: ICategoryWriteRepository;

  constructor(categoryWriteRepository: ICategoryWriteRepository) {
    this.categoryWriteRepository = categoryWriteRepository;
  }

  async execute(command: DeleteCategoryCommand): Promise<void> {
    if (command.id) {
      return this.categoryWriteRepository.delete(command);
    }
    throw new CategoryNotDeletedError();
  }
}
