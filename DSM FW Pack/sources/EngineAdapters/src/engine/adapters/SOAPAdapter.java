package engine.adapters;


import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Iterator;

import javax.activation.MimeType;
import javax.activation.MimeTypeParameterList;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import sun.net.www.MimeTable;

import com.predic8.wsdl.Binding;
import com.predic8.wsdl.Definitions;
import com.predic8.wsdl.WSDLParser;
import com.predic8.wstool.creator.RequestCreator;
import com.predic8.wstool.creator.RequestTemplateCreator;
import com.predic8.wstool.creator.SOARequestCreator;

import engine.utils.Conversions;
import groovy.xml.MarkupBuilder;
import groovy.xml.QName;

// POJO, no interface no extends

// The class registers its methods for the HTTP GET request using the @GET annotation. 
// Using the @Produces annotation, it defines that it can deliver several MIME types,
// text, XML and HTML. 

// The browser requests per default the HTML MIME type.

@Path("/SOAP")
public class SOAPAdapter {

	@Context
	UriInfo uriInfo;

	@Context 
	HttpServletRequest servletRequest;
	@Context 
	HttpServletResponse servletResponse;

	
	@POST 
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public JSONObject invoke() throws JSONException {

		 // creating the client to forward the rest call to external services
		HttpClient client = new DefaultHttpClient();
		HttpResponse response = null;
		
		try {
			// retrieving the invocation details from the request
			String reqString = Conversions.convertStreamToString(servletRequest.getInputStream());
			JSONObject jsonRequest = new JSONObject(reqString);

			JSONArray expectedOutputParameterNames = jsonRequest.getJSONArray("expectedOutputParameterNames");

			String targetOperation=jsonRequest.getString("operationReference");
			String targetURL=jsonRequest.getString("endpoint");			

			// building the SOAP request
			WSDLParser parser = new WSDLParser();

		    Definitions wsdl = parser.parse(targetURL+"?wsdl");
		    StringWriter writer = new StringWriter();
		    
		    String bindingName = "";
		    
		    // retrieving the binding name for SOAP v1.2 or V1.1 services. assuming that only one SOAP binding is defined (v1.2 preferred) 
		    for (Binding b: wsdl.getBindings()){
		    	if(b.getProtocol().equals("SOAP12"))
		    			bindingName = b.getName(); 
		    }
		    if(bindingName==""){
		    	for (Binding b: wsdl.getBindings()){
			    	if(b.getProtocol().equals("SOAP11"))
			    			bindingName = b.getName(); 
			    }
		    }
		    if(bindingName==""){
		    	return new JSONObject("{response:{_adapter_error:{'type':'unsupported_service','details':'Unsupported service! No SOAP binding found in the web service asociated to the SOAP component.'}}}");
		    }
		    
		    HashMap<String, String> inputParams = new HashMap<String, String>();
		    
		    SOARequestCreator creator = new SOARequestCreator();
		    creator.setBuilder(new MarkupBuilder(writer));
		    creator.setDefinitions(wsdl);
		    creator.setCreator(new RequestTemplateCreator());
		    
		    // creator.createRequest(PortType name, Operation name, Binding name);
		    creator.createRequest(wsdl.getBinding(bindingName).getPortType().getName(), targetOperation, bindingName);
		    System.out.println(writer);
		    
		    DocumentBuilderFactory factory =DocumentBuilderFactory.newInstance();
			factory.setNamespaceAware(true);
			
			InputSource sourceEnvelope = new InputSource(new StringReader(writer.toString()));
			Document writerXML =factory.newDocumentBuilder().parse(sourceEnvelope);
			writerXML.getDocumentElement().normalize();
		    JSONObject jsonParams = jsonRequest.getJSONObject("parameters");
			Iterator i = jsonParams.keys();
			while( i.hasNext()){ 
				String key = (String)i.next();
				// here we are assuming that input params names are the same as defined in the component descriptor (no NS discrimination is made)
				writerXML.getElementsByTagNameNS("*",key).item(0).setTextContent(jsonParams.getString(key));
			}
			String envelope = Conversions.xmlNodeToString(writerXML, false);
			
			//client.getHostConfiguration().setProxy("proxy.science.unitn.it", 3128);
			//client.getHostConfiguration().setProxy("proxyopera.unitn.it", 3128);

			HttpPost httpPost = new HttpPost(targetURL);
			StringEntity entity = new StringEntity(envelope, HTTP.UTF_8);
			//entity.setContentType("application/json");
			httpPost.setEntity(entity);

			httpPost.addHeader("Content-Type", MediaType.TEXT_XML);
			httpPost.addHeader("Cache-Control", "no-cache");
			httpPost.addHeader("SOAPAction", wsdl.getBinding(bindingName).getOperation(targetOperation).getOperation().getSoapAction());
			response = client.execute(httpPost);

			String serviceResponseString="";
			if (response.getStatusLine().getStatusCode()!= HttpStatus.SC_OK) {
				System.err.println("Method failed: " + response.getStatusLine());
				return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':'"+  response.getStatusLine() +"'}}}");
			}

			// Read the response body.
			//InputStream is = response.getEntity().getContent();
			//serviceResponseString = Conversions.convertStreamToString(is);

			JSONObject adapterResponse = new JSONObject("{'response':{}}");

			if(response.getFirstHeader("Content-Type").getValue().contains("xml") ){
				//InputSource source = new InputSource(new StringReader(serviceResponseString));
				Document serviceResponseXML =factory.newDocumentBuilder().parse(response.getEntity().getContent());
				serviceResponseXML.getDocumentElement().normalize();

				// check if the service response contains fields corresponding to the expected output params (do the best to "understand and use" service response)...
				for(int o=0; o<expectedOutputParameterNames.length(); o++){
					// ... if they are there return a JSON object containing the output params with their content
					if(serviceResponseXML.getElementsByTagName(expectedOutputParameterNames.getString(o)).getLength() > 0)
						adapterResponse.getJSONObject("response").put(expectedOutputParameterNames.getString(o) , Conversions.xmlNodeToString(serviceResponseXML.getElementsByTagNameNS("*",expectedOutputParameterNames.getString(o)).item(0), true));
					// ... if not and if only one output param is expected, assume all the service response corresponds to that single output param and return it as JSON 
					else if(expectedOutputParameterNames.length()==1){
						adapterResponse = new JSONObject("{'response':{'"+ expectedOutputParameterNames.getString(0) +"':"+ JSONObject.quote(Conversions.xmlNodeToString(serviceResponseXML,true)) +"}}");
						break;
					}
					// ... if none of the above, an error for mismatching between expected and actual response parameters is returned
					else
						return new JSONObject("{response:{_adapter_error:{'type':'unknown_output_params','details':'Impossible to find expected operation's output parameters in service response: "+ serviceResponseString +".'}}}");
				}
				return adapterResponse;
			}
			else
				return new JSONObject("{response:{_adapter_error:{'type':'unknown_response_content_type','details':'Response content type is unknown or not supported.'}}}");

		} catch (JSONException e) {
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':"+ JSONObject.quote(e.getMessage())+"}}}");
		} catch (SAXException e) {
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':"+ JSONObject.quote(e.getMessage())+"}}}");
		} catch (IOException e) {
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':"+ JSONObject.quote(e.getMessage())+"}}}");
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':"+ JSONObject.quote(e.getMessage())+"}}}");
		} catch (Exception e) {
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':"+ JSONObject.quote(e.getMessage())+"}}}");
		}
		finally{
			client.getConnectionManager().shutdown();
		}
	}

} 