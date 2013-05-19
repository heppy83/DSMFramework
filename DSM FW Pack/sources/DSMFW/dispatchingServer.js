/**
 *  The main server dispatching client request to different SS-Engine instances
 */
 
 // importing required libs
var http = require('http'),
    dispatcher = require('httpdispatcher'),
    WebSocketServer = require('ws').Server,
    sys = require('sys'),
    CMPUtils = require("./node_modules/CMPUtils.js"),
    DOMParser = require('xmldom').DOMParser,
    $ = require("jquery");
    
    
var EngineFactory = require('EngineSS.js');
    
// variable keeping track of already assigned ports that are used foe SS Engine Web sockets. The assignement is incremental starting from port 20001+1 
var portCounter = 20001;
    
var SERVER_HOST = "localhost"; 
 
// defining the path for request of static content (HTML, CSS, images, ...) 
dispatcher.setStatic('DSMFW/resources');
 
var EngineInstance = function(ssEngine, csEngineId){
	this.ssEngine = ssEngine;
	this.csEngines = csEngineId;
	
	// TODO: when exteding to multi pages/users we will need an array of CS engines, each one with the associated ws 
	/*this.csEngines = new Object();
	
	this.addCsEngine= function (csEngineId, ws){
		this.csEngines[csEngineId] = ws;
	}*/
} 
 
// declaring an array that will contain all the Web Sockets references of the clients the server talks to 
var engineInstances = [];

dispatcher.getEngineInsteance= function(id){
	return engineInstances[id];
}

// component registration function
dispatcher.onPost("/DSMFW/ComponentsRegistration", function(req, res) {
	try{
		var fileName = res.files.compDescr.name;
		var URI = res.fields.confPackageURL+"/components/";
		URI = "./" + URI.substring(URI.indexOf("resources/DSMPlatforms/"));
		
	   	fs.rename(res.files.compDescr.path, URI+"/"+fileName);
	   	
	} catch(err){
		console.log('Saving component descriptor failed!!');
		res.writeHead(302, {'Location': './resources/componentsRegistration/registrationFailure.html', 'content-type': 'text/html'});
		res.end();
	}

	res.writeHead(302, {'Location': './resources/componentsRegistration/registrationSuccess.html', 'content-type': 'text/html'});
	res.end();
});

// returns the list of components in components folder of the DSM Pf whose Config Pack URL is passed as input 
dispatcher.onGet("/DSMFW/componentRegistry", function(req, res) {
	var confPackURL = req.params.confPackURL;
	
	var compFolder = "./" + confPackURL.substring(confPackURL.indexOf("resources/DSMPlatforms/")) + "/components";
	var compDescriptors = new Object();
	compDescriptors.components = new Array();
	
	var files = fs.readdirSync(compFolder);
	for(var i in files) {
		// if the filename ends with .xml 
		if(files[i].lastIndexOf(".xml")==files[i].length-4)
			compDescriptors.components.push(confPackURL+"/components/"+files[i]);	
	}
	
	res.writeHead(200, {'Content-Type': 'text/json'});
	res.end(JSON.stringify(compDescriptors));
	
});

// returns the list of templates in templates folder of the DSM Pf whose Config Pack URL is passed as input 
dispatcher.onGet("/DSMFW/templateRegistry", function(req, res) {
	var confPackURL = req.params.confPackURL;
	
	var templFolder = "./" + confPackURL.substring(confPackURL.indexOf("resources/DSMPlatforms/")) + "/templates";
	var templatesObj = new Object();
	templatesObj.templates = new Array();
	if(fs.existsSync(templFolder)){
		var files = fs.readdirSync(templFolder);
		for(var i in files) {
			// if the filename ends with .xml 
			if(files[i].lastIndexOf(".html")==files[i].length-5)
				templatesObj.templates.push(confPackURL+"/templates/"+files[i]);	
		}
	}
	
	res.writeHead(200, {'Content-Type': 'text/json'});
	res.end(JSON.stringify(templatesObj));
	
});

// component registration function
dispatcher.onPost("/DSMFW/saveMashup", function(req, res) {
	try{
		var mashupDoc = new DOMParser().parseFromString(req.params["data[xml]"], "text/xml");
		
		var mashupName = $("mashup", mashupDoc).attr("name");
		var htmlPageName = mashupName.replace(/\s+/g, '') +".html"
		mashupName = mashupName.replace(/\s+/g, '') +".xml";
			
		
		var URL = req.params.configurationPackageURL+"/compositions/";
		var URI = "./" + URL.substring(URL.indexOf("resources/DSMPlatforms/"));
		
		var errXml = fs.writeFileSync(URI+mashupName, req.params["data[xml]"]);
		var errHtml = fs.writeFileSync(URI+htmlPageName, req.params["data[html]"]);
	    
	    if(errXml || errHtml) {
	        console.log(err);
	    } else {
	        console.log("The mashup file\""+mashupName+"\" was saved!");
	    } 
		
	} catch(err){
		console.log('Error saving the mashup! Saving aborted!' + err);
		res.writeHead(200, {status: "error", fileURL: "", statusMessage: "Error saving the mashup! Saving aborted! "+ err});
		res.end();
	}

	res.writeHead(200, {'Content-Type': 'text/json'});
	res.end(JSON.stringify({status: "ok", fileURL: URL+htmlPageName, statusMessage: "Access mashup at: "+URL+htmlPageName}));
});
 
// managing GET request for "init", creating the SS Engine instance responsible for this process instance and setting up the WS communication channel among CS and SS Engine
dispatcher.onGet("/DSMFW/init", function(req, res) {

	try{
		portCounter++;
		var wss = new WebSocketServer({port: portCounter});
		
		var body = JSON.parse(req.params.body);
		
		var ssEngine = EngineFactory(body.engineInstanceId, body.compositionURL);
		
		// creating a context containing a reference to the created Engine object to be used to invoke engine functions inside web sockets callback functions
		wss.context = new Object();
		wss.context.owningSsEngine = ssEngine;
		
		ssEngine.setWebSocketServer(wss);
		
		var engInst = new EngineInstance(ssEngine, body.engineInstanceId);
		engineInstances[body.engineInstanceId] = engInst;
		
		res.writeHead(200, {'Content-Type': 'text/json'});
	    res.end('{"type": "init_ok", "body": {"ssEngineWSURL": "ws://'+ SERVER_HOST +':'+portCounter +'"}}');
    } catch(errors){
    	console.log("Problems instantiating the SSEngine. ERR: " +errors);
    }
});

dispatcher.onError(function(req, res) {
	res.writeHead(404);
	res.end("<h1>The resource you are trying to access does not exist!</h1>");
});
 
// creating the server and delgating request processing to the dispatcher.dispatch()
var server = http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
    //console.log("Path: " +req.url);
});
 
// putting the web server in linstening mode
server.listen(1337, '127.0.0.1');

