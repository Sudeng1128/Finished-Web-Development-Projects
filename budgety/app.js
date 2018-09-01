var budgetController = (function () {
    // this function is used to keep track of our data
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentages = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }
    // attach to each new Expense obj is this method to find out its percent of total income

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function(ele){
            sum += ele.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function (type, des, val) {
            var newItem;
            var ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            } 
            // create new id

            if (type === 'expense') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'income') {
                newItem = new Income(ID, des, val);
            }
            // create newitem base on type inc or exp

            data.allItems[type].push(newItem);
            // pushes it into data structure
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids = data.allItems[type].map(function(ele){
                return ele.id;
            })
            var index = ids.indexOf(id);
            if (index > -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            calculateTotal('income');
            calculateTotal('expense');
            data.budget = data.totals.income - data.totals.expense;
            if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.expense.forEach(function(ele) {
                ele.calcPercentages(data.totals.income);
            })
        },

        getPercentages: function () {
            var allPercentages = data.allItems.expense.map(function(ele) {
                return ele.getPercentage();
            })
            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            }
        },

        test: function() {
            console.log(data.allItems);
        }
    }
})();

var UIController = (function () {
    // this function is used to manipulate the dom
    var formatNumber = function(num, type) {
        num = Math.abs(num);
        num = num.toFixed(2);
        var numSplit = num.split('.');
        var int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        var decimal = numSplit[1];
        return (type === 'income' ? '+' : '-') + ' ' + int + '.' + decimal;
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector('.add__type').value, // either inc or exp
                description: document.querySelector('.add__description').value,
                value: Number(document.querySelector('.add__value').value)
            }
        },

        addListItem: function(obj, type) {
            var html;
            var newHtml;
            var theList;

            if (type === 'income') {
                theList = '.income__list';
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'expense') {
                theList = '.expenses__list';
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            document.querySelector(theList).insertAdjacentHTML('beforeend', newHtml);
            // the above code inserts the data into the DOM
        },

        deleteListItem: function (selectorID) {
            document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID))
        },

        clearFields: function() {
            document.querySelector('.add__value').value = '';
            document.querySelector('.add__description').value='';
            document.querySelector('.add__description').focus();
        },

        displayBudget: function (obj) {
            obj.budget > 0 ? type = 'income' : type  = 'expense';
            document.querySelector('.budget__value').textContent = formatNumber(obj.budget, type);
            document.querySelector('.budget__income--value').textContent = obj.totalIncome;
            document.querySelector('.budget__expenses--value').textContent = obj.totalExpense;
            
            if (obj.percentage > 0) {
                document.querySelector('.budget__expenses--percentage').textContent = obj.percentage + '%';
            } else {
                document.querySelector('.budget__expenses--percentage').textContent = '---';
            }
        },

        displayPercentages: function(arr) {
            var fields = document.querySelectorAll('.item__percentage');
            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i += 1) {
                    callback(list[i], i);
                }
            }
            nodeListForEach(fields, function (current, index) {
                if (arr[index] > 0) {
                    current.textContent = arr[index] + '%';
                } else {
                    current.textContent = '---';
                }

            })
        },

        displayMonth: function () {
            var now  = new Date();
            var month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector('.budget__title--month').textContent = months[month - 1];
        }
    }
})();

var controller = (function (budgetCtrl, UICtrl) {
    // executes commands to manipulate the dom and record data
    var setupEventListeners = function () {
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
    
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })

        document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
        // reference ctrldeleteitem down later
    }

    var updateBudget = function() {
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
        console.log(budget);
    }

    var updatePercentages = function() {
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function () {
        var input = UICtrl.getInput();
        // UICtrl immediately calls it self and returns an object with a key in it called getInput
        if (input.description !== '' && input.value > 0) {
            var newItem = budgetController.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function (event) {
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // targets only the id of the item that is clicked
        if (itemID) {
            var splitID = itemID.split('-');
            var type = splitID[0];
            var ID = Number(splitID[1]);
            budgetCtrl.deleteItem(type, ID);
            // alters our data
            UICtrl.deleteListItem(itemID);
            // changes UI thro dom manipulation
            updateBudget();
            updatePercentages();
            budgetCtrl.test();
        }
    }

    return {
        init: function () {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            // sets everything to 0 at the start
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();