var todo = {};

todo.Todo = function(data) {
  this.description = m.prop(data.description);
  this.done = data.done ? m.prop(data.done) : m.prop(false);
};

todo.Pouch = function() {
  this.db = new PouchDB({ name: 'mithril-todo', auto_compaction: true });

  this.load = function() {
    return this.db.get('todos')
      .then(function(retrieved) {
        if (retrieved)
          return JSON.parse(retrieved.todos).map(function(parsed) { return new todo.Todo(parsed); });
        else
          return [];
      })
      .catch(function(error) {
        console.error('error loading!', error);
        return [];
      });
  };

  this.store = function(todos) {
    this.db.upsert('todos', function() {
      return { todos: JSON.stringify(todos) };
    }).catch(function(error) {
      console.error('store failed!', error);
    });
  };
};

todo.TodoList = function() {
  var db = new todo.Pouch();
  var todos = m.prop(db.load());
  todos.then(todos);

  this.push = function(todo) {
    todos().push(todo);
    db.store(todos());
  };

  this.update = function(todo) {
    var dos = todos();
    dos[dos.indexOf(todo)] = todo;
    todos(dos);
    db.store(todos);
  };

  this.map = function(func) {
    var dos = todos();
    if (dos)
      return dos.map(func);
    else
      todos.then(m.redraw);
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

          todo.vm.toggle = function() {
            this.done(!this.done());
            todo.vm.list.update(this);
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
                          <td><input type="checkbox" checked={ task.done() } onclick={ todo.vm.toggle.bind(task) } /></td>
                          <td style={ task.done() ? 'text-decoration: line-through' : '' }>{ task.description() }</td>
                         </tr>
                })
              }
            </table>
          </body>  
         </html>
};

m.mount(document, todo);