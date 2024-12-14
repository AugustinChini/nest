import Category from "../../../domain/models/category/category";

export interface ICategoryReadRepository {
  list: () => Promise<Category[]>;
  read: (id: number | string) => Promise<Category>;
}
