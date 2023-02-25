#!/bin/env node
const {spawn}=require("child_process");

const serverPath="server";
const serverJar="paper-1.12.2.jar"

let errorCounter=0;

process.chdir(serverPath);
const minecraftServerProcess = spawn("java", [
	"-Xmx1G",
	"-jar",
	serverJar,
	"nogui",
]);

function log(data,mode){
	if(mode=="stdout"){
		process.stdout.write(data.toString());
	}
	else if(mode=="stderr"){
		errorCounter+=1;
		process.title=errorCounter;
	}
}
minecraftServerProcess.stdout.on("data",data=>log(data,"stdout"));
minecraftServerProcess.stderr.on("data",data=>log(data,"stderr"));

console.log("Starte...");

process.stdin.on("data",data=>{
	minecraftServerProcess.stdin.write(data.toString("utf-8")+"\n");
});
