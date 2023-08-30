const fs = require("fs");
let nms = fs.readFileSync('./nums18.txt').toString().split('\n').map(item=>parseInt(item))
let arr = nms;
let ans = [];
let ninths = 0;
let twelves = 0;
let sevens = 0;
arr.map(item=>{
    if(item.toString().length == 9){
        ans.push(998000000000+item);
        ninths++;
    }
    else if (item.toString().length == 12){
        ans.push(item);
        twelves++;
    }
    else if (item.toString().length == 7){
        sevens++;
    }
})
console.log(ans.length);
console.log(ninths);
console.log(twelves);
console.log(sevens);
fs.writeFileSync('nums18-01.txt',ans.sort((a,b)=>a-b).join(','));
fs.writeFileSync('nums18-01-12.txt', ans.sort((a,b)=>a-b).join('\n'));