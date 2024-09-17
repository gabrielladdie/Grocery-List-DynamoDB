const {createItem, getItem, updateItem, deleteItem} = require('./groceryDAO');

let key = {
    itemName: 'Apples'
};

getItem(key)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    })
;

async function addItem(itemName, quantity, price, purchased) {
    let data = await createItem({itemName, quantity, price, purchased});
    console.log(data);
}

addItem("Oranges", 10, 2.5, false);
addItem("Bananas", 5, 1.5, false);

updateItem("Oranges", 15, 3.5, true);

deleteItem("Bananas");