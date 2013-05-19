// TODO: this kind of stuff should be loaded through some API of the engine; like: Engine.loadResource("<script...>");
document.write("<script type=\"text/javascript\" src=\"https://www.google.com/jsapi\"></script>");

//constructor
function barChart(correlationId, viewPort,constrParams){ 
	this._viewPort=viewPort;
	this._params = constrParams;
	
	this.getViewPort = function(){
		return this._viewPort;
	};

	this.getParams = function(){
		return this._params;
	};

	//constructor method invoked by last line of the comp's code (i.e., when the comp is loaded)
	this.load = function(){
	
		var vpDiv = document.getElementById(this.getViewPort())
		vpDiv.innerHTML = "<br><span style=\"margin: 15px; color: darkred; font-size:18px;\">Chart waiting for data ...</span>";
	};
	
	this.plot = function(xAxisValues, yAxisValues){
      
      	var xAxis = xAxisValues;
		var yAxis = yAxisValues;
      
		var  drawChart = function() {
		    var yAxis = this.yAxis;
		    var xAxis = this.xAxis;
		    
		    var getKeys = function (obj) {
		      var keys = new Array();
              for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                  keys.push(prop);
                }
              }
              return keys;
            };
		    
		    var yArray = new Array();
		    var xArray = new Array();
		    
		    var yAxisLabels = new Array(); 
		    var yAxisLabels = new Array(); 
		    
		    if($.isArray(yAxis[0])){
		    	for(var i=0; i<yAxis.length; i++){
		    	    for(var j=0; j<yAxis[i].length; j++){
    		    		var key = getKeys(yAxis[i][j])[0];
    			        yArray.push(yAxis[i][j][key]);
    			    }
			    }
			    yAxisLabel = getKeys(yAxis[0][0])[0];
		    }
		    else if(typeof yAxis[0] == 'object'){
		    	var key = getKeys(yAxis[0])[0];
			    yArray.push(yAxis[0][key]);
			    yAxisLabel = key;
		    }
		    
		    if($.isArray(xAxis[0])){
		    	for(var i=0; i<xAxis.length; i++){
		    	    for(var j=0; j<xAxis[i].length; j++){
    		    		var objKey = getKeys(xAxis[i][j])[0];
		    			var key;
    		    		if(xAxis[i][j][objKey]["name"]) key = "name";
    		    		else if(xAxis[i][j][objKey]["title"]) key = "title";
    		    		else if(xAxis[i][j][objKey]["id"]) key = "id";
    		    		else key = getKeys(xAxis[i][j])[0];
    			        xArray.push(xAxis[i][j][objKey][key]);
    			    }
			    }
			    //xAxisLabel = getKeys(xAxis[0][0])[0];
		    }
		    else if(typeof xAxis[0] == 'object'){
		    	var objKey = getKeys(xAxis[0])[0];
		    	var key;
	    		if(xAxis[0][objKey]["name"]) key = "name";
	    		else if(xAxis[0][objKey]["title"]) key = "title";
	    		else if(xAxis[0][objKey]["id"]) key = "id";
	    		else key = getKeys(xAxis[0][objKey])[0];
		        xArray.push(xAxis[0][objKey][key])
		        
			    //xAxisLabel = key;
		    } 
		    
		    var dataArr = new Array();
		    dataArr.push(['xValues', yAxisLabel]);
		    for(var row=0; row<yArray.length; row++){
		    	dataArr.push([ xArray[row], yArray[row] ]);
		    }
		    
			/*var data = google.visualization.arrayToDataTable([
			      ['Year', 'Sales', 'Expenses'],
			      ['2004',  1000,      400],
			      ['2005',  1170,      460],
			      ['2006',  660,       1120],
			      ['2007',  1030,      540]
			    ]);*/
			var data = google.visualization.arrayToDataTable(dataArr);
			
		    var options = {
		      //title: 'Company Performance',
		      //hAxis: {title: xAxisLabel,  titleTextStyle: {color: 'red'}},
		      legend: {position: "top"}
		    };
		
		    var chart = new google.visualization.ColumnChart(document.getElementById(this.compCtx.getViewPort()));
		    chart.draw(data, options);
		}
   
		google.load("visualization", "1", {packages:["corechart"], callback: drawChart.bind({'compCtx': this, 'xAxis': xAxis, 'yAxis': yAxis}) });
      
    }
	
	this.load();
}