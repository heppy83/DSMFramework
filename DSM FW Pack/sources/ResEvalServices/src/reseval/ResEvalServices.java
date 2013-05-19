package reseval;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collection;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;


// POJO, no interface no extends

// The class registers its methods for the HTTP GET request using the @GET annotation. 
// Using the @Produces annotation, it defines that it can deliver several MIME types,
// text, XML and HTML. 

// The browser requests per default the HTML MIME type.

//Sets the path to base URL + /hello
@Path("/rest")
public class ResEvalServices {
	
	@Context
	UriInfo uriInfo;
	
	@Context 
	HttpServletRequest servletRequest;
	@Context 
	HttpServletResponse servletResponse;
	
	
	private String researchersStr = "["+
										"{'researcher': {'name': 'Tom Smith', 'affiliation':'University of Toronto'}}," +
										"{'researcher': {'name': 'Silvio Berlusconi', 'affiliation':'DISI'}}," +
										"{'researcher': {'name': 'Pierluigi Bersani', 'affiliation':'DISI'}}," +
										"{'researcher': {'name': 'Mario Monti', 'affiliation':'DISI'}}," +
										"{'researcher': {'name': 'Beppe Grillo', 'affiliation':'DISI'}}," +
										"{'researcher': {'name': 'Matteo Renzi', 'affiliation':'DISI'}}," +
										"{'researcher': {'name': 'Gianfranco Fini', 'affiliation':'DISI'}}," +
										"{'researcher': {'name': 'Umberto Bossi', 'affiliation':'DISI'}}," +
										"{'researcher': {'name': 'Roberto Maroni', 'affiliation':'DISI'}}" +
									"]";
	
