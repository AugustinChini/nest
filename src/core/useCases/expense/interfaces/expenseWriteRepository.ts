import CategoryDto from "../../../domain/models/category/dto/categoryDto";
import ExpenseDto from "../../../domain/models/expense/dto/ExpenseDto";

export interface IExpenseWriteRepository {
  create: (expense: {
    id: any;
    name: string;
    amount: number;
    category: CategoryDto;
    date: Date;
  }) => Promise<number>;
  update: (expense: ExpenseDto) => Promise<void>;
  delete: (id: number) => Promise<void>;
}
