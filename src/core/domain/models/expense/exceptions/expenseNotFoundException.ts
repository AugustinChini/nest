export default class ExpenseNotFoundException extends Error {
  constructor() {
    super("Expense not found");
  }
}
