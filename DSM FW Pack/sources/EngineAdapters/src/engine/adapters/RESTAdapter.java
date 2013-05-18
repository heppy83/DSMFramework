package engine.adapters;


import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.net.URI;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
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
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import engine.utils.Conversions;

// POJO, no interface no extends

// The class registers its methods for the HTTP GET request using the @GET annotation. 
// Using the @Produces annotation, it defines that it can deliver several MIME types,
// text, XML and HTML. 

// The browser requests per default the HTML MIME type.

@Path("/REST")
public class RESTAdapter {
	
	static final String REFERENCE = "reference"; // Used to require a service to return only the reference to the data
	static final String DATA = "data"; // Used to get from a service only the actual data. This mode is used only with services which do not understand the Reference Transferring Mode.
	static final String NO_SUPPORT = "no_reference_mode_support"; // Used to state that a component does not support the reference passing mode.

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

		try {
			String reqString = Conversions.convertStreamToString(servletRequest.getInputStream());
			JSONObject jsonRequest = new JSONObject(reqString);

			JSONArray expectedOutputParameterNames = jsonRequest.getJSONArray("expectedOutputParameterNames");

			// creating the client to forward the rest call to external services
			String targetMethod=jsonRequest.getString("method");
			String targetURL=jsonRequest.getString("endpoint");
			
			String requestDataTransferringMode = jsonRequest.getString("requestDataTransferringMode"); // it can be DATA or REFERENCE
			String responseDataTransferringMode = jsonRequest.getString("responseDataTransferringMode"); // it can be DATA or REFERENCE

			HttpClient client = new DefaultHttpClient();
			HttpResponse response = null;


			//client.getHostConfiguration().setProxy("proxy.science.unitn.it", 3128);
			//client.getHostConfiguration().setProxy("proxyopera.unitn.it", 3128);


			if(targetMethod.equalsIgnoreCase("GET")){
				
				URIBuilder builder = new URIBuilder(targetURL);
				
				//HttpGet httpGet = new HttpGet(targetURL);
				JSONObject jsonParams = jsonRequest.getJSONObject("parameters");
				Iterator i = jsonParams.keys();
				while( i.hasNext()){ 
					String key = (String)i.next();
					//httpGet.getParams().setParameter( key, jsonParams.get(key));
					builder.setParameter(key, jsonParams.getString(key));
				}
				
				// if the service being invoked supports dataReferencePassing mode, inform it what it is
				// receiving in the current request (either references or data) and what it must return as response (either references or data)
				if(!responseDataTransferringMode.equals(NO_SUPPORT)){
//					httpGet.getParams().setParameter( "_requestDataTransferringMode", requestDataTransferringMode);
//					httpGet.getParams().setParameter( "_responseDataTransferringMode", responseDataTransferringMode);
					
					builder.setParameter( "_requestDataTransferringMode", requestDataTransferringMode);
					builder.setParameter( "_responseDataTransferringMode", responseDataTransferringMode);
				}
				
				URI uri = builder.build();
				HttpGet httpGet = new HttpGet(uri);
				
				httpGet.addHeader("Cache-Control", "no-cache");
				response = client.execute(httpGet);
			}
			else if(targetMethod.equalsIgnoreCase("POST")){
				HttpPost httpPost = new HttpPost(targetURL);
				JSONObject jsonParams = jsonRequest.getJSONObject("parameters");
				
				// if the service being invoked supports dataReferencePassing mode, inform it what it is
				// receiving in the current request (either references or data) and what it must return as response (either references or data)
				if(!responseDataTransferringMode.equals(NO_SUPPORT)){
					jsonParams.put( "_requestDataTransferringMode", requestDataTransferringMode);
					jsonParams.put( "_responseDataTransferringMode", responseDataTransferringMode);
				}
				
				StringEntity entity = new StringEntity(jsonParams.toString(), HTTP.UTF_8);
				//entity.setContentType("application/json");
				httpPost.setEntity(entity);

				httpPost.addHeader("Cache-Control", "no-cache");
				response = client.execute(httpPost);
			}

			String serviceResponseString="";
			if (response.getStatusLine().getStatusCode()!= HttpStatus.SC_OK) {
				System.err.println("Method failed: " + response.getStatusLine());
				return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':'"+ response.getStatusLine() +"'}}}");
			}

			// Read the response body.
			InputStream is = response.getEntity().getContent();
			serviceResponseString = Conversions.convertStreamToString(is);

			client.getConnectionManager().shutdown();

			JSONObject adapterResponse = new JSONObject("{'response':{}}");

			if(responseDataTransferringMode.equals(REFERENCE)){
				adapterResponse.put("responseDataTransferringMode", "reference");
			}
			else if(responseDataTransferringMode.equals(NO_SUPPORT) || responseDataTransferringMode.equals(DATA)){
				adapterResponse.put("responseDataTransferringMode", "data");
			}
			
			if(response.getFirstHeader("Content-Type").getValue().equals(MediaType.APPLICATION_JSON)){
				JSONObject serviceResponseJSON = new JSONObject(serviceResponseString);
				
				// check if the service response contains fields corresponding to the expected output params (do the best to "understand and use" service response)...
				for(int o=0; o<expectedOutputParameterNames.length(); o++){
					// ... if they are there return a JSON object containing the output params with their content
					if(serviceResponseJSON.get(expectedOutputParameterNames.getString(o))!=null)
						adapterResponse.getJSONObject("response").put(expectedOutputParameterNames.getString(o) , serviceResponseJSON.get(expectedOutputParameterNames.getString(o)));
					// ... if not and if only one output param is expected, assume all the service response correspond to that single output param and return it as JSON
					else if(expectedOutputParameterNames.length()==1){
						adapterResponse = new JSONObject("{'response':{'"+ expectedOutputParameterNames.getString(0) +"':"+ serviceResponseString +"}}");
						break;
					}
					// ... if none of the above, an error for mismatching between expected and actual response parameters is returned
					else
						return new JSONObject("{response:{_adapter_error:{'type':'unknown_output_params','details':'Impossible to find expected operations output parameters in service response: "+ serviceResponseString +".'}}");
				}
				return adapterResponse;
			}
			else if(response.getFirstHeader("Content-Type").getValue().equals(MediaType.APPLICATION_XML) || response.getFirstHeader("Content-Type").getValue().equals(MediaType.TEXT_XML)){
				DocumentBuilderFactory factory =DocumentBuilderFactory.newInstance();
				System.out.println(serviceResponseString);
				InputSource source = new InputSource(new StringReader(serviceResponseString));
				Document serviceResponseXML =factory.newDocumentBuilder().parse(source);
				serviceResponseXML.getDocumentElement().normalize();

				// check if the service response contains fields corresponding to the expected output params (do the best to "understand and use" service response)...
				for(int o=0; o<expectedOutputParameterNames.length(); o++){
					// ... if they are there return a JSON object containing the output params with their content
					if(serviceResponseXML.getElementsByTagName(expectedOutputParameterNames.getString(o)).getLength() > 0){
						adapterResponse.getJSONObject("response").put(expectedOutputParameterNames.getString(o) , Conversions.xmlNodeToString(serviceResponseXML.getElementsByTagName(expectedOutputParameterNames.getString(o)).item(0), true));
							
					}
					// ... if not and if only one output param is expected, assume all the service response correspond to that single output param and return it as JSON 
					else if(expectedOutputParameterNames.length()==1){
						adapterResponse.getJSONObject("response").put(expectedOutputParameterNames.getString(0), JSONObject.quote(serviceResponseString)); //adapterResponse = new JSONObject("{'response':{'"+ expectedOutputParameterNames.getString(0) +"':"+ JSONObject.quote(serviceResponseString) +"}}");
						break;
					}
					// ... if none of the above, an error for mismatching between expected and actual response parameters is returned
					else
						return new JSONObject("{response:{_adapter_error:{'type':'unknown_output_params','details':'Impossible to find expected operations output parameters in service response: "+ serviceResponseString +".'}}}");
				}
				return adapterResponse;
			}
			else if(response.getFirstHeader("Content-Type").getValue().equals(MediaType.TEXT_PLAIN) ){
				System.out.println(serviceResponseString);

				// if only one output param is expected, assume all the service response correspond to that single output param and return it as JSON 
				if(expectedOutputParameterNames.length()==1){
					adapterResponse.getJSONObject("response").put(expectedOutputParameterNames.getString(0), JSONObject.quote(serviceResponseString)); //adapterResponse = new JSONObject("{'response':{'"+ expectedOutputParameterNames.getString(0) +"':"+ JSONObject.quote(serviceResponseString) +"}}");
				}
				// ... if none of the above, an error for mismatching between expected and actual response parameters is returned
				else
					return new JSONObject("{response:{_adapter_error:{'type':'unknown_output_params','details':'Impossible to find expected operations output parameters in service response: "+ serviceResponseString +".'}}}");
				
				return adapterResponse;
			}
			else
				return new JSONObject("{response:{_adapter_error:{'type':'unknown_response_content_type','details':'Response conte type is unknown or not supported.'}}}");

		} catch (JSONException e) {
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':'"+ e.getMessage()+"'}}}");
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':'"+ e.getMessage()+"'}}}");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':'"+ e.getMessage()+"'}}}");
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':'"+ e.getMessage()+"'}}}");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new JSONObject("{response:{_adapter_error:{'type':'service_invocation_error','details':'"+ e.getMessage()+"'}}}");
		}
	}

} 