	private String pubsStr = "["+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Tom Smith' }},"+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Silvio Berlusconi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Silvio Berlusconi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Silvio Berlusconi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Silvio Berlusconi' }},"+ "{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Silvio Berlusconi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Silvio Berlusconi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Silvio Berlusconi' }},"+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Pierluigi Bersani' }},"+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Mario Monti' }},"+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Beppe Grillo' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Beppe Grillo' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Beppe Grillo' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Beppe Grillo' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Beppe Grillo' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Beppe Grillo' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Beppe Grillo' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Beppe Grillo' }},"+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Matteo Renzi' }},"+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Gianfranco Fini' }},"+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Umberto Bossi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Umberto Bossi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Umberto Bossi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Umberto Bossi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Umberto Bossi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Umberto Bossi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Umberto Bossi' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Umberto Bossi' }},"+
								"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2000' ,'author':'Roberto Maroni' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2001' ,'author':'Roberto Maroni' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':2002' ,'author':'Roberto Maroni' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Roberto Maroni' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Roberto Maroni' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Roberto Maroni' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Roberto Maroni' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Roberto Maroni' }},"+"{'publication':{'title':'"+ (int)(Math.random()*1000) +"', 'year':200"+ (int)(Math.random()*10%3) +"' ,'author':'Roberto Maroni' }}"+
							"]";
	private JSONArray researchers;
	private JSONArray publications;
	
	public ResEvalServices(){
		try{
			researchers = new JSONArray(researchersStr);
			publications = new JSONArray(pubsStr);
		} catch(Exception e){
			e.printStackTrace();
		}
	}
	
	

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	//@Consumes(MediaType.APPLICATION_JSON)
	@Path("/researcher")
	public JSONObject getResearcher() {
		
		try {
			
			String name = servletRequest.getParameter("name");
			
			for(int i=0; i<researchers.length(); i++){
				JSONObject res=researchers.getJSONObject(i);
				if (res.getJSONObject("researcher").get("name").equals(name)){
					JSONArray resArr = new JSONArray();
					resArr.put(res);
					JSONObject response = new JSONObject();
					response.put("researcher",resArr);
					
					System.out.println("geResearchers - " + response);
					return response;
				}
			}
			
			JSONObject response = new JSONObject();
			response.put("researcher", new JSONObject());
			return response;
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	//@Consumes(MediaType.APPLICATION_JSON)
	@Path("/disiResearchers")
	public JSONObject disiResearcher() {
		
		try {
			JSONArray resArrArr = new JSONArray();
			
			for(int i=0; i<researchers.length(); i++){
				JSONObject res=researchers.getJSONObject(i);
				if (res.getJSONObject("researcher").get("affiliation").equals("DISI")){
					JSONArray resArr = new JSONArray();
					resArr.put(res);
					resArrArr.put(resArr);
				}
			}
			
			JSONObject response = new JSONObject();
			response.put("researchers",resArrArr);
			System.out.println("geResearcher - " + response);
			return response;

		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	//@Consumes(MediaType.APPLICATION_JSON)
	@Path("/scholar")
	public JSONObject getPublications() {
		
		try {
			String reqString = convertStreamToString(servletRequest.getInputStream());
			JSONObject jsonRequest = new JSONObject(reqString);
			String ressStr = jsonRequest.getString("researchers");

			JSONArray ress = new JSONArray(ressStr);
			
			JSONArray ressArrArr;
			try{
				JSONArray test = ress.getJSONArray(0);
				ressArrArr = ress;
			} catch(Exception e){
				ressArrArr = new JSONArray();
				ressArrArr.put(ress);
			}
			JSONArray responseArrArr = new JSONArray();
			
			for(int a=0; a<ressArrArr.length(); a++){
				JSONArray currRess = ressArrArr.getJSONArray(a);
				JSONArray currPubs = new JSONArray();
				
				for(int i=0; i<currRess.length(); i++){
					JSONObject res=currRess.getJSONObject(i);
					for(int j=0; j<publications.length(); j++){
						JSONObject pub = publications.getJSONObject(j);
						if (res.getJSONObject("researcher").get("name").equals(pub.getJSONObject("publication").get("author"))){
							currPubs.put(pub);
						}
					}
					
				}
				responseArrArr.put(currPubs);
			}
			
			JSONArray response = new JSONArray();
			response = (responseArrArr.length()==1)? responseArrArr.getJSONArray(0) : responseArrArr;
			
			JSONObject outputParam = new JSONObject();
			outputParam.put("publications", response);
			System.out.println("gePublications - " + response);
			return outputParam;
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	//@Consumes(MediaType.APPLICATION_JSON)
	@Path("/publicationsPerYear")
	public JSONObject getImpact() {
		
		try {
			String reqString = convertStreamToString(servletRequest.getInputStream());
			JSONObject jsonRequest = new JSONObject(reqString);
			String pubsStr = jsonRequest.getString("publicationSet");
			
			JSONArray pubs = new JSONArray(pubsStr);
			
			JSONArray pubsArrArr;
			try{
				JSONArray test = pubs.getJSONArray(0);
				pubsArrArr = pubs;
			} catch(Exception e){
				pubsArrArr = new JSONArray();
				pubsArrArr.put(pubs);
			}
			JSONArray responseArrArr = new JSONArray();
			
			for(int a=0; a<pubsArrArr.length(); a++){
			
				HashMap<String, Integer> impacts = new HashMap<String, Integer>();
				JSONArray currPubs = pubsArrArr.getJSONArray(a);
				
				for(int i=0; i<currPubs.length(); i++){
					JSONObject pub=currPubs.getJSONObject(i);
					if(impacts.containsKey(pub.getJSONObject("publication").get("year")))
						impacts.put(pub.getJSONObject("publication").getString("year"), new Integer((impacts.get(pub.getJSONObject("publication").get("year")).intValue()+1)));
					else
						impacts.put(pub.getJSONObject("publication").getString("year"), new Integer(1));
					
				}
				double pubsPerYear = 0;
				for(String key: impacts.keySet()){
					pubsPerYear+=impacts.get(key).intValue();
				}
				pubsPerYear = pubsPerYear / impacts.size();
				
				JSONObject responseImpact = new JSONObject();
				responseImpact.put("publicationsPerYearValue", pubsPerYear);
				
				JSONArray responseImpactArr = new JSONArray();
				responseImpactArr.put(responseImpact);
				
				responseArrArr.put(responseImpactArr );
			}
			
			JSONArray response = new JSONArray();
			response = (responseArrArr.length()==1)? responseArrArr.getJSONArray(0): responseArrArr;
			
			JSONObject outputParam = new JSONObject();
			outputParam.put("impactValues", response);
			System.out.println("geImpact - " + response);
			return outputParam;
			
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	private String convertStreamToString(InputStream is) throws Exception {
	    BufferedReader reader = new BufferedReader(new InputStreamReader(is));
	    StringBuilder sb = new StringBuilder();
	    String line = null;
	    while ((line = reader.readLine()) != null) {
	      sb.append(line + "\n");
	    }
	    is.close();
	    return sb.toString();
	  }
	
} 