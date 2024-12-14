import Category from "../category/category";
import ExpenseDto from "./dto/ExpenseDto";

export default class Expense {
  private id: any;
  private name: string;
  private amount: number;
  private category: Category;
  private date: Date;

  public constructor(expense: ExpenseDto) {
    this.id = expense.id;
    this.name = expense.name;
    this.amount = expense.amount;
    this.category = new Category(expense.category);
    this.date = expense.date;
  }

  /**
   * toDto return a readOnly deep copy of the Category
   */
  public toDto(): ExpenseDto {
    return new ExpenseDto({
      id: this.id,
      name: this.name,
      amount: this.amount,
      category: this.category.toDto(),
      date: this.date,
    });
  }
}
