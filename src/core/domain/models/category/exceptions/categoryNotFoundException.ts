export default class CategoryNotFoundException extends Error {
  constructor() {
    super("Category not found");
  }
}
