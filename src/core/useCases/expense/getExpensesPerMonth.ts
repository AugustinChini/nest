import Expense from "../../domain/models/expense/expense";
import { IExpenseReadRepository } from "./interfaces/expenseReadRepository";
import { endOfMonth } from "date-fns";

export default class GetExpenses {
  private expenseWriteRepository: IExpenseReadRepository;

  constructor(expenseWriteRepository: IExpenseReadRepository) {
    this.expenseWriteRepository = expenseWriteRepository;
  }

  async execute(date: Date): Promise<Expense[]> {
    let start = new Date(date);
    start.setDate(1);
    start.setHours(7);
    let end = new Date(date);
    end = endOfMonth(end);
    end.setHours(23);
    const expenses = await this.expenseWriteRepository.getByRange(start, end);
    return expenses?.length ? expenses : [];
  }
}
