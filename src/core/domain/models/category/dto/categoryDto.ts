export default class CategoryDto {
  readonly id: number;
  readonly name: string;
  readonly budget: number;
  readonly direct: boolean;
  readonly temporary: boolean;

  public constructor(categoryDto: CategoryDto) {
    this.id = categoryDto.id;
    this.name = categoryDto.name;
    this.budget = categoryDto.budget;
    this.direct = categoryDto.direct;
    this.temporary = categoryDto.temporary;
  }
}
