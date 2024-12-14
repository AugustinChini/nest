export default class CategoryNotUpdatedException extends Error {
  constructor() {
    super("Impossible to update the Category.");
  }
}
