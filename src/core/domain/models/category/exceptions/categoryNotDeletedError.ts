export default class CategoryNotDeletedError extends Error {
  constructor() {
    super("Impossible to delete the Category.");
  }
}
