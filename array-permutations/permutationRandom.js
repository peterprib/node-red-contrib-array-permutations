const logger = new (require("node-red-contrib-logger"))("permutationRandom");
logger.sendInfo("Copyright 2022 Jaroslav Peter Prib");
function swap(dataArray,a,b){
    const temp=dataArray[a];
    dataArray[a]=dataArray[b];
    dataArray[b]=temp;
}
function permutationRandom(dataArray,size=dataArray.length,necklace=true){
    return necklace==true?permutationRandomNecklace(dataArray,size):permutationRandomAll(dataArray,size)
}
function permutationRandomNecklace(dataArray){
    const n=dataArray.length;
    const l=n-1;
    for(let i=0; i<l; i++) {
        const j=i+Math.floor(Math.random()*(n-i));
        swap(dataArray,i,j);
    }
    return dataArray;
}
function permutationRandomAll(dataArray,size=dataArray.length){
    const n=dataArray.length;
    if(n==0 && size>0) throw Error("size >0 but no data in array")
    const resultSet=[];
    for(let i=0; i<size; i++) {
        const j=Math.floor(Math.random()*(n));
        resultSet.push(dataArray[j])
    }
    return resultSet;
}

module.exports=permutationRandom;