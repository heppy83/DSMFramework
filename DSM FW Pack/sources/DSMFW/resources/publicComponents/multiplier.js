//constructor
function multiplier(correlationId, configParams){ 
	//this._params = configParams; // there are no configuration params, so we can skip this line

	// there is nothing to render or initialize, so we can skip this function
	//this.load = function(){};
	//this.load();
	
	
	// public operation of the component
	this.multiply = function(operand1, operand2){
		
		// building the output object containing a "field" 
		// named as defined in the operation's outputs names
		var resp = new Object();
		resp.multiplicationResult = operand1 * operand2; 
		
		return resp;
	};
	
}