/*
SELECTS THE THEME STORED IN LOCALSTORAGE, IF NOTHING IS STORED
SELECT THE DEFAULT THEME
*/
const currentTheme = localStorage.getItem('theme') || 'dark-mode';
document.body.classList.add(currentTheme);
//SELECT THEME TOGGLER BUTTON
const toggle_theme = document.querySelector('.toggle-theme');

toggle_theme.addEventListener('click', () => {
    // TOGGLE THE CLASS IN BODY ELEMENT
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');

    // SAVE THE CURRENT THEME TO LOCALSTORAGE
    const newTheme = document.body.classList.contains('light-mode') ? 'light-mode' : 'dark-mode';
    localStorage.setItem('theme', newTheme)
});

// CRUD USING LOCALSTORAGE
const input = document.querySelector(".addTodo");
const checkbox = document.querySelector("#createCheckBox");
const list = document.querySelector('.list');
const total_items = document.querySelector('.total-items');
let num_of_items = 0;

// INITIALIZE TODO LIST
getTodoList();

// ADD TODO
input.addEventListener("keydown", function(event) {
  const todos = JSON.parse(localStorage.getItem('todoList')) || [];
  if (event.keyCode === 13) {
    event.preventDefault(); // PREVENT DEFAULT "ENTER" KEY BEHAVIOR

    const btn_active = document.querySelector(".btnActive");
    const btn_completed = document.querySelector(".btnCompleted");
    const is_btnActive = btn_active.classList.contains('active');
    const is_btnCompleted = btn_completed.classList.contains('active');

    if((is_btnActive && checkbox.checked === false) || (is_btnCompleted && checkbox.checked === false)) {
        createTodo (todos, false, getActive);
    } else if ((is_btnCompleted && checkbox.checked === true) || (is_btnActive && checkbox.checked === true)) {
        createTodo (todos, true, getCompleted);
    } else {
        if(checkbox.checked) {
            createTodo (todos, true, getTodoList);
        } else {
            createTodo (todos, false, getTodoList);
        }
    }
  }
});

// DRAG TO REORDER AND SAVE NEWLY REORDERED LIST
const sortable = new Sortable(list, {
    animation: 150,
    filter: '.filtered',
    onEnd: function(evt) {
        const items = evt.target.children;
        const newTodos = [];

        for (let i = 0; i < items.length; i++) {
            const todoId = parseInt(items[i].querySelector('input').id);
            const todoText = items[i].querySelector('p').textContent;
            const todoCompleted = items[i].querySelector('input').checked;
            newTodos.push({id: todoId, todo: todoText, completed: todoCompleted});
        }
        //console.log(newTodos); // Check the console to see the updated list
        localStorage.setItem("todoList", JSON.stringify(newTodos));
        getTodoList();
    }
});

// INITIAL TODO LIST
function getTodoList () {

    // INITIALIZE IT WITH EMPTY SO THAT WE CAN 
    // REPLACE IT WITH NEW VALUES WHEN getTodoList IS CALLED
    const todos = JSON.parse(localStorage.getItem('todoList')) || [];
    const insTodo1 = {
        id: 1,
        todo: "This todo is marked as complete",
        completed: true
    }
    const insTodo2 = {
        id: 2,
        todo: "Drag and drop to reorder items on the list",
        completed: false
    };
    const insTodo3 = {
        id: 3,
        todo: "Filter by All/Active/Complete todos",
        completed: false
    };
    const insTodo4 = {
        id: 4,
        todo: "Toggle light and dark mode",
        completed: false
    };

    // IF LOCALSTORAGE IS EMPTY INSERT SAMPLE TODO LIST
    if (todos.length === 0) {
        todos.push(insTodo1, insTodo2, insTodo3, insTodo4);
        localStorage.setItem("todoList", JSON.stringify(todos));
    }

    // IF COMPLETED BUTTON IS NOT ACTIVE MAKE IT ACTIVE
    const btnActive = document.querySelectorAll(".btnAll");
    btnActive.forEach((btnActive) => {
        const isactive = btnActive.classList.contains('active');
        if(!isactive) {
            btnActive.classList.add('active');
        }
    });
    // IF COMPLETED BUTTON IS ACTIVE UNSET ACTIVE TO ANY OTHER BUTTONS
    const btnUnset = document.querySelectorAll(".btnActive, .btnCompleted");
    btnUnset.forEach((btnUnset) => {
        const isactive = btnUnset.classList.contains('active');
        if(isactive) {
            btnUnset.classList.remove('active');
        }
    });

    // TODO LIST
    todoList(todos, '');
    is_todoChecked(todos, getTodoList);

    // TOTAL NUMBER OF ITEMS, INCREASES EACH ADD, DECREASES EACH DELETE
    const count_items = document.querySelectorAll('.list-items.todo').length;
    total_items.innerHTML = `${count_items} item${count_items !== 1 ? 's' : ''} left`;

    // FILTER BUTTONS
    const btn_all = document.querySelectorAll(".btnAll");
    const btn_active = document.querySelectorAll(".btnActive");
    const btn_completed = document.querySelectorAll(".btnCompleted");
    // DISPLAY ALL TODO LIST BUTTON
    btn_all.forEach((btn_all) => {
        btn_all.addEventListener('click', getTodoList);
    });
    // DISPLAY ALL ACTIVE TODO LIST BUTTON
    btn_active.forEach((btn_active) => {
        btn_active.addEventListener('click', getActive);
    });
    // DISPLAY ALL COMPLETED LIST BUTTON
    btn_completed.forEach((btn_completed) => {
        btn_completed.addEventListener('click', getCompleted);
    });

    // DELETE "X" BUTTON
    deleteButton(getTodoList);

    // REMOVE ALL COMPLETED TODO LIST
    const btn_clear_completed = document.querySelector(".btnClearCompleted");
    btn_clear_completed.addEventListener('click', clearCompleted);
}

