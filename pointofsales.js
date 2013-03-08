/*  Point of Sales
 *
 *  This application should simulate a supermarket checkout scanner.
 *
 *  by Robin Hu. March 7, 2013.
 *
 * */

//Constructor for the CheckoutTerminal object.
function CheckoutTerminal() {
	this.priceData = {};
	this.scannedItems = {};
}


/* setPricing updates the pricing information for each store item.
 *
 * Data must be in special format. Example:
 * {  ItemA: {price: 2.00},
 *    ItemB: {price: 3.00, bulkUnit: 3, bulkPrice: 8}
 *
 * }
 *
 * This means 'ItemA' is $2 each. 'ItemB' is $3 each, or 3 for $8.
 *
 * */
CheckoutTerminal.prototype.setPricing = function( data ) {
	this.priceData = data;
};


/* Adds item to the list of scanned items.
 *
 * @precondition: User must have called setPricing() beforehand.
 * @postcondition: the item scanned is added to an internal data structure.
 * */
CheckoutTerminal.prototype.scan = function( itemName ) {
	if ( !this.priceData[ itemName ] ) {
		console.log(itemName + " does not exist in the pricing database.");
		return;
	}
	
	if ( !this.scannedItems[ itemName ])
		this.scannedItems[ itemName ] = 0;

	this.scannedItems[ itemName ]++;

};

//Clear all scanned items from the internal data structure.
CheckoutTerminal.prototype.clearAll = function() {
	this.scannedItems = {};
};

/* Calculates the total price of all items.
 * 
 * @precondition: setPricing() is called beforehand, and at least one item scanned.
 * @postcondition: the user is returned a floating point number representing the total cost of all items scanned.
 * */
CheckoutTerminal.prototype.calculateTotal = function() {
	var totalCost = 0.0;
	
	for(var itemName in this.scannedItems) {
		var priceDataObj = this.priceData[itemName];
		var unitsOfItem = this.scannedItems[itemName];

		if (priceDataObj.bulkUnit && priceDataObj.bulkPrice && priceDataObj.price) {
			totalCost += Math.floor(unitsOfItem / priceDataObj.bulkUnit) * priceDataObj.bulkPrice 
				     + (unitsOfItem % priceDataObj.bulkUnit) * priceDataObj.price;
		}
		else if (priceDataObj.price) {
			totalCost += unitsOfItem * priceDataObj.price;
		}
		else {
			console.log("Error: pricing info not found for: " + itemName);
		}
	
	}
	return totalCost;
};

var terminal = new CheckoutTerminal();
terminal.setPricing({
	"A": {price: 2, bulkUnit: 4, bulkPrice: 7},
	"B": {price: 12},
	"C": {price: 1.25, bulkUnit: 6, bulkPrice: 6},
	"D": {price: 0.15}
});

var unitTests = [
	{items: "ABCDABAA", expectedTotal: 32.40},
	{items: "CCCCCCC", expectedTotal: 7.25},
	{items: "ABCD", expectedTotal: 15.40},
];

for(var i = 0; i < unitTests.length; ++i) {
	terminal.clearAll();
	var items = unitTests[i].items;
	var expectedTotal = unitTests[i].expectedTotal;

	var itemList = items.split("");
	for(var k = 0; k < itemList.length; ++k) {
		terminal.scan(itemList[k]);
	}

	var actualTotal = terminal.calculateTotal();
	if ( actualTotal === expectedTotal) {
		console.log("Test passed for: " + items);
	}
	else {
		console.log("Test failed for: " + items + ". Expected: " + expectedTotal + ", actual: " + actualTotal);
	}
}


