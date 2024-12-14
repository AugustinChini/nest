import CategoryDto from "../../../domain/models/category/dto/categoryDto";
import CreateCategoryCommand from "../types/createCategoryCommand";

export interface ICategoryWriteRepository {
  create: (category: CreateCategoryCommand) => Promise<CategoryDto>;
  update: (category: CategoryDto) => Promise<void>;
}
