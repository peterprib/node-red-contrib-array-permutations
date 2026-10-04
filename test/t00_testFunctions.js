const assert=require('assert');
const should=require("should");
const combinations=require("../array-permutations/combinations.js");
const permutations=require("../array-permutations/permutations.js");
const permutationsCircular=require("../array-permutations/permutationsCircular.js");
const permutationsUnique=require("../array-permutations/permutationsUnique.js");
const permutationsHeap=require("../array-permutations/permutationsHeap.js");
const permutationsCallable=require("../array-permutations/permutationsCallable.js");
const permutationRandom=require("../array-permutations/permutationRandom.js");
const permutationLoop=require("../array-permutations/permutationLoop.js");

const array0=[];
const array1=[1];
const array2=[1,2];
const array2circular=[[1,2],[2,1]];
const array2all=[[1,1],[1,2],[2,1],[2,2]];
const array2s1=[[1],[2]]
const array3=[1,2,3];
const array3circular=[[1,2,3],[3,1,2],[2,3,1]];
const array3unique=[[1,2],[1,3],[2,3]];
const array3u2=[[2,1],[3,1 ],[3,2]]
const array3all=[
	[ 1, 1, 1 ], [ 1, 1, 2 ], [ 1, 1, 3 ],
	[ 1, 2, 1 ], [ 1, 2, 2 ], [ 1, 2, 3 ],
	[ 1, 3, 1 ], [ 1, 3, 2 ], [ 1, 3, 3 ],
	[ 2, 1, 1 ], [ 2, 1, 2 ], [ 2, 1, 3 ],
	[ 2, 2, 1 ], [ 2, 2, 2 ], [ 2, 2, 3 ],
	[ 2, 3, 1 ], [ 2, 3, 2 ], [ 2, 3, 3 ],
	[ 3, 1, 1 ], [ 3, 1, 2 ], [ 3, 1, 3 ],
	[ 3, 2, 1 ], [ 3, 2, 2 ], [ 3, 2, 3 ],
	[ 3, 3, 1 ], [ 3, 3, 2 ], [ 3, 3, 3 ] 
]
const array3s1=[[1],[2],[3]]
const array4=[1,2,3,4];
const array4unique=[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]];
const array4u2=[[2,1],[2,3],[2,4],[3,1],[3,4],[4,1]];
const array4u3=[[2,3,1],[2,3,4],[2,4,1],[3,4,1]]
const array4all=[
	[ 1, 2, 3, 4 ], [ 2, 1, 3, 4 ],
	[ 3, 1, 2, 4 ], [ 1, 3, 2, 4 ],
	[ 2, 3, 1, 4 ], [ 3, 2, 1, 4 ],
	[ 4, 2, 1, 3 ], [ 2, 4, 1, 3 ],
	[ 1, 4, 2, 3 ], [ 4, 1, 2, 3 ],
	[ 2, 1, 4, 3 ], [ 1, 2, 4, 3 ],
	[ 1, 3, 4, 2 ], [ 3, 1, 4, 2 ],
	[ 4, 1, 3, 2 ], [ 1, 4, 3, 2 ],
	[ 3, 4, 1, 2 ], [ 4, 3, 1, 2 ],
	[ 4, 3, 2, 1 ], [ 3, 4, 2, 1 ],
	[ 2, 4, 3, 1 ], [ 4, 2, 3, 1 ],
	[ 3, 2, 4, 1 ], [ 2, 3, 4, 1 ]
];
const array5=[1,2,3,4,5];
const array10=[1,2,3,4];
function test(f,a,e){
	it('set '+a.join(), function(done) {
		const r=f(a).sort()
		console.log("a=",a)
		console.log("r=",r)
		assert.deepEqual(r,e.sort())
		done();
    });
}
function testShuffle(f,a){
	it('set '+a.join(), function(done) {
		const sorted=a.slice(0).sort();
		let changed=false;
		for(let i=0;i<50;i++) {
			const r=f(a.slice(0));
			assert.deepEqual(r.slice(0).sort(),sorted) // same members
			if(r.join()!=a.join()) changed=true;
		}
		assert.ok(changed,"never shuffled")
		done();
    });
}
function testSize(f,size,a,e,unique){
	it('set '+a.join()+' size: '+size, function(done) {
		const r=f(a,size,unique).sort()
		console.log("=",r)
		assert.deepEqual(r,e.sort())
		done();
    });
}
describe('permutations', function() {
	test(permutations,array0,array0);
	test(permutations,array1,[array1]);
	test(permutations,array2,array2all);
	test(permutations,array3,array3all);
});
describe('permutationsCircular', function() {
	test(permutationsCircular,array0,[]);
	test(permutationsCircular,array1,[array1]);
	test(permutationsCircular,array2,array2circular);
	test(permutationsCircular,array3,array3circular);
});
describe('permutationsUnique', function() {
    test(permutationsUnique,array0,array0);
    test(permutationsUnique,array1,[array1]);
    test(permutationsUnique,array2,[array2]);
    testSize(permutationsUnique,1,array2,array2s1);
    testSize(permutationsUnique,2,array2,[array2]);
    testSize(permutationsUnique,3,array3,[array3]);
    testSize(permutationsUnique,1,array3,array3s1);
	testSize(permutationsUnique,2,array3,array3unique);
	testSize(permutationsUnique,2,array4,array4unique);
});

