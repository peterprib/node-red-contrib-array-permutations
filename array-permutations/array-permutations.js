const logger = new (require("node-red-contrib-logger"))("array-permutations");
logger.sendInfo("Copyright 2020-2022 Jaroslav Peter Prib");

const combinations=require("./combinations.js");
const combinationLoop=require("./combinationLoop.js");
const permutations=require("./permutations.js");
const permutationLoop=require("./permutationLoop.js");
const permutationRandom=require("./permutationRandom.js");
const permutationsCallable=require("./permutationsCallable.js");
const permutationsCircular=require("./permutationsCircular.js");
const permutationsHeap=require("./permutationsHeap.js");
const permutationsUnique=require("./permutationsUnique.js");

// actions that ignore set size so array length is not validated against it
const noSetSize=["PermutationsCircular","PermutationsCircularMessages","PermutationsHeap","PermutationRandom"];
// loop actions keep their position on the message under this property
const loopStateProperty={Loop:"_arrayPerm",CombinationLoop:"_arrayCombo",PermutationLoop:"_arrayPermutations"};

// next set of indices, strictly increasing if unique else non decreasing, null when exhausted
function nextIndices(indices,n,k,unique){
	if(!indices) {
		if(k<1||n==0||(unique&&k>n)) return null;
		const start=[];
		for(let i=0;i<k;i++) start.push(unique?i:0);
		return start;
	}
	let i=k-1;
	while(i>=0 && indices[i]==(unique?n-k+i:n-1)) i--;
	if(i<0) return null;
	indices[i]++;
	for(let j=i+1;j<k;j++) indices[j]=unique?indices[j-1]+1:indices[i];
	return indices;
}
function sendClone(RED,node,msg,data,send,count){
	const newMsg=RED.util.cloneMessage(msg);
	node.setData(data,newMsg);
	newMsg._msgid=msg._msgid+":"+count;
	send(newMsg);
}
function sendEachClone(RED,node,msg,send){
	let count=0;
	return data=>sendClone(RED,node,msg,data,send,++count);
}
const sendData={
	Loop:function(RED,msg,dataArray,send) {
		if(logger.active) logger.send({label:"sendDataLoop",_arrayPerm:msg._arrayPerm||null});
		if(!msg._arrayPerm) msg._arrayPerm={array:dataArray,index:null};
		const base=msg._arrayPerm;
		base.index=nextIndices(base.index,base.array.length,this.setSize,this.unique);
		if(base.index==null) {
			delete msg._arrayPerm;
			this.setData(null,msg);
			send(msg);
			return;
		}
		this.setData(base.index.map(i=>base.array[i]),msg);
		send([null,null,msg]);
	},
	CombinationLoop:function(RED,msg,dataArray,send) {
		if(logger.active) logger.send({label:"sendDataCombinationLoop",_arrayCombo:msg._arrayCombo||null});
		if(!msg._arrayCombo) msg._arrayCombo={indices:null,dataArray:dataArray,setSize:this.setSize};
		combinationLoop(msg._arrayCombo,
			(combination)=>{
				this.setData(combination,msg);
				send([null,null,msg]);
			}
			,()=>{
				delete msg._arrayCombo;
				this.setData(null,msg);
				send(msg);
			});
	},
	Combinations:function(RED,msg,dataArray,send) {
		this.setData(combinations(dataArray,this.setSize),msg);
		send(msg);
	},
	CombinationMessages:function(RED,msg,dataArray,send) {
		combinations(dataArray,this.setSize,sendEachClone(RED,this,msg,send));
	},
	Messages:function(RED,msg,dataArray,send) {
		const call=sendEachClone(RED,this,msg,send);
		let indices=null;
		while((indices=nextIndices(indices,dataArray.length,this.setSize,this.unique))!=null)
			call(indices.map(i=>dataArray[i]));
	},
	Permutations:function(RED,msg,dataArray,send) {
		this.setData(permutations(dataArray,this.setSize),msg);
		send(msg);
	},
	PermutationsMessages:function(RED,msg,dataArray,send) {
		permutations(dataArray,this.setSize,sendEachClone(RED,this,msg,send));
		send(msg);
	},
	PermutationsCallable:function(RED,msg,dataArray,send) {
		this.setData(permutationsCallable(dataArray,this.setSize,this.unique),msg);
		send(msg);
	},
	PermutationsCallableMessages:function(RED,msg,dataArray,send) {
		permutationsCallable(dataArray,this.setSize,this.unique,sendEachClone(RED,this,msg,send));
		send(msg);
	},
	PermutationsCircular:function(RED,msg,dataArray,send) {
		this.setData(permutationsCircular(dataArray),msg);
		send(msg);
	},
	PermutationsCircularMessages:function(RED,msg,dataArray,send) {
		permutationsCircular(dataArray,sendEachClone(RED,this,msg,send));
		send(msg);
	},
	PermutationsHeap:function(RED,msg,dataArray,send) {
		this.setData(permutationsHeap(dataArray.slice()),msg);
		send(msg);
	},
	PermutationLoop:function(RED,msg,dataArray,send) {
		if(logger.active) logger.send({label:"PermutationLoop",_arrayPermutations:msg._arrayPermutations||null});
		if(!msg._arrayPermutations)
			msg._arrayPermutations={position:0,permutationStack:[{permutation:[],position:0}],dataArray:dataArray,setSize:this.setSize};
		permutationLoop(msg._arrayPermutations,this.unique,
			(permutation)=>{
				this.setData(permutation,msg);
				send([null,null,msg]);
			}
			,()=>{
				delete msg._arrayPermutations;
				this.setData(null,msg);
				send(msg);
			});
	},
	PermutationRandom:function(RED,msg,dataArray,send) {
		this.setData(permutationRandom(dataArray.slice()),msg);
		send(msg);
	},
	PermutationsUnique:function(RED,msg,dataArray,send) {
		this.setData(permutationsUnique(dataArray,this.setSize),msg);
		send(msg);
	},
	PermutationsUniqueMessages:function(RED,msg,dataArray,send) {
		permutationsUnique(dataArray,this.setSize,sendEachClone(RED,this,msg,send));
		send(msg);
	},
};
// names used by earlier versions
sendData.PermutationUnique=sendData.PermutationsUnique;
sendData.PermutationUniqueMessages=sendData.PermutationsUniqueMessages;

