/*
 * The MIT License (MIT)
 * Copyright (c) 2019. Wise Wild Web
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  @author : Nathanael Braun
 *  @contact : n8tz.js@gmail.com
 */

const path       = require('path'),
      assert     = require('assert'),
      packageCfg = JSON.parse(require('fs').readFileSync(__dirname + '/../package.json'));

// es6 require
require = require('@std/esm')(module, {
	cjs: true
});

describe(packageCfg.name + "@" + packageCfg.version + " : ", () => {
	let CartManager, myCart;
	describe('Cart Manager', function () {
		
		it('should be requireable via node', function () {
			// Try to include the lib via node require
			CartManager = require('..').default;
			assert.ok(!!CartManager, "Can't require the js module")
		});
		it('should instantiate CartManager fine', function () {
			// Try to include the lib via node require
			myCart = new CartManager();
			assert.ok(!!myCart, "Can't instanciate the js module")
		});
		it('should calc simple cart total fine', function () {
			myCart = new CartManager(
				{
					book1: {
						price: 10
					}
				}
			);
			// Simply create & sum simple cart list
			myCart.addToCart("book1", 3);
			assert.ok(myCart.getTotalPrice().total === 30, "CartManager fail on simple cart sum")
		});
		it('should calc with discount', function () {
			myCart = new CartManager(
				{
					book1: {
						id        : "book1",
						price     : 10,
						collection: "harry",
					},
					book2: {
						id        : "book2",
						price     : 10,
						collection: "harry",
					},
					book3: {
						id        : "book3",
						price     : 10,
						collection: "harry",
					}
				},
				{
					harry: [0, .05, .10, .20, .25]
				}
			);
			// Simply create & sum simple cart list
			myCart.addToCart("book1");
			myCart.addToCart("book2");
			assert.ok(myCart.getTotalPrice().total === ((10 + 10) - .05 * 20), "CartManager fail on simple cart sum with discount")
		});
		it('should sum cart maximizing the discounts', function () {
			/**
			 ·       2 copies of the first book
			 
			 ·       2 copies of the second book
			 
			 ·       2 copies of the third book
			 
			 ·       1 copy of the fourth book
			 
			 ·       1 copy of the fifth book
			 **/
			myCart = new CartManager(
				{
					book1: {
						id        : "book1",
						price     : 8,
						collection: "harry",
					},
					book2: {
						id        : "book2",
						price     : 8,
						collection: "harry",
					},
					book3: {
						id        : "book3",
						price     : 8,
						collection: "harry",
					},
					book4: {
						id        : "book4",
						price     : 8,
						collection: "harry",
					},
					book5: {
						id        : "book5",
						price     : 8,
						collection: "harry",
					}
				},
				{
					harry: [0, .05, .10, .20, .25]
				}
			);
			// Simply create & sum simple cart list
			myCart.addToCart("book1", 2);
			myCart.addToCart("book2", 2);
			myCart.addToCart("book3", 2);
			myCart.addToCart("book4");
			myCart.addToCart("book5");
			assert.ok(myCart.getTotalPrice().total === 51.20, "CartManager fail on complex cart sum with discount")
		});
	});
	
});