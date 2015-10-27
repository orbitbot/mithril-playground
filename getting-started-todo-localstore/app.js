var todo = {};

todo.Todo = function(data) {
  this.description = m.prop(data.description);
  this.done = data.done ? m.prop(false) : m.prop(data.done);
};

todo.TodoList = function() {
  var todos = (localStorage.todos) ? JSON.parse(localStorage.todos) : [];
  todos = todos.map(function(stored) {
    return new todo.Todo(stored);
  });

  this.push = function(todo) {
    todos.push(todo);
    localStorage.todos = JSON.stringify(todos);
  };

  this.map = function(func) {
    return todos.map(func);
  };
};

todo.vm = {
  init: function() {
          todo.vm.list = new todo.TodoList();

          todo.vm.description = m.prop('');

          todo.vm.add = function() {
            if (todo.vm.description()) {
              todo.vm.list.push(new todo.Todo({ description: todo.vm.description() }));
              todo.vm.description('');
            }
          };
        }
};

todo.controller = function() {
  todo.vm.init();
};

todo.view = function() {
  return <html>
          <body>
            <input value={ todo.vm.description() } onchange={ m.withAttr('value', todo.vm.description) } />
            <button onclick={ todo.vm.add }>Add</button>
            <table>
              {
                todo.vm.list.map(function(task, index) {
                  return <tr>
                          <td><input type="checkbox" checked={ task.done() } onclick={ m.withAttr('checked', task.done) } /></td>
                          <td style={ task.done() ? 'text-decoration: line-through' : '' }>{ task.description() }</td>
                         </tr>
                })
              }
            </table>
          </body>  
         </html>
};

m.mount(document, todo);