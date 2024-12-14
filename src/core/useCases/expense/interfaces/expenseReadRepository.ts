import Expense from "../../../domain/models/expense/expense";

export interface IExpenseReadRepository {
  read: (id: string) => Promise<Expense>;
  getByRange: (start: Date, end: Date) => Promise<Expense[]>;
}