module.exports = function (RED) {
	function propertyPath(expression) {
		let path=(expression||"msg.payload").trim();
		if(path.startsWith("msg.")) path=path.substring(4);
		if(RED.util.normalisePropertyExpression) RED.util.normalisePropertyExpression(path);
		return path;
	}
	function arrayPermutationsNode(n) {
		if(logger.active) logger.send({label:"settings",node:n});
		RED.nodes.createNode(this, n);
		const node=Object.assign(this,n);
		node.unique=(node.unique===true||node.unique=="true");
		node.setSize=Number(node.setSize);
		node.arrayProperty=node.arrayProperty||"msg.payload";
		node.loopStateProperty=loopStateProperty[node.action];
		try{
			const arrayPath=propertyPath(node.arrayProperty),
				targetPath=propertyPath(node.arrayTarget);
			node.getData=msg=>RED.util.getMessageProperty(msg,arrayPath);
			node.setData=(data,msg)=>RED.util.setMessageProperty(msg,targetPath,data,true);
			if(!(node.action in sendData)) throw Error("Method function "+node.action+" not found");
			node.sendData=sendData[node.action].bind(node);
			if(!(noSetSize.includes(node.action)||Number.isInteger(node.setSize)&&node.setSize>0))
				throw Error("set size must be a positive integer");
			node.status({fill:"green",shape:"ring"});
		} catch(ex) {
			node.error(ex.message);
			node.status({fill:"red",shape:"ring",text:"Invalid setup "+ex.message});
		}

		node.on("input", function(msg,send,done) {
			send=send||function(){node.send.apply(node,arguments)};
			done=done||function(error){if(error) node.error(error,msg)};
			try {
				if(!node.sendData) throw Error("Invalid setup");
				if(node.loopStateProperty&&msg[node.loopStateProperty]) {
					node.sendData(RED,msg,null,send);
					done();
					return;
				}
				const dataArray=node.getData(msg);
				if(!(Array.isArray(dataArray))) throw Error(node.arrayProperty+" is not array");
				if(!noSetSize.includes(node.action)) {
					if(node.setSize>dataArray.length) throw Error("Set size of "+node.setSize+" > array "+dataArray.length);
					if(dataArray.length*node.setSize>100) node.status({fill:"yellow",shape:"ring",text:"large number messages array size: "+dataArray.length+" set size:"+node.setSize});
				}
				node.sendData(RED,msg,dataArray,send);
				done();
			} catch(ex) {
				if(logger.active) logger.sendError({error:ex.message,stack:ex.stack});
				node.status({fill:"red",shape:"ring",text:"Failure "+ex.message});
				msg.error=ex.message;
				send([null,msg]);
				done(ex.message);
			}
		});
	}
	RED.nodes.registerType("Array Permutations",arrayPermutationsNode);
};
