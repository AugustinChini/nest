export default class CategoryNotCreatedException extends Error {
  constructor() {
    super("Impossible to create the category.");
  }
}
