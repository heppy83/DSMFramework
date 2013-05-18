//constructor
function textInput(correlationId, viewPort, constrParams){ 
	
	this._correlationId = correlationId;
	this._viewPort=viewPort;
	this._params = constrParams;
	
	//constructor method invoked by last line of the comp's code (i.e., when the comp is loaded)
	this.load = function(){
		var mydiv= document.getElementById(this._viewPort);
		mydiv.innerHTML="<FORM id='inputForm'><span width='95%'>"
				+ "Insert your text:<br/>"
				+ "<p><input type='textarea' name='textarea' id='ta'/> </p>"
				// To invoke an function of this component from the html page where the comp is embedded,
				// onClick must call "Engine.execute" passing the correlId, the name of the function to be invoked and an array with the parameter to be passed.
				+ " <input type='button' name='sendButton' id='sb' value='Send' onClick='Engine.execute(\""+this._correlationId+"\",\"sendText\",[this.form.textarea.value]);'> </INPUT></FORM></span>";
	};
	
	// public operation of the component
	this.sendText = function(text){
		var resp = new Object();
		resp.text = text;
		
		// Send an asynch notification message to the Engine to be processed. Containing:
		// correlationId, name of the function (i.e., name of the ref attr in the oper description), output params as JS Object with fields corresponding to the output names defined in the descriptor 
		Engine.notification(this._correlationId, "sendText", resp);
	};
	
	this.load();
}