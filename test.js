// es6 require
require = require('@std/esm')(module, {
	cjs: true
});

let CartManager = require('.').default;

let myCart = new CartManager({
	                             book1: {
		                             id              : "book1",
		                             price           : 8,
		                             collection      : "harry",
		                             sameCollDiscount: .05
	                             },
	                             book2: {
		                             id              : "book2",
		                             price           : 8,
		                             collection      : "harry",
		                             sameCollDiscount: .05
	                             },
	                             book3: {
		                             id              : "book3",
		                             price           : 8,
		                             collection      : "harry",
		                             sameCollDiscount: .05
	                             },
	                             book4: {
		                             id              : "book4",
		                             price           : 8,
		                             collection      : "harry",
		                             sameCollDiscount: .05
	                             },
	                             book5: {
		                             id              : "book5",
		                             price           : 8,
		                             collection      : "harry",
		                             sameCollDiscount: .05
	                             }
                             },
                             {
	                             harry: [0, .05, .10, .20, .25]
                             });
myCart.addToCart("book1", 2);
myCart.addToCart("book2", 2);
myCart.addToCart("book3", 2);
myCart.addToCart("book4");
myCart.addToCart("book5");

console.log(myCart.getTotalPrice())