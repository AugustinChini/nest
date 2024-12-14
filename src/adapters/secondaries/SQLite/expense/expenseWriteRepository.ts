import ExpenseDto from "../../../../core/domain/models/expense/dto/ExpenseDto";
import { IExpenseWriteRepository } from "../../../../core/useCases/expense/interfaces/expenseWriteRepository";
import SQLiteManager from "../sqlite";
import { SQLiteExpense } from "./expense";

export default class SQLiteExpenseWriteRepository
  implements IExpenseWriteRepository
{
  async create(expense: ExpenseDto): Promise<number> {
    const expenseToCreate = new SQLiteExpense(
      null,
      expense.name,
      expense.amount,
      <any>expense.category,
      expense.date
    );

    const res = await SQLiteManager.getInstance()
      .getDataSource()
      .getRepository(SQLiteExpense)
      .createQueryBuilder("expense")
      .insert()
      .into("expense")
      .values(expenseToCreate)
      .execute();

    return res.identifiers[0].id;
  }

  async update(expense: ExpenseDto): Promise<void> {
    const expenseToUpdate = new SQLiteExpense(
      expense.id,
      expense.name,
      expense.amount,
      <any>expense.category,
      expense.date
    );

    await SQLiteManager.getInstance()
      .getDataSource()
      .createQueryBuilder()
      .update(SQLiteExpense)
      .set(expenseToUpdate)
      .where("id = :id", { id: expenseToUpdate.id })
      .execute();
  }
}
