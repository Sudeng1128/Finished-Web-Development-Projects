// Storage controller
const StorageCtrl = (function() {
    // public methods
    return {
        
    }
})();

// Item Controller
const ItemCtrl = (function() {
    // item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // data structure / state
    const data = {
        items: [],
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return data.items;
        },

        addItem: function (name, calories) {
            let ID;
            // create id
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // calories to number
            calories = Number(calories);

            // create new item
            newItem = new Item(ID, name, calories);

            // adds to item array
            data.items.push(newItem);

            return newItem;
        },

        getTotalCalories: function () {
            let total = 0;

            // add up the calories
            data.items.forEach((item) => {
                total += item.calories;
            })

            data.totalCalories = total;

            return data.totalCalories;
        },

        getItemById: function (id) {
            let found = null;

            // loop thro items
            data.items.forEach((item) => {
                if (item.id === id) {
                    found = item;
                }
            })

            return found;
        },

        setCurrentItem: function (item) {
            data.currentItem = item;
        },

        getCurrentItem: function () {
            return data.currentItem;
        },

        updateItem: function (name, calories) {
            calories = Number(calories);
            let found = null;

            data.items.forEach((item)=>{
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })

            return found;
        },

        deleteItem: function (id) {
            const ids = data.items.map((item)=>{
                return item.id;
            })

            // get index
            const index = ids.indexOf(id);

            data.items.splice(index, 1);
        },

        clearAllItems: function () {
            data.items = [];
        },

        logData: function () {
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
    }

    return {
        populateItemList: function (items) {
            let html = '';
            // append item to html
            items.forEach((item) => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`
            });

            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },

        addListItem: function (item) {
            // create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="fa fa-pencil"></i>
            </a>`;
            // insert the li
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        
        getSelectors: function () {
            return UISelectors;
        },

        showTotalCalories: function(total) {
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },

        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        updateListItem: function(item) {
            let listItems = Array.from(document.querySelectorAll(UISelectors.listItems));
            listItems.forEach((listItem) => {
                // pulls the id of the each item
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="fa fa-pencil"></i>
                    </a>`;
                }
            })
        },

        deleteListItem: function(id) {
            document.querySelector(`#item-${id}`).remove();
        },

        clearAllItems: function () {
            let listItems = Array.from(document.querySelectorAll(UISelectors.listItems));
            listItems.forEach((item)=>{item.remove()});
        },

        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        }
    }

})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // load event listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();
        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // add icon click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // item update event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // item delete event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // clear all event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        // disable submit on enter
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })
    }

    // item add submit
    const itemAddSubmit = function(e) {
        // get form input from ui controller
        const input = UICtrl.getItemInput();
        
        // check for empty inputs
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // add item to UI
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            // clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const itemEditClick = function (e) {
        // select for the pencil icon
        if (e.target.classList.contains('fa')) {
            // get list item id
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = Number(listIdArr[1]);

            // get the item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    const itemUpdateSubmit = function (e) {
        // get item input
        const input = UICtrl.getItemInput();

        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // update ui with new list item
        UICtrl.updateListItem(updatedItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // delete button event
    const itemDeleteSubmit = function (e) {
        const currentItem = ItemCtrl.getCurrentItem();

        // delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // delete item from ui
        UICtrl.deleteListItem(currentItem.id);

         // get total calories
         const totalCalories = ItemCtrl.getTotalCalories();
         UICtrl.showTotalCalories(totalCalories);
 
         UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function () {
        ItemCtrl.clearAllItems();
        UICtrl.clearAllItems();

        // clear total
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();
    }
   
    // public methods
    return {
        init: function () {
            // init state
            UICtrl.clearEditState();

            console.log('app initialized');

            // fetch items
            const items = ItemCtrl.getItems();

            // populate list with items
            UICtrl.populateItemList(items);

             // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            // load event listners
            loadEventListeners();
        },
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();