// CREATE TODO LIST
function createTodo (todoList, is_completed, updateList) {
    todoList.push({
        id: Date.now(),
        todo: input.value,
        completed: is_completed
    });
    localStorage.setItem("todoList", JSON.stringify(todoList));

    updateList();
}

// TOGGLE CHECK BOX AND UPDATE IT
function is_todoChecked (todos, updateList) {
    const getList = document.querySelectorAll('.checkbox');
    getList.forEach(getList => {
        //const checkbox = getList.children[0].children[0];
        getList.addEventListener('change', event => {

            const checkboxId = Number(event.target.id);
            // FIND THE INDEX OF THE OBJECT WITH THE MATCHING ID
            const todoIndex = todos.findIndex(todo => todo.id === checkboxId);
            // IF THE OBJECT WAS FOUND
            if (todoIndex > -1) {
                const todo = todos[todoIndex];
                todo.completed = !todo.completed; // TOGGLE THE PROPERTY
                todos[todoIndex] = todo;
                localStorage.setItem('todoList', JSON.stringify(todos)); // UPDATE THE STORAGE
                updateList();
            }
        });
    });
}

// TODO LIST 
function todoList (filteredItems, filtered) {

    // EMPTY ON INITIALIZATION TO AVOID OVERLAPPING DISPLAYED DATA
    list.innerHTML = '';
    total_items.innerHTML = '';
    num_of_items = 0;

    filteredItems.forEach( todo => {  
        num_of_items++;
        const newItem = document.createElement('div');
        newItem.className = `list-items todo ${filtered === 'filtered' ? 'filtered' : ''} ${todo.completed === true ? 'completed' : 'active'}`;
        newItem.innerHTML = `<div class="round-checkbox">
            <input type="checkbox" class="checkbox" id="${todo.id}" ${todo.completed === true ? 'checked' : ''}/>
            <label for="${todo.id}" class="checkbox-label"></label>
            <p class="list-items_item">${todo.todo}</p>
            </div>
            <a href="javascript:void(0)" role="button" class="btn-delete" data-delete-id="${todo.id}"></a>`;
        list.appendChild(newItem);
    });
    // TOTAL NUMBER OF ITEMS, INCREASES EACH ADD, DECREASES EACH DELETE
    total_items.innerHTML = `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''} left`;

}

// FILTER ACTIVE TODO LIST
function getActive () {

    const btn_active = document.querySelectorAll(".btnActive");
    btn_active.forEach((btn_active) => {
        const isactive = btn_active.classList.contains('active');
        if(!isactive) {
            btn_active.classList.add('active');
        }
    });

    const btnUnset = document.querySelectorAll(".btnCompleted, .btnAll");
    btnUnset.forEach((btnUnset) => {
        const isactive = btnUnset.classList.contains('active');
        if(isactive) {
            btnUnset.classList.remove('active');
        }
    });

    const todos = JSON.parse(localStorage.getItem('todoList')) || [];
    const filteredItems = todos.filter(item => !item.completed);
    //console.log(filteredItems);
    
    // TODO LIST
    todoList(filteredItems, 'filtered');
    is_todoChecked(todos, getActive);

    // DELETE "X" BUTTON
    deleteButton(getActive);
}

// FILTER COMPLETED TODO LIST
function getCompleted () {

    // IF COMPLETED BUTTON IS NOT ACTIVE MAKE IT ACTIVE
    const btn_completed = document.querySelectorAll(".btnCompleted");
    btn_completed.forEach((btn_completed) => {
        const isactive = btn_completed.classList.contains('active');
        if(!isactive) {
            btn_completed.classList.add('active');
        }
    });
    // IF COMPLETED BUTTON IS ACTIVE UNSET ACTIVE TO ANY OTHER BUTTONS
    const btnUnset = document.querySelectorAll(".btnActive, .btnAll");
    btnUnset.forEach((btnUnset) => {
        const isactive = btnUnset.classList.contains('active');
        if(isactive) {
            btnUnset.classList.remove('active');
        }
    });

    const todos = JSON.parse(localStorage.getItem('todoList')) || [];
    const filteredItems = todos.filter(item => item.completed);
    //console.log(filteredItems);

    // TODO LIST
    todoList(filteredItems, 'filtered');
    is_todoChecked(todos, getCompleted);

    // DELETE "X" BUTTON
    deleteButton(getCompleted);
}

// DELETE TODO
function deleteButton(updateList) {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.deleteId;
            const todos = JSON.parse(localStorage.getItem('todoList')) || [];
            const filteredTodos = todos.filter(todo => todo.id != itemId);
            localStorage.setItem('todoList', JSON.stringify(filteredTodos));
            // RERENDER THE UPDATED LIST FOR EACH DELETE
            updateList();
        });
    });
}

// DELETE ALL COMPLETED TODO LIST
function clearCompleted () {

    const todos = JSON.parse(localStorage.getItem('todoList')) || [];
    const filteredItems = todos.filter(item => !item.completed);
    localStorage.setItem('todoList', JSON.stringify(filteredItems));
    // RERENDER THE UPDATED LIST

    const element = document.querySelectorAll('.list-items.todo');
    element.forEach(element => {
        const completedEl =  element.classList.contains('completed');
        // IF STATEMENT IS TRUE REMOVE AN ELEMENT AND UPDATE THE NUMBER OF ITEMS
        if(completedEl) {
            element.remove();
            total_items.innerHTML = '';
            const count_items = document.querySelectorAll('.list-items.todo').length;
            total_items.innerHTML = `${count_items} item${count_items !== 1 ? 's' : ''} left`;
        }
    });
}