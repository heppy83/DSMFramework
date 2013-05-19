// TODO: this kind of stuff should be loaded through some API of the engine; like: Engine.loadResource("<script...>");
document.write("<script src='http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAASDjNH0xurmoVxLTdNE_9GhRSyonVBZKqRvC_bSfLJp1TghFssRSNXq5xTl0XGQ2aoGHYbkkI5dNEzA' type='text/javascript'> </script>");

//constructor
function gmap(correlationId, viewPort,constrParams){ 
	this._map;
	this._viewPort=viewPort;
	this._params = constrParams;
	
	this.getMap = function(){
		return this._map;
	};

	this.setMap = function(map){
		this._map = map;
	};
	
	this.getViewPort = function(){
		return this._viewPort;
	};

	this.getParams = function(){
		return this._params;
	};

	//constructor method invoked by last line of the comp's code (i.e., when the comp is loaded)
	this.load = function(){
		if (GBrowserIsCompatible()) {
			this.setMap(new GMap2(document.getElementById(this.getViewPort())));
			var map = this.getMap();
			//map.addControl(new GSmallMapControl());
			//map.addControl(new GMapTypeControl());
			
			var params=this.getParams();
			var lat=parseFloat(params['Latitude']);
			var lng=parseFloat(params['Longitude']);
			var zoom= 13;//parseInt(params['Zoom level']);
			                 
			map.setCenter(new GLatLng(lat,lng), zoom);
			map.setUIToDefault();
			//this._map.setCenter(new GLatLng(-.07421875, 4.258768357307995), 5);
		}
	};
	
	// public operation of the component
	this.showPoint = function(latitude, longitude){//inputArray){
//		var lat=inputArray["Latitude"];
//		var lng=inputArray["Longitude"];
		var lat=latitude;
		var lng=longitude;
		
		var zoom = 15;
		var label = "You are here!";
		
		var map = this.getMap();
		map.clearOverlays();
		map.setCenter(new GLatLng(lat, lng));
		var marker = new GMarker(new GLatLng(lat, lng));
		map.addOverlay(marker);
		//marker.openInfoWindowHtml("<font color=#000000>" + label +  "</font>");
	};
	
	// public operation of the component
	this.showAddress = function(address, zoom, label) {
//		var address=inputArray["Address"];
//		var zoom=inputArray["Zoom level"];
//		var label=inputArray["Label"];
		
		if (zoom == 'undefined'){
			zoom = 15;
		}
		if (label == 'undefined'){
			label = address;
		}
		var map = this.getMap();
		map.clearOverlays();
		var geocoder = new GClientGeocoder();
		if (geocoder) {
			geocoder.getLatLng(address,
		        function(point) {
			        if (!point) {
			          alert(address + " not found");
			        } else {
			          	map.setCenter(point, parseInt(zoom));
			          	var marker = new GMarker(point);
						map.addOverlay(marker);
						marker.openInfoWindowHtml("<font color=#000000>" + label +  "</font>");
			        }
				}
			);
		}
	};
	
	this.load();
}