describe('permutationsHeap ', function() {
    test(permutationsHeap,array0,array0);
    test(permutationsHeap,array1,[array1]);
	test(permutationsHeap,array2,[[1,2],[2,1]]);
	test(permutationsHeap,array3,[
		[ 1, 2, 3 ],
		[ 2, 1, 3 ],
		[ 3, 1, 2 ],
		[ 1, 3, 2 ],
		[ 2, 3, 1 ],
		[ 3, 2, 1 ]
	  ]);
	test(permutationsHeap,array4,[
			[ 1, 2, 3, 4 ], [ 2, 1, 3, 4 ],
			[ 3, 1, 2, 4 ], [ 1, 3, 2, 4 ],
			[ 2, 3, 1, 4 ], [ 3, 2, 1, 4 ],
			[ 4, 2, 1, 3 ], [ 2, 4, 1, 3 ],
			[ 1, 4, 2, 3 ], [ 4, 1, 2, 3 ],
			[ 2, 1, 4, 3 ], [ 1, 2, 4, 3 ],
			[ 1, 3, 4, 2 ], [ 3, 1, 4, 2 ],
			[ 4, 1, 3, 2 ], [ 1, 4, 3, 2 ],
			[ 3, 4, 1, 2 ], [ 4, 3, 1, 2 ],
			[ 4, 3, 2, 1 ], [ 3, 4, 2, 1 ],
			[ 2, 4, 3, 1 ], [ 4, 2, 3, 1 ],
			[ 3, 2, 4, 1 ], [ 2, 3, 4, 1 ]
		  ]);
});
describe('permutationCallable', function(){
	test(permutationsCallable,array0,array0);
	test(permutationsCallable,array1,[array1]);
	test(permutationsCallable,array2,array2all);
	testSize(permutationsCallable,1,array2,array2s1);
	testSize(permutationsCallable,1,array3,array3s1);
});
describe('permutationCallable Unique', function(){
	testSize(permutationsCallable,undefined,array0,array0,true);
	testSize(permutationsCallable,undefined,array1,[array1],true);
	testSize(permutationsCallable,undefined,array2,[array2],true);
	testSize(permutationsCallable,1,array2,array2s1,true);
	testSize(permutationsCallable,1,array3,array3s1,true);
	testSize(permutationsCallable,2,array3,array3u2,true);
	testSize(permutationsCallable,2,array4,array4u2,true);
	testSize(permutationsCallable,3,array4,array4u3,true);
});
describe('combinations', function(){
	test(combinations,array0,array0);
	test(combinations,array1,[array1]);
	test(combinations,array2,[array2]);
	test(combinations,array3,[array3]);
	testSize(combinations,2,array3,[[2,1],[3,1],[3,2]]);
	testSize(combinations,2,array4,[[2,1],[2,3],[2,4],[3,1],[3,4],[4,1]]);
	testSize(combinations,3,array4,[[2,3,1],[2,3,4],[2,4,1],[3,4,1]]);
});
describe('permutationRandom', function(){
	test(permutationRandom,array0,array0);
	test(permutationRandom,array1,array1);
	testShuffle(permutationRandom,array2);
	testShuffle(permutationRandom,array3);
	testShuffle(permutationRandom,array4);
});
describe('permutationRandom all', function(){
	it('all', function(done) {
	//	console.log("=",permutationRandom(array0,2,false));
		console.log("=",permutationRandom(array1,2,false));
		console.log("=",permutationRandom(array2,2,false));
		console.log("=",permutationRandom(array3,2,false));
		console.log("=",permutationRandom(array4,2,false));
		console.log("=",permutationRandom(array5,2,false));
		console.log("10=",permutationRandom(array10,2,false));
		done();
    });
});