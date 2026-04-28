const EventEmitter = require('events');

class BudgetEventEmitter extends EventEmitter {}
const budgetEvents = new BudgetEventEmitter();

// Event types
budgetEvents.BUDGET_THRESHOLD = 'budget:threshold';
budgetEvents.BUDGET_EXCEEDED = 'budget:exceeded';

module.exports = budgetEvents;