const logger = new (require("node-red-contrib-logger"))("combinationLoop");
logger.sendInfo("Copyright 2022 Jaroslav Peter Prib");
// Emits one combination per call, keeping its position in arrayCombo.indices, then calls done when exhausted
function combinationLoop(arrayCombo,call,done){
	const n=arrayCombo.dataArray.length,
		k=arrayCombo.setSize;
	if(logger.active) logger.send({label:"combinationLoop",arrayCombo:arrayCombo});
	if(!arrayCombo.indices) {
		if(k<1||k>n) {
			done();
			return;
		}
		arrayCombo.indices=[];
		for(let i=0;i<k;i++) arrayCombo.indices.push(i);
	} else {
		const indices=arrayCombo.indices;
		let i=k-1;
		while(i>=0 && indices[i]==n-k+i) i--;
		if(i<0) {
			done();
			return;
		}
		indices[i]++;
		for(let j=i+1;j<k;j++) indices[j]=indices[j-1]+1;
	}
	call(arrayCombo.indices.map(i=>arrayCombo.dataArray[i]));
}
module.exports=combinationLoop;
