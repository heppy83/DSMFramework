/**
 * Ajax Adapter. Expect JSON response for all queries.
 * @class WireIt.WiringEditor.adapters.Ajax
 * @static 
 */
WireIt.WiringEditor.adapters.myAdapter = {
	
	/**
	 * You can configure this adapter to different schemas.
	 * TIP: "url" can be a function !
	 */
	config: {
		saveWiring: {
			method: 'POST',
			url: 'http://localhost:1337/DSMFW/saveMashup'
		},
		deleteWiring: {
			method: 'DELETE',
			url: 'deleteWiring'
		},
		listWirings: {
			method: 'GET',
			url: 'listWirings'
		}
	},
	
	/**
	 * init the adapter 
	 * @method init
	 * @static
	 */
	init: function() {
		YAHOO.util.Connect.setDefaultPostHeader('application/json');
	},
	
	/**
	 * called when saved
	 * @method saveWiring
	 * @static
	 */
	// eir contains the Editor's Internale Representation of the mashup
	saveWiring: function(eir, callbacks) {
		var xmlStr = this.createMashupXML(eir);
		var htmlStr = this.createMashupHTML(xmlStr);
		
		this._sendRequest("saveWiring", {"xml": xmlStr,"html": htmlStr}, callbacks);
	},
	
	// eir contains the Editor's Internale Representation of the mashup
	createMashupHTML: function(mashupXml) {
		
		var mashupDoc = TransformationUtils.stringToXML(mashupXml);
		
		var scriptsStr = ''+
			'<script language="javascript" type="text/javascript"\n'+
			'	src="../../../../engine/lib/jquery-1.7.2.js"></script>\n'+
			'<script language="javascript" type="text/javascript"\n'+
			'	src="../../../../engine/lib/jquery.json-2.3.js"></script>\n'+
			'<script language="javascript" type="text/javascript"\n'+
			'	src="../../../../engine/EngineCS.js"></script>\n'+
			'<script language="javascript" type="text/javascript"\n'+
			'	src="../../../../engine/adapters/JSAdapterCS.js"></script>\n'+
			'<script language="javascript" type="text/javascript"\n'+
			'	src="../../../../engine/Utils.js"></script>\n'+
			'<script language="javascript" type="text/javascript">\n'+
			'	function getUrlVars() {\n'+
			'		var vars = {};\n'+
			'		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {\n'+
			'			vars[key] = value;\n'+
			'		});\n'+
			'		return vars;\n'+
			'	}\n'+
			'	var compositionXMLURL = "'+ confPackURL+'/compositions/'+($($("mashup", mashupDoc)[0]).attr("name")).replace(/\s+/g, '') +'.xml' +'"; //getUrlVars()["compositionXMLURL"];\n'+
			'	var compositionURL = compositionXMLURL;\n'+
			'	if(compositionXMLURL=="")\n'+
			'		alert("ERROR: Composition definition not specified! Please provide the composition definition URL as query parameter.");\n'+
			'	else{\n'+
			'		CSEngine = new Engine(compositionURL);\n'+
			'		startingInputs = [];\n'+
			'		function saveStartingInputs() {\n'+
			'			var startInputsNodes = $("#runNoUIFlow_div input:not(#run)");\n'+
			'			$.each(startInputsNodes, function(key, inputNode) {\n'+
			'				startingInputs[$(inputNode).attr("id")] = $(inputNode)\n'+
			'						.attr("value");\n'+
			'			});\n'+
			'			$("#runNoUIFlow_div")[0].style.visibility= "hidden";\n'+
			'		}\n'+
			'		$(window).unload(function(){CSEngine.onWindowClosing()});\n'+
			'	}\n'+
			'</script>';
		
		
		var templateHTML; 
		
		if(!selectedTemplate || !selectedTemplate.url || selectedTemplate=="")
			selectedTemplate = {url: "http://localhost:1337/DSMFW/resources/wireIt0.6.0/web/assets/defaultTemplate.html"};
		
		$.ajax({
		    url : selectedTemplate.url,
		    dataType : 'html',
		    success: function (data,status) {
		    	templateHTML =data;
		    },
			async: false
		});
		
		if(templateHTML){
			
			templateHTML = new DOMParser().parseFromString(templateHTML, "text/html");
			
			var uiCompTags = $("component[type=ui]", mashupDoc);
			$.each(uiCompTags, function(index, comp){
				scriptsStr+='<script language="javascript" type="text/javascript" src="'+ $(comp).attr("endpoint") +'"></script>';
			});
			
			var scriptsDoc = new DOMParser().parseFromString(scriptsStr, "text/html");
		
			$("head", templateHTML)[0].innerHTML += scriptsStr;
			
			var onload = ($($("body", templateHTML)[0]).attr("onload") || "");
			onload+=" CSEngine.instantiateClientSideComponents();";
			$($("body", templateHTML)[0]).attr("onload", onload);
			
			var inputTags = $("inputParameter", mashupDoc).filter(function(index){
				if(!$(this).attr("optional") || $(this).attr("optional")=="no") 
					if( $("dfConnector target_inputParameter[ref="+ $(this).attr("id") +"]", mashupDoc).length == 0 &&
						$("constant feeds_inputParameter[ref="+ $(this).attr("id") +"]", mashupDoc).length == 0 ){ 
						return this;
					}
			});
			
			var runDivStr = '<div id="runNoUIFlow_div" style="border: darkolivegreen solid 3px;position: absolute;right: 5%; top: 10%; padding: 10px;background-color: cadetblue;border-radius: 10px;">';
			
			$.each(inputTags, function(index, input){
				runDivStr += '<label>'+$(input).attr("name")+' </label><br> <input id="'+$(input).attr("id")+'" type="text" value=""/ ><br><br>';
			});
			
			runDivStr+='<center><input id="run" value="RUN" type="button" onclick="saveStartingInputs(); CSEngine.startNoUIFlows();"></center></div>';
			
			$("body", templateHTML)[0].innerHTML += runDivStr;
			
			var htmlStr = templateHTML.documentElement.outerHTML;
			
			return htmlStr;
		}
	},
	
	// eir contains the Editor's Internale Representation of the mashup
	createMashupXML: function(eir) {
		var mStr=""; // mashup string
		var vpsStr=""; // viewports string
		var cnstStr=""; // constants string
		
		var setAttribute = function(attrName, attrValue){ mStr+=" "+attrName+"=\""+ attrValue+"\" "};
		var setAttributeVps = function(attrName, attrValue){ vpsStr+=" "+attrName+"=\""+ attrValue+"\" "};
		var setAttributeCnst = function(attrName, attrValue){ cnstStr+=" "+attrName+"=\""+ attrValue+"\" "};
		
		var mashup = document.createElement("mashup"); mStr+="<mashup";
		mashup.setAttribute("name", eir.name); setAttribute("name", eir.name); 
		mashup.setAttribute("configurationPackageURL", confPackURL); setAttribute("configurationPackageURL", confPackURL);
		mStr+="> "
		
		// translating the page
		//			<page id="P1" name="page1" URL="...Template.html">
		//			</page>
		var pageEl;
		if(editorConfiguration.features.user_interface && editorConfiguration.features.single_page){
			
			pageEl = document.createElement("page");
			mashup.appendChild(pageEl);
			
			pageEl.setAttribute("id", "P1"); 
			pageEl.setAttribute("name", selectedTemplate.name);  
			pageEl.setAttribute("URL", selectedTemplate.url); 
		}
		
		// translating components
		// <component id="C1" name="" type="data" binding="REST" endpoint="" syntax="http://....png">
		for(var i=0; i<eir.working.modules.length; i++){
			var compId = eir.working.modules[i].id;
			var comp = eir.working.modules[i].container;
			var compEl = document.createElement("component"); mStr+="<component"
			mashup.appendChild(compEl);
			
			compEl.setAttribute("id", compId); setAttribute("id", compId);
			compEl.setAttribute("name", comp.title); setAttribute("name", comp.title);
			compEl.setAttribute("type", comp.type); setAttribute("type", comp.type);
			compEl.setAttribute("binding", comp.binding); setAttribute("binding", comp.binding);
			compEl.setAttribute("endpoint", comp.endpoint); setAttribute("endpoint", comp.endpoint);
			if(comp.supportReferencePassing)
				{compEl.setAttribute("supportReferencePassing:", comp.supportReferencePassing); setAttribute("supportReferencePassing:", comp.supportReferencePassing);}
			if(comp.syntax)
				{compEl.setAttribute("syntax", comp.syntax); setAttribute("syntax", comp.syntax);}
			if(comp.reference)
				{compEl.setAttribute("reference", comp.reference); setAttribute("reference", comp.reference);}
			
			mStr+=">";
				
			var inputsIndex = 0;
			var outputsIndex = 0;
			var constsIndex = 0;
			
			// translating operations
			// <operation id="OP1-1" name="" type="request-response" reference="">
			for(var j=0; j< comp.fields.length; j++){
				var field = comp.fields[j];
				if(field.type=="operation"){
					var operEl = document.createElement("operation"); mStr+="<operation";
					compEl.appendChild(operEl);
					
					operEl.setAttribute("id", "OP"+j+"-"+compId); setAttribute("id", "OP"+j+"-"+compId);
					operEl.setAttribute("name", field.name); setAttribute("name", field.name);
					operEl.setAttribute("type", field.operationType); setAttribute("type", field.operationType);
					operEl.setAttribute("reference", field.reference); setAttribute("reference", field.reference);
					mStr+=">";
					
					//translating input/output params
					// 					<inputParameter id="I1-1" name="name" manualInput="yes" optional="no">
					//						<has_dataType ref="string" />
					//					</inputParameter>
					//					<outputParameter id="O1-1" name="researcher" >
					//						<has_dataType ref="researchers" />
					//					</outputParameter>
					for(var k=0; k<field.fields.length; k++){
						var paramField = field.fields[k];
						if(paramField.type=="inputParameter"){
							var inputEl = document.createElement("inputParameter"); mStr+="<inputParameter"
							operEl.appendChild(inputEl);
							
							inputEl.setAttribute("id", "I"+inputsIndex+"-"+compId); setAttribute("id", "I"+inputsIndex+"-"+compId);
							inputEl.setAttribute("name", paramField.name); setAttribute("name", paramField.name);
							if(paramField.manualInput){
								inputEl.setAttribute("manualInput", (paramField.manualInput==true)?"yes":"no"); setAttribute("manualInput", (paramField.manualInput==true)?"yes":"no");
								
								if(eir.working.modules[i].value[field.name][paramField.name] != undefined && eir.working.modules[i].value[field.name][paramField.name]!=""){
									// genrating the  associated constant
									//		<constant id="CNST1" name="version" value="4.0">
									//			<has_dataType ref="string" />
									//			<feeds_configurationParameter ref="CP1-2" />
									//		</constant>
									var constEl = document.createElement("constant"); cnstStr+="<constant"
									mashup.appendChild(constEl);
									
									constEl.setAttribute("id", "CNST"+constsIndex); setAttributeCnst("id", "CNST"+constsIndex);
									constEl.setAttribute("name", paramField.name); setAttributeCnst("name", paramField.name);
									constEl.setAttribute("value", eir.working.modules[i].value[field.name][paramField.name]); setAttributeCnst("value", eir.working.modules[i].value[field.name][paramField.name]);
									
									cnstStr+="> "
									
									var feedsEl = document.createElement("feeds_inputParameter"); cnstStr+="<feeds_inputParameter ";
									feedsEl.setAttribute("ref", "I"+inputsIndex+"-"+compId); setAttributeCnst("ref", "I"+inputsIndex+"-"+compId);
									constEl.appendChild(feedsEl);
									cnstStr+="/> ";
									
									var dataTypeEl = document.createElement("has_dataType"); cnstStr+="<has_dataType";
									dataTypeEl.setAttribute("ref", paramField.has_dataType.ref); setAttributeCnst("ref", paramField.has_dataType.ref);
									constEl.appendChild(dataTypeEl);
									cnstStr+="/>";
									
									cnstStr+="</constant> ";
								}
							}
							if(paramField.optional)
								{inputEl.setAttribute("optional", paramField.optional); setAttribute("optional", paramField.optional);}
							mStr+="> "
							
							var dataTypeEl = document.createElement("has_dataType"); mStr+="<has_dataType";
							dataTypeEl.setAttribute("ref", paramField.has_dataType.ref); setAttribute("ref", paramField.has_dataType.ref);
							inputEl.appendChild(dataTypeEl);
							
							mStr+=" /> "
							
							inputsIndex++;
							
							mStr+="</inputParameter>"
						}
						else if(paramField.type=="outputParameter"){
							var outputEl = document.createElement("outputParameter"); mStr+="<outputParameter";
							operEl.appendChild(outputEl);
							
							outputEl.setAttribute("id", "O"+outputsIndex+"-"+compId); setAttribute("id", "O"+outputsIndex+"-"+compId);
							outputEl.setAttribute("name", paramField.name); setAttribute("name", paramField.name);
							
							mStr+="> "
							
							var dataTypeEl = document.createElement("has_dataType"); mStr+="<has_dataType";
							dataTypeEl.setAttribute("ref", paramField.has_dataType.ref); setAttribute("ref", paramField.has_dataType.ref);
							outputEl.appendChild(dataTypeEl);
							
							mStr+="/> ";
							
							outputsIndex++;
							
							mStr+="</outputParameter>"
						}
						
					}
					mStr+="</operation> ";
				}
				// translating config params
				// 		<configurationParameter id="CP1-2" name="" manualInput="yes">
				//			<has_dataType ref="string" />
				//		</configurationParameter>
				else if(field.type = "configurationParameter"){
					for(var c=0; c<field.fields.length; c++){
						var configField = field.fields[c];
						
						// translate viewports
						//				<viewport id="VP1" name="_viewport_ChartViewPort" >
						//					<displays_component ref="C4" />
						//				</viewport>
						if(configField.label == "ViewPort"){
							var vpEl = document.createElement("viewport"); vpsStr+="<viewport"
							vpEl.appendChild(pageEl);
							
							vpEl.setAttribute("id", "VP"+compId); setAttributeVps("id", "VP"+compId);
							vpEl.setAttribute("name", "_viewport_"+configField.choices.selectedValue); setAttributeVps("name", "_viewport_"+configField.choices.selectedValue);
							vpsStr+="> ";
							
							var displCompEl = document.createElement("displays_component"); vpsStr+="<displays_component"
							displCompEl.setAttribute("ref", compId); setAttributeVps("ref", compId);
							vpEl.appendChild(displCompEl);
							vpsStr+="/> ";
							vpsStr+="</viewport> ";
						}
						else{	
							var configEl = document.createElement("configurationParameter"); mStr+="<configurationParameter"
							compEl.appendChild(configEl);
							
							configEl.setAttribute("id", "CP"+c+"-"+compId); setAttribute("id", "CP"+c+"-"+compId);
							configEl.setAttribute("name", configField.name); setAttribute("name", configField.name);
							configEl.setAttribute("manualInput", "yes"); setAttribute("manualInput", "yes");
							mStr+="> ";
								
							var dataTypeEl = document.createElement("has_dataType"); mStr+="<has_dataType";
							dataTypeEl.setAttribute("ref", configField.has_dataType.ref); setAttribute("ref", configField.has_dataType.ref);
							configEl.appendChild(dataTypeEl);
							mStr+="/>";
							
							mStr+="</configurationParameter> ";
							
							// genrating the  associated constant
							//		<constant id="CNST1" name="version" value="4.0">
							//			<has_dataType ref="string" />
							//			<feeds_configurationParameter ref="CP1-2" />
							//		</constant>
							var constEl = document.createElement("constant"); cnstStr+="<constant"
							mashup.appendChild(constEl);
							
							constEl.setAttribute("id", "CNST"+constsIndex); setAttributeCnst("id", "CNST"+constsIndex);
							constEl.setAttribute("name", configField.name); setAttributeCnst("name", configField.name);
							constEl.setAttribute("value", configField.selectedValue); setAttributeCnst("value", configField.selectedValue);
							
							cnstStr+="> "
							
							var feedsEl = document.createElement("feeds_configurationParameter"); cnstStr+="<feeds_configurationParameter ";
							feedsEl.setAttribute("ref", "CP"+c+"-"+compId); setAttributeCnst("ref", "CP"+c+"-"+compId);
							constEl.appendChild(feedsEl);
							cnstStr+="/> ";
							
							var dataTypeEl = document.createElement("has_dataType"); cnstStr+="<has_dataType";
							dataTypeEl.setAttribute("ref", configField.has_dataType.ref); setAttributeCnst("ref", configField.has_dataType.ref);
							constEl.appendChild(dataTypeEl);
							cnstStr+="/>";
							
							cnstStr+="</constant> ";
							
							mStr+="</configurationParameter> ";
						}
						
					}
				}
			}
			mStr+="</component> "
		}
		
		mStr+=cnstStr;
		
		// again for the string version
		if(editorConfiguration.features.user_interface && editorConfiguration.features.single_page){
			
			mStr+="<page";
			
			setAttribute("id", "P1"); 
			setAttribute("name", selectedTemplate.name);  
			setAttribute("URL", selectedTemplate.url); 
			
			mStr+=">";
			mStr+= vpsStr;
			mStr+="</page> ";
		}
		
		
		if(editorConfiguration.features.data_flow){
			// translating dfconnectors
			//	<dfConnector id="DF1"> 
			//		<source_outputParameter ref="O1-1" /> 
			//		<target_inputParameter ref="I1-2" />
			//	</dfConnector>
			for(var i=0; i<eir.working.wires.length; i++){
				if(eir.working.wires[i].src.terminal!= "_externalOutput" && eir.working.wires[i].tgt.terminal!= "_externalInput"){
					var dfConnId = "DF"+i;
					//var dfConn = eir.working.wires[i];
					
					var dfConnEl = document.createElement("dfConnector"); mStr+="<dfConnector";
					mashup.appendChild(compEl);
					
					dfConnEl.setAttribute("id", dfConnId); setAttribute("id", dfConnId);
					
					mStr+="> ";
					
					
					var srcCompId = eir.working.modules[eir.working.wires[i].src.moduleId].id;
					var outputTag = $("component[id="+srcCompId+"] operation outputParameter[name="+eir.working.wires[i].src.terminal+"]", mashup);
					if(outputTag.length>0) outputTag = outputTag[0]; else {alert("error during saving operation! saving aborted!"); return;}
					var srcOutId = $(outputTag).attr("id")
					
					var srcOutEl = document.createElement("source_outputParameter"); mStr+="<source_outputParameter";
					dfConnEl.appendChild(srcOutEl);
					srcOutEl.setAttribute("ref", srcOutId); setAttribute("ref", srcOutId);
					mStr+="/> ";
					
					var tgtCompId = eir.working.modules[eir.working.wires[i].tgt.moduleId].id;
					var inputTag = $("component[id="+tgtCompId+"] operation inputParameter[name="+eir.working.wires[i].tgt.terminal+"]", mashup);
					if(inputTag.length>0) inputTag = inputTag[0]; else {alert("error durin saving operation!"); return;}
					var tgtInId = $(inputTag).attr("id")
					
					var tgtInEl = document.createElement("target_inputParameter"); mStr+="<target_inputParameter";
					dfConnEl.appendChild(tgtInEl);
					tgtInEl.setAttribute("ref", tgtInId); setAttribute("ref", tgtInId);
					mStr+="/> ";
					
					mStr+="</dfConnector>"
				}
				
			}
			mStr+="</mashup>"
		}
		var xmlStr = mStr; //mashup.outerHTML;
		return xmlStr;
	},
	
	/**
	 * called when deleted
	 * @method deleteWiring
	 * @static
	 */
	deleteWiring: function(val, callbacks) {
		//this._sendRequest("deleteWiring", val, callbacks);
	},
	
	/**
	 * called to load the wirings
	 * @method listWirings
	 * @static
	 */
	listWirings: function(val, callbacks) {
		//this._sendRequest("listWirings", val, callbacks);
	},
	
	/**
	 * send a request in JSON
	 * @method _sendRequest
	 * @static
	 */
	_sendRequest: function(action, data, callbacks) {

		$.ajax({
			url : this.config[action].url,
			type: this.config[action].method,
			data : {"data": data, "configurationPackageURL": confPackURL},
			contentType: "application/json; charset=utf-8",
			dataType : 'json',
			context: {cb: callbacks},
			cache: false,
			success:function(data,status, xhr, ctx) {
				var r = data;
				this.cb.success.call(this.cb.scope, r);
			},
			error: function(xhr, status, errors){
				var error = status + " " + errors;
				this.cb.failure.call(this.cb.scope, error);
			},
			async: false
		});
	}
	
};
