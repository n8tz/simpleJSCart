/**
 * Night shift manager; abstract a night shift
 */
export default class CartManager {
	
	/**
	 * Return a CartManager
	 * * : Should use schemas
	 *
	 * @param bookById {Object} Books descriptors by id
	 *
	 *  Example : {
	 *               book4: {
	 *					id        : "book4",
	 *					price     : 8,
	 *					collection: "harry",
	 *				},
	 *			}
	 * @param discountsByCollection {Object} Discounts basing the number of distinct book counts, by collection
	 *  Example :
	 *           {
	 *				harry: [0, .05, .10, .20, .25]
	 *			}
	 */
	constructor( bookById, discountsByCollection = {} ) {
		this.data = { bookById, discountsByCollection, cart: [] };
		
	}
	
	/**
	 * Add 1 or multple book basing it's id
	 * @param itemId {string} the book id
	 * @param count {int} how much of this book to add ( default : 1 )
	 */
	addToCart( itemId, count = 1 ) {
		while ( count-- )
			this.data.cart.push(itemId);
	}
	
	/**
	 * Delete previously added books
	 */
	resetCart() {
		this.data.cart = [];
	}
	
	
	/**
	 * Calc the best total price basing the discounts
	 * @returns {{total: *, best: (Array|*)}|{total: number}}
	 */
	getTotalPrice() {
		let { bookById, discountsByCollection, cart } = this.data;
		
		// That's a Knapsack problem variation which is NP complete
		// Simplest approach is to enumerate..
		// Best approach is to deal with existing implementations like
		// https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/sets/knapsack-problem
		
		// There multiple approach to optimize,
		// This code keep a naive / simple to understand approach
		
		let i, y,
		    possibleCarts     = [[]],
		    nextPossibleCarts = [],
		    cCart,
		    nCart,
		    cBook,
		    baseCart          = [...cart];
		
		if ( baseCart.length === 0 )
			return { total: 0 };
		
		// for each book in the cart
		while ( baseCart.length ) {
			cBook = baseCart.pop();
			
			if ( !bookById[cBook] )
				throw new Error("The cart contain an unknown book : " + cBook);
			
			cBook = bookById[cBook];
			
			// enumerate possibilities
			while ( possibleCarts.length ) {
				cCart = possibleCarts.pop();
				
				// first enumerate add it alone case
				nextPossibleCarts.push([...cCart, cBook]);
				
				// then enumerate possible associations..
				for ( i = 0; i < cCart.length; i++ ) {
					
					if (// array are collections, if this is the same collection & there discount
						cBook.collection
						&& Array.isArray(cCart[i])
						&& discountsByCollection[cBook.collection]
						&& cBook.collection === cCart[i][0].collection
					) {
						// if the collection doesn't contain this book enumerate..
						if ( !cCart[i].includes(cBook) ) {
							nCart    = [...cCart];
							nCart[i] = [...nCart[i], cBook];
							nextPossibleCarts.push(nCart);
						}
					}
					else if ( // same collection !== book : enumerate new collection
						cBook.collection
						&& cBook.collection === cCart[i].collection
						&& cBook.id !== cCart[i].id
					) {
						nCart    = [...cCart];
						nCart[i] = [nCart[i], cBook];
						nextPossibleCarts.push(nCart);
					}
				}
			}
			possibleCarts     = nextPossibleCarts;
			nextPossibleCarts = [];
		}
		
		// now get the best option
		let discount,
		    tmpTotal,
		    priceStack = [],
		    minPrice   = Infinity,
		    best       = 0;
		
		for ( i = 0; i < possibleCarts.length; i++ ) {
			cCart         = possibleCarts[i];
			priceStack[i] = 0;
			
			for ( y = 0; y < cCart.length; y++ ) {
				if ( Array.isArray(cCart[y]) ) {// add discount on collections
					// get the applicable discount
					discount = discountsByCollection[cCart[y][0].collection][cCart[y].length - 1];
					
					// sum da collection
					tmpTotal = cCart[y].reduce(( total, book ) => (total + book.price), 0);
					
					// apply the discount
					tmpTotal = tmpTotal - tmpTotal * discount;
					priceStack[i] += tmpTotal;
				}
				else {
					priceStack[i] += cCart[y].price;
				}
			}
			if ( minPrice > priceStack[i] ) {
				best     = i;
				minPrice = priceStack[i];
			}
		}
		
		return {
			total: priceStack[best],
			best : possibleCarts[best]
		}
		
	}
	
}