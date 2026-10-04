const should=require("should");
const nodeDefinition=require("../array-permutations/array-permutations.js");
const helper=require("node-red-node-test-helper");
helper.init(require.resolve("node-red"));

const nodeType="Array Permutations";
function nodeConfig(config) {
	return Object.assign({id:"n1",type:nodeType,name:"test",arrayProperty:"msg.payload",arrayTarget:"msg.payload",setSize:2,unique:"true"},config);
}
// collects messages sent to each output; resolves when finished(results) is true or after a short quiet period
function runFlow(config,msg,finished) {
	return new Promise((resolve,reject)=>{
		const node=nodeConfig(config);
		node.wires=[["out"],["error"],["loop","n1"]];
		const flow=[node,{id:"out",type:"helper"},{id:"error",type:"helper"},{id:"loop",type:"helper"}];
		helper.load(nodeDefinition,flow,function() {
			const results={out:[],error:[],loop:[]};
			let timer;
			const settle=()=>{
				clearTimeout(timer);
				if(finished&&finished(results)) resolve(results);
				else timer=setTimeout(()=>resolve(results),finished?2000:100);
			};
			Object.keys(results).forEach(id=>helper.getNode(id).on("input",m=>{results[id].push(m);settle();}));
			try{
				helper.getNode("n1").receive(Object.assign({topic:"test"},msg));
			} catch(ex) {
				reject(ex);
			}
			settle();
		});
	});
}
const payloads=list=>list.map(m=>m.payload);

describe("Array Permutations node", function() {
	beforeEach(function(done) {
		helper.startServer(done);
	});
	afterEach(function(done) {
		helper.unload().then(()=>helper.stopServer(done));
	});
	it("loads", function(done) {
		helper.load(nodeDefinition,[nodeConfig({action:"Loop"})],function() {
			const n=helper.getNode("n1");
			n.should.have.property("setSize",2);
			n.should.have.property("unique",true);
			done();
		});
	});
	it("Messages unique", async function() {
		const r=await runFlow({action:"Messages"},{payload:[1,2,3]});
		payloads(r.out).should.eql([[1,2],[1,3],[2,3]]);
		r.out.map(m=>m._msgid.split(":")[1]).should.eql(["1","2","3"]);
		r.error.should.have.length(0);
	});
	it("Messages not unique", async function() {
		const r=await runFlow({action:"Messages",unique:"false"},{payload:[1,2,3]});
		payloads(r.out).should.eql([[1,1],[1,2],[1,3],[2,2],[2,3],[3,3]]);
	});
	it("Messages with falsy values and separate target", async function() {
		const r=await runFlow({action:"Messages",arrayTarget:"msg.set"},{payload:[0,"",false]});
		r.out.map(m=>m.set).should.eql([[0,""],[0,false],["",false]]);
		r.out.forEach(m=>m.payload.should.eql([0,"",false]));
	});
	it("Loop", async function() {
		const r=await runFlow({action:"Loop"},{payload:[0,1,2]},r=>r.out.length>0);
		payloads(r.loop).should.eql([[0,1],[0,2],[1,2]]);
		r.out.should.have.length(1);
		should(r.out[0].payload).be.null();
		r.out[0].should.not.have.property("_arrayPerm");
	});
	it("Combination Loop set size 3", async function() {
		const r=await runFlow({action:"CombinationLoop",setSize:3},{payload:[1,2,3,4,5]},r=>r.out.length>0);
		payloads(r.loop).map(p=>p.join("")).should.eql(["123","124","125","134","135","145","234","235","245","345"]);
		r.out.should.have.length(1);
	});
	it("Permutation Loop", async function() {
		const r=await runFlow({action:"PermutationLoop",unique:"false"},{payload:[1,2]},r=>r.out.length>0);
		payloads(r.loop).should.eql([[1,1],[1,2],[2,1],[2,2]]);
	});
	it("Combinations", async function() {
		const r=await runFlow({action:"Combinations"},{payload:[1,2,3]});
		payloads(r.out).should.eql([[[1,2],[1,3],[2,3]]]);
	});
	it("Combination Messages", async function() {
		const r=await runFlow({action:"CombinationMessages"},{payload:[1,2,3]});
		payloads(r.out).should.eql([[1,2],[1,3],[2,3]]);
		r.out.map(m=>m._msgid.split(":")[1]).should.eql(["1","2","3"]);
	});
	it("Permutations Messages", async function() {
		const r=await runFlow({action:"PermutationsMessages"},{payload:[1,2]});
		payloads(r.out).should.eql([[1,1],[1,2],[2,1],[2,2],[1,2]]);
	});
	it("Permutations Unique", async function() {
		const r=await runFlow({action:"PermutationsUnique"},{payload:[1,2,3]});
		payloads(r.out).should.eql([[[1,2],[1,3],[2,3]]]);
	});
	it("Permutations Unique Messages", async function() {
		const r=await runFlow({action:"PermutationsUniqueMessages"},{payload:[1,2,3]});
		payloads(r.out).should.eql([[1,2],[1,3],[2,3],[1,2,3]]);
	});
	it("Permutations Callable", async function() {
		const r=await runFlow({action:"PermutationsCallable",unique:"false"},{payload:[1,2]});
		payloads(r.out).should.eql([[[1,1],[1,2],[2,1],[2,2]]]);
	});
	it("Permutations Heap leaves input intact and ignores set size", async function() {
		const r=await runFlow({action:"PermutationsHeap",arrayTarget:"msg.result",setSize:5},{payload:[1,2,3]});
		r.out[0].result.should.have.length(6);
		r.out[0].payload.should.eql([1,2,3]);
	});
	it("Permutation Random", async function() {
		const r=await runFlow({action:"PermutationRandom",arrayTarget:"msg.result"},{payload:[1,2,3,4]});
		r.out[0].result.slice().sort().should.eql([1,2,3,4]);
		r.out[0].payload.should.eql([1,2,3,4]);
	});
	it("errors on non array to error port", async function() {
		const r=await runFlow({action:"Messages"},{payload:"x"});
		r.out.should.have.length(0);
		r.error.should.have.length(1);
		r.error[0].error.should.eql("msg.payload is not array");
	});
	it("errors when set size larger than array", async function() {
		const r=await runFlow({action:"Messages",setSize:4},{payload:[1,2,3]});
		r.error.should.have.length(1);
	});
	it("errors on unknown method", async function() {
		const r=await runFlow({action:"Unknown"},{payload:[1,2,3]});
		r.error.should.have.length(1);
	});
});
