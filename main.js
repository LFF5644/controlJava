#!/bin/env node
const {spawn}=require("child_process");
const http=require("http");

const serverPath="server";
const serverJar="paper-1.12.2.jar";

let errorCounter=0;

process.chdir(serverPath);
const minecraftServerProcess = spawn("java",[
	"-Xmx1G",
	"-jar",
	serverJar
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
function onRequest(request,response){
	const path=unescape(request.url.split("?")[0]);
	const search=Object.fromEntries(
		((request.url.split("?")[1]||"").split("&")||[])
			.map(item=>item.split("=").length==1?[unescape(item),true]:item.split("=").map(unescape))
	);
	
	response.writeHead(200,{"Content-Type":"text/plain"});
	response.write("path: "+path+"\n");
	response.write("search: "+JSON.stringify(search,null,2).split("  ").join("\t")+"\n");

	if(path=="/cmd"){
		response.write("Execute cmd: "+search.cmd+"\n");
		minecraftServerProcess.stdin.write(search.cmd+"\n");
	}
	response.end();
}

const httpServer=http.createServer(onRequest);
httpServer.listen(8080);

minecraftServerProcess.stdout.on("data",data=>log(data,"stdout"));
minecraftServerProcess.stderr.on("data",data=>log(data,"stderr"));
minecraftServerProcess.on("exit",code=>{
	console.log("Exit with code: "+code);
	setTimeout(process.exit,1e3,0);
});

process.stdin.on("data",data=>{
	minecraftServerProcess.stdin.write(data.toString("utf-8")+"\n");
});

console.log("Laufe auf PID "+minecraftServerProcess.pid);
console.log("");

