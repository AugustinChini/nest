import CategoryDto from "../../../domain/models/category/dto/categoryDto";

export interface ICategoryWriteRepository {
  create: (category: CategoryDto) => Promise<CategoryDto>;
  update: (category: CategoryDto) => Promise<void>;
}
