import { ICategoryReadRepository } from "../category/interfaces/categoryReadRepository";
import { IExpenseWriteRepository } from "./interfaces/expenseWriteRepository";
import CreateOrUpdateExpenseCommand from "./types/createOrUpdateExpenseCommand";

export default class CreateOrUpdateExpense {
  private expenseWriteRepository: IExpenseWriteRepository;
  private categoryReadRepository: ICategoryReadRepository;

  constructor(
    expenseWriteRepository: IExpenseWriteRepository,
    categoryReadRepository: ICategoryReadRepository
  ) {
    this.expenseWriteRepository = expenseWriteRepository;
    this.categoryReadRepository = categoryReadRepository;
  }

  async execute(command: CreateOrUpdateExpenseCommand): Promise<number> {
    // get category or throw
    const category = await this.categoryReadRepository.read(
      command.category.id
    );

    let sqliteExpense;

    if (command.id) {
      await this.expenseWriteRepository.update({
        ...command,
        id: <number>command.id,
        category: category.toDto(),
      });
      sqliteExpense = command.id;
    } else {
      sqliteExpense = await this.expenseWriteRepository.create({
        ...command,
        category: category.toDto(),
      });
    }

    return sqliteExpense;
  }
}
