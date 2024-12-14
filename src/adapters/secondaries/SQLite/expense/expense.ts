import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm/browser";
import ExpenseDto from "../../../../core/domain/models/expense/dto/ExpenseDto";
import { SQLiteCategory } from "../category/category";

@Entity("expense")
export class SQLiteExpense extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("int")
  amount: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => SQLiteCategory)
  @JoinColumn()
  category: SQLiteCategory;

  constructor(
    id: any,
    name: string,
    amount: number,
    category: SQLiteCategory,
    date: Date
  ) {
    super();
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.category = category;
    this.date = date;
  }

  toDto(): ExpenseDto {
    return {
      id: this.id,
      name: this.name,
      amount: this.amount,
      category: this.category,
      date: this.date,
    };
  }
}
