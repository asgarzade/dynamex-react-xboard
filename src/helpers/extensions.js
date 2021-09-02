Array.prototype.update = function(array, updatedItem, identificator) {
    return array.map(array_item => array_item[identificator] === updatedItem[identificator] ? updatedItem : array_item);
}