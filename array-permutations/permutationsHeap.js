const logger = new (require("node-red-contrib-logger"))("permutationHeap");
logger.sendInfo("Copyright 2022 Jaroslav Peter Prib");
// Generating permutation using Heap Algorithm
function permutationHeap(dataArray,call=(p,a=[])=>a.push(p),aggregate=[],clone=true) {
    if(clone) permutationHeapCloned(dataArray,call,aggregate)
    else permutationHeapNotCloned(dataArray,call,aggregate);
    return aggregate;
}
function permutationHeapCloned(dataArray,call,aggregate,size=dataArray.length) {
	if(size==1){
		call(dataArray.slice(0),aggregate); //clone
        return;
	}
	const lastOffset=size-1;
    if (size%2==1){
        for(let i=0; i<size; i++) {
    		permutationHeapCloned(dataArray,call,aggregate,lastOffset);
	    	if (i<lastOffset){
				const temp=dataArray[0];
				dataArray[0]=dataArray[lastOffset];
				dataArray[lastOffset]=temp;
            }
		}
	} else {
        for(let i=0; i<size; i++) {
            permutationHeapCloned(dataArray,call,aggregate,lastOffset);
            if (i<lastOffset){
                const temp=dataArray[i];
                dataArray[i]=dataArray[lastOffset];
                dataArray[lastOffset]=temp;
            }
        }
    }
}
function permutationHeapNotCloned(dataArray,call,aggregate,size=dataArray.length) {
	if(size==1){
		call(dataArray,aggregate);
        return;
	}
	const lastOffset=size-1;
    if (size%2==1){
        for(let i=0; i<size; i++) {
    		permutationHeapNotCloned(dataArray,call,aggregate,lastOffset);
	    	if (i<lastOffset){
				const temp=dataArray[0];
				dataArray[0]=dataArray[lastOffset];
				dataArray[lastOffset]=temp;
            }
		}
	} else {
        for(let i=0; i<size; i++) {
            permutationHeapNotCloned(dataArray,call,aggregate,lastOffset);
            if (i<lastOffset){
                const temp=dataArray[i];
                dataArray[i]=dataArray[lastOffset];
                dataArray[lastOffset]=temp;
            }
        }
    }
}
module.exports=permutationHeap;