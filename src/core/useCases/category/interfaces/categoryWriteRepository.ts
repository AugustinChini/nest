import CategoryDto from "../../../domain/models/category/dto/categoryDto";
import CreateCategoryCommand from "../types/createCategoryCommand";
import UpdateCategoryCommand from "../types/updateCategoryCommand";

export interface ICategoryWriteRepository {
  create: (category: CreateCategoryCommand) => Promise<CategoryDto>;
  update: (category: UpdateCategoryCommand) => Promise<void>;
}
