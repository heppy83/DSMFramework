/**
 * 
 */

var Utils = new Object(); 

Utils.stringToXML = function(text) {
	try {
		var xml = null;

		if ( window.DOMParser ) {

			var parser = new DOMParser();
			xml = parser.parseFromString( text, "text/xml" );

			var found = xml.getElementsByTagName( "parsererror" );

			if ( !found || !found.length || !found[ 0 ].childNodes.length ) {
				return xml;
			}

			return null;
		} else {

			xml = new ActiveXObject( "Microsoft.XMLDOM" );

			xml.async = false;
			xml.loadXML( text );

			return xml;
		}
	} catch ( e ) {
		// suppress
	}
};

Utils.XMLToString = function(xmlData) { 

	return $.parseXML(xmlData);
};

Utils.JSONToString = function(JSONData) { 

	return $.toJSON(JSONData);
};

Utils.stringToJSON = function(text) { 

	return $.evalJSON(text);
};