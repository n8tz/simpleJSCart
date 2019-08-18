import fastSort from "fast-sort";


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
	 *
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
	 * @returns {{total: number, best: (Array|*)}|{total: number}}
	 */
	getTotalPrice() {
		let { bookById, discountsByCollection, cart } = this.data;
		
		// I think it's Knapsack problem variation which is NP complete
		// Simplest approach is to enumerate & dedupe..
		// Best approach is to deal with existing implementations like
		// https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/sets/knapsack-problem
		
		// There multiple approach to optimize,
		// This code keep a naive / simple to understand approach
		//
		
		let i, y,
		    possibleCarts     = [[]],
		    nextPossibleCarts = [],
		    alreadySeenNode   = {},
		    cCart,
		    nCart,
		    cBook,
		    baseCart          = [...cart],
		    nodeKey;
		
		if ( baseCart.length === 0 )
			return { total: 0 };
		
		// for each book in the cart
		while ( baseCart.length ) {
			cBook = baseCart.pop();
			
			if ( !bookById[cBook] )
				throw new Error("The cart contain an unknown book : " + cBook);
			
			
			// enumerate possibilities
			while ( possibleCarts.length ) {
				cCart = possibleCarts.pop();
				
				// Simple minimal optim : dedupe / avoid explorating equivalent carts multiple times
				// Make a stable key which will be the same for equivalents carts
				cCart   = fastSort(cCart).desc(item => (Array.isArray(item) ? "_" + item.length : item));
				nodeKey = cCart.map(( item ) => (Array.isArray(item) ? "[" + item + "]" : item)).join('+');
				
				// ignore the cart an equivalent was processed
				if ( alreadySeenNode[nodeKey] )
					continue;
				alreadySeenNode[nodeKey] = true;
				
				// first enumerate add it alone case
				nextPossibleCarts.push([...cCart, cBook]);
				
				// then enumerate possible associations..
				for ( i = 0; i < cCart.length; i++ ) {
					
					if (// array are collections, if this is the same collection & there discount
						bookById[cBook].collection
						&& Array.isArray(cCart[i])
						&& discountsByCollection[bookById[cBook].collection]
						&& bookById[cBook].collection === bookById[cCart[i][0]].collection
					) {
						// if the collection doesn't contain this book enumerate..
						if ( !cCart[i].includes(cBook) ) {
							nCart    = [...cCart];
							nCart[i] = fastSort([...nCart[i], cBook]).asc();
							nextPossibleCarts.push(nCart);
						}
					}
					else if ( // same collection !== book : enumerate new collection
						bookById[cBook].collection
						&& bookById[cBook].collection === bookById[cCart[i]].collection
						&& cBook !== cCart[i]
					) {
						nCart    = [...cCart];
						nCart[i] = fastSort([nCart[i], cBook]).asc();
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
					discount = discountsByCollection[bookById[cCart[y][0]].collection][cCart[y].length - 1];
					
					// sum da collection
					tmpTotal = cCart[y].reduce(( total, bookId ) => (total + bookById[bookId].price), 0);
					
					// apply the discount
					tmpTotal = tmpTotal - tmpTotal * discount;
					priceStack[i] += tmpTotal;
				}
				else {
					priceStack[i] += bookById[cCart[y]].price;
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