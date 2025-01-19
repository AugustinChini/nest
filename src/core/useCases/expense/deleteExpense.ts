import { IExpenseWriteRepository } from "./interfaces/expenseWriteRepository";

export default class DeleteExpense {
  private expenseWriteRepository: IExpenseWriteRepository;

  constructor(expenseWriteRepository: IExpenseWriteRepository) {
    this.expenseWriteRepository = expenseWriteRepository;
  }

  async execute(command: { id: number }): Promise<void> {
    if (command.id) {
      await this.expenseWriteRepository.delete(command.id);
    }
  }
}
