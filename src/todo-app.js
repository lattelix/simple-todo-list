(function () {
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(doId, name, done = false) {
    let item = document.createElement("li");
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    // устанавливаем стили для элемента списка, а так же для размещения кнопок
    // в его правой части при помощи flex
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = name;
    item.id = doId;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    if (done) {
      item.classList.add("list-group-item-success");
    }

    // вкладываем кноки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементы и кнопкам, чтобы обрабатывать события нажатия
    return {
      doId,
      item,
      doneButton,
      deleteButton,
    };
  }

  function appendTodoItems(todoStorage, title, todoList) {
    // Чистим список дел
    todoList.innerHTML = "";
    localStorage.setItem(title, JSON.stringify(todoStorage));

    for (let key in todoStorage) {
      let todoItem = createTodoItem(
        key,
        todoStorage[key].name,
        todoStorage[key].done
      );

      // добавляем обработчики на кнопки
      todoItem.doneButton.addEventListener("click", function (e) {
        todoItem.item.classList.toggle("list-group-item-success");
        if (todoItem.item.classList.contains("list-group-item-success")) {
          todoStorage[todoItem.item.id].done = true;
        } else {
          todoStorage[todoItem.item.id].done = false;
        }
        localStorage.setItem(title, JSON.stringify(todoStorage));
      });
      todoItem.deleteButton.addEventListener("click", function (e) {
        if (confirm("Вы уверены?")) {
          delete todoStorage[todoItem.item.id];
          todoItem.item.remove();
          localStorage.setItem(title, JSON.stringify(todoStorage));
        }
      });

      // создаём и добавляем в список новое дело с названием из поля ввода
      todoList.append(todoItem.item);
    }
  }

  function createTodoApp(container, title = "Список дел", list = false) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    var todoList = createTodoList();
    const todoStorage = {};

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    function isEmpty(obj) {
      for (let key in obj) {
        return false;
      }
      return true;
    }

    // работаем с localStorage
    // Записываю в localStorage переданный список, либо подствляю пустой
    if (
      (list && localStorage.getItem(title) == null) ||
      (list && isEmpty(JSON.parse(localStorage.getItem(title))))
    ) {
      localStorage.setItem(title, JSON.stringify(list));
    } else if (!list && localStorage.getItem(title) == null) {
      let defList = JSON.stringify([]);
      localStorage.setItem(title, defList);
    }

    // добавляю список дел из локального хранилища в объект
    Object.assign(todoStorage, JSON.parse(localStorage.getItem(title)));
    appendTodoItems(todoStorage, title, todoList);

    //  блокируем кнопку в самом начале при пустом поле ввода
    if (!todoItemForm.input.value) {
      todoItemForm.button.disabled = true;
    }
    // блокируем кнопку при вводе, если поле воода становиться пустым
    todoItemForm.form.addEventListener("input", function () {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      } else {
        todoItemForm.button.disabled = true;
      }
    });

    // браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener("submit", function (e) {
      // эта строчка необходима, чтобы предотвратить страндартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return;
      }

      let name = todoItemForm.input.value;
      let nextDo = Object.keys(todoStorage).length;
      todoStorage[nextDo] = { name: name, done: false };
      appendTodoItems(todoStorage, title, todoList);

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = "";

      // блокируем кнопку после добавления дела
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
