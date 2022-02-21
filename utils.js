function validateTodo(todo) {
  let valid = true;

  valid = valid && todo.description;
  valid = valid && todo.description.length > 0;

  return valid;
}

module.exports = { validateTodo };
