type UpdateCategoryCommand = {
  id: number;
  name?: string;
  budget?: number;
  direct?: boolean;
  temporary?: boolean;
};

export default UpdateCategoryCommand;
