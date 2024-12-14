import CategoryDto from "../../../domain/models/category/dto/categoryDto";

type CreateOrUpdateExpenseCommand = {
  id: any;
  name: string;
  amount: number;
  category: CategoryDto;
  date: Date;
};

export default CreateOrUpdateExpenseCommand;
