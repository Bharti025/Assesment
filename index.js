const express=require("express");
const fs=require("fs");    
const TARGET_DATE="30/Jan/2024";
const file="index.log";
const app=express();
app.set("view engine", "ejs"); 
function logs(){
const Data=fs.readFileSync(file,"utf-8");  //read File
const logData = Data.split("\n"); // Split file into lines

    const ipMap= new Map();
    const hourMap = new Map();
    let totalRequests = 0;
   logData.forEach((log)=>{
   const ans=log.split(" ");
   if(ans.length<4){
    return;
   }
const ip=ans[0];
const dateandTime=ans[3];
const date=dateandTime.substring(1,12);
const hour=dateandTime.substring(13,15);

 if(date===TARGET_DATE){
  ipMap.set(ip,(ipMap.get(ip)||0)+1);
  hourMap.set(hour,(hourMap.get(hour)||0)+1);
  totalRequests++;
 }
   });

   return {
    ipMap,
    hourMap,
    totalRequests
   }

   //ques1 part1
//    console.log("\nIP Address Occurrences:");
//     console.table([...ipMap.entries()]);
}
    //qus 1 part 2
    
const logDataResult=logs();
const {ipMap,hourMap,totalRequests}=logDataResult;

//ques 1part1
console.log("\nIP Map Occurences:");
console.table([...ipMap.entries()]);

//ques1 part2
console.log("\nHourly Traffic:");
console.table([...hourMap.entries()]);

const totalHourlyRequests = [...hourMap.values()].reduce((sum, count) => sum + count, 0);
console.log(`Total Requests (All Hours Combined): ${totalRequests}`);
console.log(`\nTotal Requests on ${TARGET_DATE}: ${totalRequests}`);

//ques 2 part1
const sortIP=[...ipMap.entries()].sort((a,b)=>b[1]-a[1]);
let sumIP=0;
const filterIP=sortIP.filter(([ip,count])=>{
sumIP+=count;
return sumIP <= totalRequests*0.85;
});
const outputIP=filterIP;

const ans=filterIP.map(([ip])=>ip);
console.log("Top IP contributing to 85% of traffic:", ans);

//ques 2 part 2
const sortedHours = [...hourMap.entries()].sort((a, b) => b[1] - a[1]);
let sumHour=0;
const filterHour=sortedHours.filter(([hour,count])=>{
    sumHour+=count;
    return sumHour <= totalRequests*0.70;
    });
    
const ans2=filterHour.map(([hour])=>hour);
console.log("Top hours contributing to 70% of traffic:", ans2);
console.log("outputIP",outputIP);
console.log("filterHour",filterHour);
app.get("/", (req, res) => {
    res.render("dashboard", {
        totalRequests,
        outputIP,
        filterHour,
        TARGET_DATE
    });
});


app.listen(8080,()=>{
    console.log("server is running");
});