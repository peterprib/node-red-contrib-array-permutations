# [node-red-contrib-array-permutations][1] <img src="array-permutations\icons\five-red-dice.png" width="100" height="50">


node-red function that takes an array then generates permutation sets of specified size of all cells in a loop, generation of cloned messages or an array containing all possible permutations. For loop then message sent to second output on return to input port it sends the next permutation in loop until all have been processed. 

![Array Permutations](documentation/arrayPermutations.png "Array Permutations") 

------------------------------------------------------------

# Install

Run the following command in the root directory of your Node-RED install or via GUI install

    npm install node-red-contrib-array-permutations

------------------------------------------------------------

# Test

Folder test contains a flow that tests the various combinations.

![Tests](documentation/tests.JPG "Tests") 

------------------------------------------------------------

# Version

0.0.6 fix Messages, Combination Loop, Loop with falsy values, Permutations Unique, Permutations Callable and editor methods that were missing at runtime. Property paths no longer evaluated as code. Removed unused "Array Combinations" type.

0.0.5 fix bug with perms, added circular, heap, unique, random

0.0.4 fix bug with loop and ensure all separated messages have unique id.

0.0.3 if error set msg.error and send to error port.  Fix bug with loop

0.0.1 base

# Author

[Peter Prib][3]

[1]: http://nodered.org "node-red home page"

[2]: https://www.npmjs.com/package/node-red-contrib-array-permutations "source code"

[3]: https://github.com/peterprib "base github"