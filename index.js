'use strict';
const store = {
  items: [
    { id: cuid(), name: 'apples', checked: false },
    { id: cuid(), name: 'oranges', checked: false },
    { id: cuid(), name: 'milk', checked: true },
    { id: cuid(), name: 'bread', checked: false }
  ],
  hideCheckedItems: false,
  rename: false
};

const generateItemElement = function (item) {
  let itemTitle = `<span class='shopping-item shopping-item__checked'>${item.name}</span>`;
  if (!item.checked) {
    itemTitle = `
     <span class='shopping-item'>${item.name}</span>
    `;
  }

  return `
    <li class='js-item-element' data-item-id='${item.id}'>
      ${itemTitle}
      <div class='shopping-item-controls'>
        <button class='shopping-item-toggle js-item-toggle'>
          <span class='button-label'>check</span>
        </button>
        <button class='shopping-item-delete js-item-delete'>
          <span class='button-label'>delete</span>
        </button>
      </div>
      <div>
        <input type="checkbox" id="change-checked" class="change-checked js-change-checked" />
        <label for="filter-checked">Change Item</label>
      </div>
    </li>
    <div class="form-popup" id="myForm">
    <form action="/action_page.php" class="form-container">
      <label for="shopping-list-entry">Change Item</label>
      <input type="text" name="shopping-list-entry" class="js-shopping-list-entry" placeholder="e.g., cabbage">
      <button type="submit">edit item</button>
    </form>

    <button type="button" class="btn cancel" onclick="closeForm()">Close</button>
  </form>
</div>
    `;
};

const generateShoppingItemsString = function (shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
};

/**
 * Render the shopping list in the DOM
 */
const render = function () {
  // Set up a copy of the store's items in a local 
  // variable 'items' that we will reassign to a new
  // version if any filtering of the list occurs.
  let items = [...store.items];
  // If the `hideCheckedItems` property is true, 
  // then we want to reassign filteredItems to a 
  // version where ONLY items with a "checked" 
  // property of false are included.
  if (store.hideCheckedItems) {
    items = items.filter(item => !item.checked);
  }
  
  if (store.rename){
    items = items.replace(item => !item.rename);
  }

  /**
   * At this point, all filtering work has been 
   * done (or not done, if that's the current settings), 
   * so we send our 'items' into our HTML generation function
   */
  const shoppingListItemsString = generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
};

const addItemToShoppingList = function (itemName) {
  store.items.push({ id: cuid(), name: itemName, checked: false });
};

const handleNewItemSubmit = function () {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    render();
  });
};

const toggleCheckedForListItem = function (id) {
  const foundItem = store.items.find(item => item.id === id);
  foundItem.checked = !foundItem.checked;
};

const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    render();
  });
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

/**
 * Responsible for deleting a list item.
 * @param {string} id 
 */
const deleteListItem = function (id) {
  // As with 'addItemToShoppingLIst', this 
  // function also has the side effect of
  // mutating the global store value.
  //
  // First we find the index of the item with 
  // the specified id using the native
  // Array.prototype.findIndex() method. 
  const index = store.items.findIndex(item => item.id === id);
  // Then we call `.splice` at the index of 
  // the list item we want to remove, with 
  // a removeCount of 1.
  store.items.splice(index, 1);
};

const handleDeleteItemClicked = function () {
  // Like in `handleItemCheckClicked`, 
  // we use event delegation.
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // Get the index of the item in store.items.
    const id = getItemIdFromElement(event.currentTarget);
    // Delete the item.
    deleteListItem(id);
    // Render the updated shopping list.
    render();
  });
};

/**
 * Toggles the store.hideCheckedItems property
 */
const toggleCheckedItemsFilter = function () {
  store.hideCheckedItems = !store.hideCheckedItems;
};

/**
 * Places an event listener on the checkbox 
 * for hiding completed items.
 */
const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    toggleCheckedItemsFilter();
    render();
  });
};

const changeListItem = function (id) {
    store.rename = !store.rename;
    
    //need to call popup form
    // function openForm() {
    //   document.getElementById("myForm").style.display = "block";
    // }
    
    // function closeForm() {
    //   document.getElementById("myForm").style.display = "none";
    // }

};

const handleChangeItemClicked = function () {
  $('.js-shopping-list').on('click', '#change-checked', event => {
    // Get the index of the item in store.items.
    const id = getItemIdFromElement(event.currentTarget);
    // change the item.
    changeListItem(id);
    // Render the updated shopping list.
    render();
  });
};


/**
 * This function will be our callback when the
 * page loads. It is responsible for initially 
 * rendering the shopping list, then calling 
 * our individual functions that handle new 
 * item submission and user clicks on the 
 * "check" and "delete" buttons for individual 
 * shopping list items.
 */
const handleShoppingList = function () {
  render();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleFilterClick();
  handleChangeItemClicked();
};

// when the page loads, call `handleShoppingList`
$(handleShoppingList);