import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
} from "typeorm/browser";
import CategoryDto from "../../../../core/domain/models/category/dto/categoryDto";

@Entity("category")
export class SQLiteCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("integer")
  budget: number;

  @Column()
  direct: boolean;

  @Column()
  temporary: boolean;

  constructor(
    id: any,
    name: string,
    budget: number,
    direct: boolean,
    temporary: boolean
  ) {
    super();
    this.id = id;
    this.name = name;
    this.budget = budget;
    this.direct = direct;
    this.temporary = temporary;
  }

  toDto(): CategoryDto {
    return {
      id: this.id,
      name: this.name,
      budget: this.budget,
      direct: this.direct,
      temporary: this.temporary,
    };
  }
}
