type UpdateCategoryCommand = {
  id: string;
  name?: string;
  budget?: number;
  direct?: boolean;
  temporary?: boolean;
};

export default UpdateCategoryCommand;
