/*
 * Complete the 'longestSubsequence' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. STRING x (subsequence)
 *  2. STRING y (substring)
 */

function longestSubsequence( x, y ) {
	let hasbeenSeenMap = {},
	    tmpStr, tmpStack,
	    stack          = [''],
	    stackOcc       = [0],
	    stack2         = [],
	    max            = 0, z,
	    maxStr         = '';
	
	// enumerate subsequences of x..
	for ( let i = 0, sequencesCount; i < x.length; i++ ) {
		sequencesCount = stack.length;
		while ( sequencesCount-- >= 0 ) {
			tmpStr = stack[sequencesCount];
			
			// dedupe sequences
			if ( hasbeenSeenMap[tmpStr] ) {
				continue;
			}
			hasbeenSeenMap[tmpStr] = true;
			
			//if ( maxStr.indexOf(tmpStr) !== -1 && maxStr !== tmpStr )
			//	continue;
			
			// enumerate same sequence
			stack2.push(tmpStr);
			
			// enumerate new sequence starting from this char
			tmpStr += x[i];
			
			// enumerate new sequence if it's a new substring
			if ( tmpStr.length <= y.length && (z = y.indexOf(tmpStr) !== -1) ) {
				if ( tmpStr.length > max ) {
					max    = tmpStr.length;
					maxStr = tmpStr;
				}
				stack2.push(tmpStr);
			}
		}
		tmpStack        = stack;
		stack           = stack2;
		tmpStack.length = 0;
		stack2          = tmpStack;
		hasbeenSeenMap  = {};
	}
	console.log(maxStr, max, stack.length)
	return max;
}

let tests = [
	[
		"afbfc",
		"abc"
	],
	[
		"chackerRancks",
		"hackers"
	],
	[
		(chars => Array(chars).fill(' ').map(c => (Math.random().toString(36).substring(7)[0])).join(''))(100),
		(chars => Array(chars).fill(' ').map(c => (Math.random().toString(36).substring(7)[0])).join(''))(50)
	],
	[
		(chars => Array(chars).fill(' ').map(c => (Math.random().toString(36).substring(7)[0])).join(''))(1000),
		(chars => Array(chars).fill(' ').map(c => (Math.random().toString(36).substring(7)[0])).join(''))(500)
	],
	//[
	//	(chars => Array(chars).fill(' ').map(c => (Math.random().toString(36).substring(7)[0])).join(''))(10000),
	//	(chars => Array(chars).fill(' ').map(c => (Math.random().toString(36).substring(7)[0])).join(''))(5000)
	//]
]

for ( let i = 0; i < tests.length; i++ ) {
	console.time("test n°" + i)
	longestSubsequence(tests[i][0], tests[i][1]);
	console.timeEnd("test n°" + i)
}