var todo = {};

todo.Todo = function(data) {
  this.description = m.prop(data.description);
  this.done = m.prop(false);
};

todo.TodoList = Array;

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
  return m('html', [
            m('body', [
              m('input', { onchange: m.withAttr('value', todo.vm.description), value: todo.vm.description() }),
              m('button', { onclick: todo.vm.add }, 'Add'),
              m('table', [
                todo.vm.list.map(function(task, index) {
                  return m('tr', [
                            m('td', [
                              m('input[type=checkbox]', { onclick: m.withAttr('checked', task.done), checked: task.done() })
                            ]),
                            m('td', { style: { textDecoration: task.done() ? 'line-through' : 'none' }}, task.description())
                         ]);
                })
              ])
            ])
         ]);
};

m.mount(document, {controller: todo.controller, view: todo.view});