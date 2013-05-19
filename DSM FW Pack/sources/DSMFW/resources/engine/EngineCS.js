/**
 * 
 */

//  Components are objects of this form:
// 
//function Component (id, name, binding, type, endpoint, reference, configurationParameters, operations, viewport, componentObject){
//	this.id = id;
//	this.name = name;
//	this.type = type;
//	this.endpoint= endpoint;
//	this.reference= reference;
//	this.bining = binding;
//	this.configurationParameters = configurationParameters;
//	this.operations = operations;
//	this.viewport = viewport;
//	this.instance = componentObject;
//}

function Engine(composistionURL){
	
	
	this.DISPATCHER_URL = "http://localhost:1337/DSMFW/init"
		
	this.compositionURL = compositionURL;
	this.platformConfiguration;
	
	this.engineInstanceId = new Date() * (Math.random()*10); 
	
	this.ssEngineWS = null;
	
	this.componentArray = new Object();
	this.composition = new Object();
	
	this.dataReferencesMode = "";
	this.paradigm = "";
	
	this.DATA_FLOW = "data_flow";
	this.CONTROL_FLOW = "control_flow";
	
	this.REFERENCE = "reference"; // Used to require a service to return only the reference to the data
	this.DATA = "data"; // Used to get from a service only the actual data. This mode is used only with services which do not understand the Reference Transferring Mode.
	this.NO_SUPPORT = "no_reference_mode_support"; // Used to state that a component does not support the reference passing mode.
	
	// used in case of non-UI flow-starting components. contains the IDs of the operations to be fed and invoked to run the mashup  
	this.startingOperationsArray = [];
	// used in case of non-UI flow-ending components. contains the output of the last operation constituting the mashup final output
	this.finalOutput = [];
	
	// contains the global variable defined in the mashup, in the form: [{globalVarId: {type: reference|data, value: globalVarValue}}]
	this.globalVariables = new Object();
	
	// object used to buffer the input pars of operations since they may not come altogether (i.e., with Dataflow or Blackboard, when they are connected to different operations)  
	this.inputBuffers = new Object();
	
	if (!Object.keys) {
	    Object.keys = function (obj) {
	        var keys = [],
	            k;
	        for (k in obj) {
	            if (Object.prototype.hasOwnProperty.call(obj, k)) {
	                keys.push(k);
	            }
	        }
	        return keys;
	    };
	}
	
	this.setParadigm = function (paradigm) {
		this.paradigm = paradigm;
	};
	
	this.setDataReferencesMode = function (flag) {
		this.dataReferencesMode = flag;
	};

	this.parseCompositionXML = function (compositionURL) {
		
		components = $("component", this.composition);
		
		var compArr = new Object();
		$.each(components, // parse component XML def in JS object of the form:
						   // {'id': id, 'name': name, 'type': type, 'reference': reference, 'inputs': inputsArray, 'outputs': outputsArray}
						function (key, currComp){
							var binding = $(currComp).attr("binding");			
							var id = $(currComp).attr("id");
							var name = $(currComp).attr("name");
							var type = $(currComp).attr("type");
							var endpoint= $(currComp).attr("endpoint");
							//TODO: add the comp reference to the composition model
							var componentReference= $(currComp).attr("reference");
							var viewport = type=="ui" ? $("viewport displays_component[ref="+ id +"]", $(this).closest("mashup")).parent().attr("name") : null;
							var supportReferencePassing = $(currComp).attr("supportReferencePassing") == "yes" ? true : false;
							
							var configParamsArray = new Object;
							var configParams = $(currComp).find("configurationParameter");
							$.each(configParams, function(key, param){
								var id = $(param).attr("id");
								var name = $(param).attr("name");
								var manualInput = $(param).attr("manualInput");
								var dataType = $(param).find("has_dataType").attr("ref");
								var value = $("constant feeds_configurationParameter[ref="+ id +"]", $(this).closest("mashup")).parent().attr("value");
								
								configParamsArray[id]={'id': id, 'name': name, 'manualInput': manualInput, 'dataType': dataType, 'value': value};
							});
							
							var operationsArray = new Object();
							var operations = $(currComp).find("operation");
							$.each(operations, function(key, oper){
								var id = $(oper).attr("id");
								var name = $(oper).attr("name");
								var type = $(oper).attr("type");
								var reference = $(oper).attr("reference");
								
								var inputsArray = new Object;
								var inputs = $(oper).find("inputParameter");
								$.each(inputs, function(key, input){
									var id = $(input).attr("id");
									var name = $(input).attr("name");
									var dataType = $(input).find("has_dataType").attr("ref");
									var manualInput = $(input).attr("manualInput");
									var optional= $(input).attr("optional");
									
									inputsArray[id]={'name': name, 'dataType': dataType, 'manualInput': manualInput, 'optional': optional};
								});
								
								var outputsArray = new Object();
								var outputs = $(oper).find("outputParameter");
								$.each(outputs, function(key, output){
									var id = $(output).attr("id");
									var name = $(output).attr("name");
									var dataType = $(output).find("has_dataType").attr("ref");
									
									outputsArray[id]={'name': name, 'dataType': dataType};
								});
								
								operationsArray[id]={'name': name, 'type': type, 'reference': reference, 'inputs': inputsArray, 'outputs': outputsArray};
							});
							
							compArr[id]={'name': name, 'type': type, 'endpoint': endpoint, 'reference': componentReference, 'binding': binding, 'supportReferencePassing': supportReferencePassing, 'configurationParameters': configParamsArray, 'operations': operationsArray, 'viewport':viewport, 'instance': null};
						
						});
		
		this.componentArray = compArr;
	};
	
	this.instantiateClientSideComponents = function(){
		for(c in this.componentArray){
			if(this.componentArray[c].binding=="javascript"){
				// build the config params list replacing IDs (which are unknown to services) with params names as defined in the component descriptor
				var params = new Object();
			 	for(var p in this.componentArray[c].configurationParameters){
			 		var cfName = this.componentArray[c].configurationParameters[p].name;
				 	params[cfName] = this.componentArray[c].configurationParameters[p].value;
				}
			 	
			 	if(this.componentArray[c].type=="ui"){
					var componentInstance = eval('new '+ this.componentArray[c].reference +'("'+ c +"_"+ this.engineInstanceId +'", "'+ this.componentArray[c].viewport +'", params);');
					this.componentArray[c].instance = componentInstance;
			 	}
			 	else if (this.componentArray[c].type=="service" || this.componentArray[c].type=="data"){
			 		var componentInstance = eval('new '+ this.componentArray[c].reference +'("'+ c +"_"+ this.engineInstanceId +'", params);');
					this.componentArray[c].instance = componentInstance;
			 	}
			}
			else if (this.componentArray[c].binding=="widget"){
				// TODO: instantiate widget
			}
		}
	};
	
    // Allows the invocation of JS components functions from within the components themselves - e.g., to invoke function from the HTML that the component may create inamically
    this.execute = function(correlationId, operationName, inputParams){
    	
    	var compId = correlationId.substring(0,correlationId.lastIndexOf("_"));
    	var compInstance = this.componentArray[compId].instance;

    	var funct=eval("compInstance." + operationName);
    	funct.apply(compInstance,inputParams);
    	//funct.apply(compInstance,[inputParams]);
    };
    
    // Find starting components operations, i.e., components having req-resp operations with only the outputs connected to other components operations and pending inputs
	// TODO: this must be checked for control flow case also
	this.findStartingOperations = function(){
		// if (Dataflow) then... --> do the same if controlflow checking cfConnectors instead of df ones
		for(c in this.componentArray){
			var operations = this.componentArray[c].operations; 
			for(o in operations){
				isStartingOper = false;
				// if the operation is req-resp AND ...
				if (operations[o].type=="request-response"){
					isStartingOper = true;
					inputs = operations[o].inputs;
					
					// ... AND if all of its inputs are not bound to any connector AND ...
					for(i in inputs){
						if($("dfConnector target_inputParameter[ref="+ i +"]", this.composition).length>0){
							isStartingOper=false;
							break;
						}
					}
					
					// ... AND if at least one of its outputs is connected to some connector (i.e., the operation is part of the process), 
					// Then this is a Starting Operation
					if(isStartingOper==true){
						isStartingOper = false;
						outputs = operations[o].outputs;
						for(out in outputs){
							if($("dfConnector source_outputParameter[ref="+ out +"]", this.composition).length>0){
								isStartingOper=true;
								break;
							}
						}
					}
				}
				
				if (isStartingOper==true)
					this.startingOperationsArray.push({'startingComponentId': c, 'startingOperationId': o});
			}
		}
		
	};
    
	// Start the execution of the mashup flows starting with non-UI components. 
	// If no UI components are present at all, once started it completes the execution without any further interaction.
	// In this case the only UI is an auto-generated STARTING web page with a RUN button and a set of input fields to feed the starting components,
	// otherwise beside the "run-ui" there will also be the UI components included in the composition. 
	this.startNoUIFlows= function(){
		this.finalOutput = [];
		
		// invoke the starting operations passing as input pars the ones given in the STARTING web page
		for(sc in this.startingOperationsArray){
			//current component
			var comp = this.componentArray[this.startingOperationsArray[sc].startingComponentId];
			// ID of the operation to be invoked 
			var operId = this.startingOperationsArray[sc].startingOperationId;
			// operation's inputs
			var inputs = comp.operations[operId].inputs;
			
			// associative arrays containing the list of input and config parameters to trigger the next operation. 
			// array keys are the IDs of the input pars while array values are values of the input pars; params[input/configParID]= value
			var inputParams = new Object();
			for(i in inputs){
				if(inputs[i].manualInput=="yes" && $("constant feeds_inputParameter[ref="+ i +"]",this.composition).length>0)
					inputParams[i]= $("constant feeds_inputParameter[ref="+ i +"]",this.composition).parent().attr("value");
				else
					inputParams[i]= startingInputs[i];
			}
			
			var responseDataTransferringMode;
			if(this.dataReferencesMode==true){
				responseDataTransferringMode = this.checkResponseDataTransferringMode(this.startingOperationsArray[sc].startingComponentId, operId)
			}
			else
				responseDataTransferringMode = this.NO_SUPPORT;
			
			var data = new Object();
			data.type = "start_no_ui_flows";
			data.body = new Object();
			data.body.componentId = this.startingOperationsArray[sc].startingComponentId;
			data.body.operationId = operId;
			data.body.inputParams = inputParams;
			data.body.requestDataTransferringMode = this.DATA; // in any case we send DATA because: (i) we have actual data from the form in the client or, if we dont have them, we have no data at all and this is irrelevant
			data.body.responseDataTransferringMode = responseDataTransferringMode;
			
			// invoke the web socket "send" that connects to the server side engine to actually invoke the operation through:
			// invokeOperation(componentObject, operationId, inputParametersAssociativeArray), starting the recursive call sequence
			this.ssEngineWS.send(Utils.JSONToString(data));
		}
	};
	
	/*  
	 * when the feature support_reference_passing is selected the default data passing mode is by reference
	 * however it must be checked whether the comps connected to the output params of the oper being invoked do support the reference mode or not. 
	 * if at least one of them does not, actual data must be required as response of the operation being invoked 
	*/ 
	this.checkResponseDataTransferringMode = function(targetCompId, targetOperId){
		var targetComp = this.componentArray[targetCompId];
		var responseDataTransferringMode;
		
		if(this.paradigm == this.DATA_FLOW){
	 		var doesNextComponentRequireData = false;
	 		
	 		for(var targetOutputParam in targetComp.operations[targetOperId].outputs){
		 		if($("dfConnector source_outputParameter[ref="+ targetOutputParam +"]", this.composition).length>0){
					// the -possibly many- target input paramter(s) of the connector(s) attached to the current output of the next operation being invoked
					var nextInputParams = $("dfConnector source_outputParameter[ref="+ targetOutputParam +"]", this.composition).parent("dfConnector").children("target_inputParameter");
					
					var checkNextComp = function(index, nextInputPar){
						var nextComp = this.componentArray[$("inputParameter[id="+ $(nextInputPar).attr("ref") +"]", this.composition).parents("component").attr("id")];
						if(nextComp.supportReferencePassing==false)
							doesNextComponentRequireData=true;
					}
					
					$.each(nextInputParams, checkNextComp.bind(this) );
		 		}
	 		}
	 		responseDataTransferringMode = doesNextComponentRequireData==true ? this.DATA : this.REFERENCE;
		} 
		else if(this.paradigm == this.CONTROL_FLOW){
			
			
			// compute responseDataTransfeerringMode: check for all var where the op outputs will be written if all the operations reading from those vars supports data or reference mode. 
			// in addition check if some of them get manual inputs (i.e., data mode is needed although the operation supports reference)
			var doReadingCompsSupportRef = true;
			for(sop in targetComp.operations[targetOperId].outputs){
				var trgtGlobalVars = $("dfConnector source_outputParameter[ref="+ sop +"]",this.composition).parent().children("target_globalVariable");
				
				var checkNexVars  = function(index, globalVar){ // check all the operations reading from these vars, if they support data or reference mode and if they use manual inputs
					var trgtInputParamsReadingFromCurrVar = $("dfConnector source_globalVariable[ref="+ $(globalVar).attr("id") +"]",this.composition).parent().children("target_inputParameter");
					
					var checkNextComp = function(index, tgrtInPar){
							var readingCompId = $("inputParameter[id="+ $(tgrtInPar).attr("ref") +"]",this.composition).parent("component").attr("id");
							var readingCompManualInputs = $("component[id="+ readingCompId +"] inputParameter[manualInput=yes]" , this.composition);
							if(this.componentArray[readingCompId].supportReferencePassing == false || $(readingCompManualInputs).length>0)
								doReadingCompsSupportRef = false; 
					};
					
					$.each(trgtInputParamsReadingFromCurrVar, checkNextComp.bind(this));
				};
				
				$.each(trgtGlobalVars, checkNexVars.bind(this));
			}
			responseDataTransferringMode = doReadingCompsSupportRef==true ? this.REFERENCE : this.DATA;
		}
		
		return responseDataTransferringMode;
	}
	
	this.getPlatformConfiguration = function (compositionURL) {
		
		var compos;
		
		$.ajax({
		    url : compositionURL,
		    dataType : 'xml',
		    success: function (data,status) {
		    	compos=data;
		    },
			async: false
		});
		
		this.composition = $("mashup",compos);
		var configPackURL = this.composition.attr("configurationPackageURL")
		
		var config;
		$.ajax({
		    url : configPackURL+"/configuration.xml",
		    dataType : 'xml',
		    success: function (data,status) {
		    	config=data;
		    },
			async: false
		});
		
		this.platformConfiguration = $("configuration", config);
		
		if($("feature[name=data_flow]", this.platformConfiguration).length>0)
			this.paradigm = this.DATA_FLOW; 
		else if($("feature[name=control_flow]", this.platformConfiguration).length>0)
			this.paradigm = this.CONTROL_FLOW;
		
		this.dataReferencesMode = ($("feature[name=support_reference_passing]", this.platformConfiguration).length>0) ? true : false;
	}
	
	this.initServerCommunication = function () {
		var dispatcherURL = this.DISPATCHER_URL;
		var data = new Object()
		data.engineInstanceId = this.engineInstanceId;
		data.compositionURL = this.compositionURL;
		
		var message = new Object();
		message.body = Utils.JSONToString(data);
		
		$.ajax({
		    url : dispatcherURL,
		    type: "GET",
		    data : message,
		    contentType: "application/json; charset=utf-8",
		    dataType : 'json',
		    context: this,
		    cache: false,
		    success:function(res, status, XHR, context){
		    			if(res.type == "init_ok") {
							this.ssEngineWS = new WebSocket(res.body.ssEngineWSURL);
							this.ssEngineWS.onmessage = function (event) {
															var message = Utils.stringToJSON(event.data); //JSON.parse(event.data);
															CSEngine.dispatchIncomingMessage(message);
														};
						}
						else{
							alert("Error during client-server communication initialization. The process cannot be run and will stop.");
							console.log("Error during client-server communication initialization. The process cannot be run and will stop.");
							return -1;
						}
		    		},
		    error: function(xhr, status, errors){
		    	console.log("ERR: " +errors);
		    	alert("An error occurred while setting up the client-server communication");
		    },
			async: false
		}); // 
	}
	
	this.dispatchIncomingMessage = function (message){
		if(message.type == "event"){
			if(this.componentArray[message.body.componentId])
				if(this.componentArray[message.body.componentId].binding == "javascript"){
					var compInstance = this.componentArray[message.body.componentId].instance;
					
					// if the operation is of type request-response
					if(this.componentArray[message.body.componentId].operations[message.body.operationId].type == "request-response") {
						var operName = this.componentArray[message.body.componentId].operations[message.body.operationId].reference;
						var response = JSAdapter.invoke(compInstance, operName, message.body.inputParameters, message.body.expectedOutputParameterNames);
						
						var respMessage = new Object();
						respMessage.type = "request-response";
						respMessage.body = new Object();
						respMessage.body.correlationId = message.body.componentId + "_" + this.engineInstanceId;
						respMessage.body.operationRef = operName;
						respMessage.body.params = response;
						
						this.ssEngineWS.send(Utils.JSONToString(respMessage));
					}
					else{ // the operation is of type one-way
						var operName = this.componentArray[message.body.componentId].operations[message.body.operationId].reference;
						JSAdapter.invoke(compInstance, operName, message.body.inputParameters, message.body.expectedOutputParameterNames);
					}
				}
		}
	}
	
	this.notification = function(correlationId, operationRef, params){
		var message = new Object();
		message.type = "notification";
		message.body = new Object();
		message.body.correlationId = correlationId;
		message.body.operationRef = operationRef;
		message.body.params = params;
		
    	this.ssEngineWS.send(Utils.JSONToString(message));
    };
	
	this.onWindowClosing = function() {
		this.engineSSWS.close();
	}
	
	
	this.getPlatformConfiguration(this.compositionURL);
	this.parseCompositionXML(compositionURL); 
	this.findStartingOperations();
	this.initServerCommunication();
};