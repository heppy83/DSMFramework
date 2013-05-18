JSAdapter = new Object();

JSAdapter.invoke = function(componentInstance, operationName, inputParameters, expectedOutputParameterNames){
	var result=null;

	var funct = eval('componentInstance.'+operationName);
	var paramNames = this.getParamNames(funct);
	
	var invocationString = 'componentInstance.'+ operationName + '(';
	for(var pn=0; pn<paramNames.length; pn++){
		invocationString += '"' + inputParameters[paramNames[pn]] + '", ';
	}
	invocationString = invocationString.substring(0, invocationString.length-2);
	invocationString += ')';
	
	var paramArray = new Array();
	for(var pn=0; pn<paramNames.length; pn++){
		paramArray[pn] = inputParameters[paramNames[pn]]; 
	}
	try{
		result = funct.apply(componentInstance, paramArray); //eval(invocationString);
	}
	catch(err){
		return {response:{_adapter_error:{type:'service_invocation_error',details: err.message}}};
	}
	
	return result;
	//return this.processIncomingMessage(result, expectedOutputParameterNames);
	
};

// Retrieves the names of the parameters of a function from its declaration (signature)
JSAdapter.getParamNames = function(func) {
    var funStr = func.toString();
    return funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g);
};