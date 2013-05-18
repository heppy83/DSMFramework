package engine.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

public class Conversions {

	public static String convertStreamToString(InputStream is) throws Exception {
		BufferedReader reader = new BufferedReader(new InputStreamReader(is));
		StringBuilder sb = new StringBuilder();
		String line = null;
		while ((line = reader.readLine()) != null) {
			sb.append(line + "\n");
		}
		is.close();
		
		if(sb.toString().charAt(sb.toString().length()-1)=='\n')
			return sb.toString().substring(0,sb.toString().length()-1);
		else
			return sb.toString();
	}
	
	public static String xmlNodeToString(Node node, boolean excludeRoot) {
		try {
			Source source = new DOMSource(node);
			StringWriter stringWriter = new StringWriter();
			Result result = new StreamResult(stringWriter);
			TransformerFactory factory = TransformerFactory.newInstance();
			Transformer transformer = factory.newTransformer();
			transformer.transform(source, result);
			String nodeName = node.getNodeName();

			String returnString = stringWriter.getBuffer().toString();
			
			int beginIndex;
			if((beginIndex=returnString.indexOf("<?xml"))>-1 || (beginIndex=returnString.indexOf("<?XML"))>-1){
				returnString = returnString.substring(0, beginIndex) + returnString.substring(returnString.indexOf("?>", beginIndex)+2, returnString.length());
			}
			
			if( excludeRoot && (beginIndex=returnString.indexOf("<"+nodeName))>-1){
				returnString = returnString.substring(0, beginIndex) + returnString.substring(returnString.indexOf(">", beginIndex + nodeName.length())+1, returnString.indexOf("</"+ nodeName, beginIndex));
			}
			
			return returnString;

		} catch (TransformerConfigurationException e) {
			e.printStackTrace();
		} catch (TransformerException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static Document stringToXMLDocument(String s) throws SAXException, IOException, ParserConfigurationException{
		DocumentBuilderFactory dbfac = DocumentBuilderFactory.newInstance();
        DocumentBuilder docBuilder = dbfac.newDocumentBuilder();
        Document doc = docBuilder.parse(s);
        
        return doc;
	}
	
}
