import { Between } from "typeorm/browser";
import ExpenseNotFoundException from "../../../../core/domain/models/expense/exceptions/expenseNotFoundException";
import Expense from "../../../../core/domain/models/expense/expense";
import { IExpenseReadRepository } from "../../../../core/useCases/expense/interfaces/expenseReadRepository";
import SQLiteManager from "../sqlite";
import { SQLiteExpense } from "./expense";
import Category from "../../../../core/domain/models/category/category";

export default class SQLiteExpenseReadRepository
  implements IExpenseReadRepository
{
  async read(id: string): Promise<Expense> {
    const result = await SQLiteManager.getInstance()
      .getDataSource()
      .getRepository(SQLiteExpense)
      .createQueryBuilder("expense")
      .where("expense.id = :id", { id })
      .getOne();

    if (!result) throw new ExpenseNotFoundException();
    return new Expense(result.toDto());
  }

  async getByRange(start: Date, end: Date): Promise<Expense[]> {
    const result = await SQLiteManager.getInstance()
      .getDataSource()
      .getRepository(SQLiteExpense)
      .find({
        relations: {
          category: true,
        },
        where: {
          date: Between(start, end),
        },
      });
    if (!result) return [];
    return result.map((expense) => {
      return new Expense({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        category: new Category(expense.category).toDto(),
        date: expense.date,
      });
    });
  }
}
