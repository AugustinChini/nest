import CategoryDto from "./dto/categoryDto";

export default class Category {
  private id: number;
  private name: string;
  private budget: number;
  private direct: boolean;
  private temporary: boolean;

  public constructor(categoryDto: CategoryDto) {
    this.id = categoryDto.id;
    this.name = categoryDto.name;
    this.budget = categoryDto.budget;
    this.direct = categoryDto.direct;
    this.temporary = categoryDto.temporary;
  }

  /**
   * toDto return a readOnly deep copy of the category
   */
  public toDto(): CategoryDto {
    return new CategoryDto({
      id: this.id,
      name: this.name,
      budget: this.budget,
      direct: this.direct,
      temporary: this.temporary,
    });
  }
}
