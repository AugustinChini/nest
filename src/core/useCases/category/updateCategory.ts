import Category from "../../domain/models/category/category";
import CategoryNotFoundException from "../../domain/models/category/exceptions/categoryNotFoundException";
import CategoryNotUpdatedException from "../../domain/models/category/exceptions/categoryNotUpdatedError";
import { ICategoryReadRepository } from "./interfaces/categoryReadRepository";
import { ICategoryWriteRepository } from "./interfaces/categoryWriteRepository";
import UpdateCategoryCommand from "./types/updateCategoryCommand";

export default class UpdateCategory {
  private categoryReadRepository: ICategoryReadRepository;
  private categoryWriteRepository: ICategoryWriteRepository;

  constructor(
    categoryWriteRepository: ICategoryWriteRepository,
    categoryReadRepository: ICategoryReadRepository
  ) {
    this.categoryReadRepository = categoryReadRepository;
    this.categoryWriteRepository = categoryWriteRepository;
  }

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    try {
      const category = await this.categoryReadRepository.read(command.id);
      if (category) {
        const categoryDto = category.toDto();
        const updatedCategory = {
          id: categoryDto.id,
          name: command.name ? command.name : categoryDto.name,
          budget: command.budget ? command.budget : categoryDto.budget,
          direct: command.direct ? command.direct : categoryDto.direct,
          temporary: command.temporary
            ? command.temporary
            : categoryDto.temporary,
        };
        await this.categoryWriteRepository.update(updatedCategory);
        return new Category(updatedCategory);
      }
      throw new CategoryNotFoundException();
    } catch (error) {
      throw new CategoryNotUpdatedException();
    }
  }
}
