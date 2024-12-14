import CategoryDto from "../../category/dto/categoryDto";

export default class ExpenseDto {
  readonly id: any;
  readonly name: string;
  readonly amount: number;
  readonly category: CategoryDto;
  readonly date: Date;

  public constructor(expenseDto: ExpenseDto) {
    this.id = expenseDto.id;
    this.name = expenseDto.name;
    this.amount = expenseDto.amount;
    this.category = expenseDto.category;
    this.date = expenseDto.date;
  }
}
