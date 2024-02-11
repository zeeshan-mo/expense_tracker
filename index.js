import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors());

var initialized = false;
var balance = 0;
var expenseArray = [];

/* TODO: Better validation for expense objects, perhaps turn them into a class
Expected expense object layout:
{
  id: 0
  type: "expense",
  amount: -1000,
  recurring: False,
  recurringPeriod: 0,
  date: 1707071087,
  category: "bills",
  description: ""
}
*/
function validateExpenseObject(expenseObject) {
  if (expenseObject === null) return false;
  // income should only have a postive value
  if (expenseObject.type === "income" && expenseObject.amount <= 0)
    return false;
  // expense should only have a negative value
  if (expenseObject.type === "expense" && expenseObject.amount >= 0)
    return false;
  if (expenseObject.recurring === true && expenseObject.recurringPeriod <= 0)
    return false;
  return true;
}

// get the expense array
app.get("/", (req, res) => {
  res.send(expenseArray);
});

app.post("/", (req, res) => {
  switch (req.body.type ?? "") {
    // null type
    case "":
      return;
    // allow initialization but only once
    case "initialize":
      if (initialized) return;
      balance = req.body.amount ?? 0;
      break;
    // new expense object
    case "expenseObject":
      expenseObject = req.body.expenseObject ?? null;
      if (!validateExpenseObject(expenseObject)) return;
      expenseArray.push(expenseObject);
      break;
    // edit expense object
    case "updateExpenseObject":
      expenseObject = req.body.expenseObject ?? null;
      if (!validateExpenseObject(expenseObject)) return;
      expenseArray.forEach((element) => {
        if (element.id === expenseObject.id) {
          element = expenseObject;
          return;
        }
      });
    default:
  }
  res.send(expenseArray);
  return;
});

// delete expense object
app.delete("/", (req, res) => {
  const id = req.body.id ?? -1;
  if (id !== -1) {
    expenseArray = expenseArray.filter((element) => element.id !== id);
  }
  res.send(expenseArray);
});

app.listen(3000, () => {
  console.log("Listening to PORT 3000");
});
