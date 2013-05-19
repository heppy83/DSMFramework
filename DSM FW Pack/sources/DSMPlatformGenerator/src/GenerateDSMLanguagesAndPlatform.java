

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
import java.util.Random;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.smartcardio.CardNotPresentException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.jexl2.MapContext;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.traversal.DocumentTraversal;
import org.w3c.dom.traversal.NodeFilter;
import org.w3c.dom.traversal.NodeIterator;

/**
 * Servlet implementation class GenerateDSMLanguagesAndPlatform
 */
public class GenerateDSMLanguagesAndPlatform extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	// URI of the parent folder of the DSMFW web app
	private static final String DSMFWFolderURI = "/";
	// URL of the node server containing the DSMFW web app
	private static final String DSMFWServerURL = "http://localhost:1337";
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GenerateDSMLanguagesAndPlatform() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		Enumeration<String> paramsNames =request.getParameterNames();
		ArrayList <String> selectedFeatures= new ArrayList<String>();
		
		String schemasFolderURI = request.getRealPath("/schemas");
		
		InputStream domainSyntaxIS = null;
		
		try {
	        List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
	        for (FileItem item : items) {
	            if (item.isFormField()) {
	                // Process regular form field (input type="text|radio|checkbox|etc", select, etc).
	    			selectedFeatures.add(item.getFieldName());
	            	
	            } else {
	                // Process form file field (input type="file").
	                String fieldname = item.getFieldName();
	                
	                String filename = FilenameUtils.getName(item.getName());
	                
	                if(item.getSize()==0){
	                	String emptyDomainSyntaxFileURI = schemasFolderURI +"/domainSyntax.xml";
	                	
	                	File emptyDomainSyntaxFile = new File(emptyDomainSyntaxFileURI);
	                	domainSyntaxIS = new FileInputStream(emptyDomainSyntaxFile);
	                }
	                else
	                	domainSyntaxIS = item.getInputStream();
	            }
	        }
	    } catch (FileUploadException e) {
	        throw new ServletException("Cannot parse multipart request.", e);
	    }
		
		
		for(int i=0; i<selectedFeatures.size(); i++) {
			System.out.println("\n Feature: " + selectedFeatures.get(i));
		}
		
		String genResult = generate(selectedFeatures, schemasFolderURI, domainSyntaxIS);
		System.out.println(genResult);
		
		response.getWriter().println(genResult);
	}

	private String generate(ArrayList<String> selectedFeatures, String schemasFolderURI, InputStream domainSyntaxIS) {
		
		String returnPage = ""; 
		
		// generating an ID for the DSM platform being created
		String DSMPfId = "" + (new Random(new Date().getTime())).nextInt(99999999);
		
		// URI of the folder of the DSM Pf being created in the DSMFW web app folder
		String baseDSMPfFolderURI = DSMFWFolderURI + "/DSMFW/resources/DSMPlatforms/" + DSMPfId +"/";
		// URL of the DSM Pf being created in the DSMFW web app 
		String baseDSMPfURL = DSMFWServerURL + "/DSMFW/resources/DSMPlatforms/" + DSMPfId + "/";
		
		
		
		String featuresFileURI = schemasFolderURI +"/features.xml";
		String composSchemaFileURI = schemasFolderURI +"/compositionSchema.xsd";
		String compSchemaFileURI = schemasFolderURI +"/componentSchema.xsd";
		
		String configFileURI = baseDSMPfFolderURI +"configuration.xml";
		
		String customComposSchemaFileURI = baseDSMPfFolderURI +"DSMCompositionLanguage.xsd";
		String customCompSchemaFileURI = baseDSMPfFolderURI +"DSMComponentDescriptorLanguage.xsd";
		String domainSyntaxFileURI = baseDSMPfFolderURI +"DomainSyntax.xml";
		
		try {
			
			 
			
			HashMap <String, Boolean> featureList = new HashMap<String, Boolean>();
			ArrayList<String> includeList = new ArrayList<String>();
			ArrayList<String> constraintList = new ArrayList<String>();
			ArrayList<String> setList = new ArrayList<String>(); 
			
			File featureBaseFile = new File( featuresFileURI + "");
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document featureBase = dBuilder.parse(featureBaseFile);
			featureBase.getDocumentElement().normalize();
			
			NodeList featureNodes = featureBase.getElementsByTagName("feature");
			createFeatureList(selectedFeatures, featureList, featureNodes);
			
			NodeList constraintNodes = featureBase.getElementsByTagName("constraints");
			createConstraintList(selectedFeatures, constraintList, constraintNodes);
			if (checkConstraintCompatibility(constraintList, featureList)==false){
				return "Constraint compatibility check failed! Check your feature selection.";
			}
			
			NodeList includeNodes = featureBase.getElementsByTagName("include");
			createIncludeList(selectedFeatures, featureList, includeList, includeNodes);
			
			NodeList setNodes = featureBase.getElementsByTagName("setCardinality");
			createSetOperationList(selectedFeatures, setList, setNodes);
			
			// creating the folders for the DSM platform being created
			if ( !(new File(baseDSMPfFolderURI)).mkdir() ) return "Ups! Unable to create the folders for the new DSM platform! Try again.";
			if ( !(new File(baseDSMPfFolderURI+"compositions")).mkdir() ) return "Ups! Unable to create the folders for the new DSM platform! Try again.";
			if ( !(new File(baseDSMPfFolderURI+"components")).mkdir() ) return "Ups! Unable to create the folders for the new DSM platform! Try again.";
			if(featureList.get("user_interface")!=null){
				if ( !(new File(baseDSMPfFolderURI+"templates")).mkdir() ) return "Ups! Unable to create the folders for the new DSM platform! Try again.";
			}
			// Generate the custom composition XSD schema file
			File composSchemaFile = new File(composSchemaFileURI);
			Document composSchemaDoc = dBuilder.parse(composSchemaFile);
			composSchemaDoc.getDocumentElement().normalize();
			boolean composBuildRes = buildCustomFile(composSchemaDoc, includeList, setList, customComposSchemaFileURI);
			
			// Generate the custom component XSD schema file
			File compSchemaFile = new File(compSchemaFileURI);
			Document compSchemaDoc = dBuilder.parse(compSchemaFile);
			compSchemaDoc.getDocumentElement().normalize();
			boolean compBuildRes = buildCustomFile(compSchemaDoc, includeList, setList, customCompSchemaFileURI);
			
			// Generate the configuration document
			File configFile = new File(configFileURI);
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			Document configDoc =  factory.newDocumentBuilder().newDocument();
			boolean configBuildRes = buildConfigFile(configDoc, featureList, baseDSMPfURL, configFileURI, DSMPfId);
			
			
			boolean domSynBuildRes = writeFile(domainSyntaxFileURI, domainSyntaxIS);
			

			
			if(compBuildRes && composBuildRes && configBuildRes && domSynBuildRes)
				returnPage= createSuccessfulPage(baseDSMPfURL);
			else
				returnPage = "<html><body>" + 
							 "Compatibility check was successful, but an error during the language generation occurred! <br>" +
							 "<ul> <li>Custom Composition Schema: " + composBuildRes +
							 "<li> Custom Component Schema: " + compBuildRes +//==true?"GENERATED SUCCESSFULLY":"GENERATION FAILED" +
							 "<li> Custom Component Schema: " + configBuildRes +
							 "<li> Custom Component Schema: " + domSynBuildRes +
							 "</ul></body></html>";
		
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		
		return returnPage;
		
	}
	
	private String createSuccessfulPage(String baseDSMPfURL){
		
		return 	"<html>" +
					"<head>" +
					"<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">" +
					"<title>Composition Registration</title>" +
					"<style>" +
						"#uploadDiv {"+
						    "position: relative;"+
						    "left: 50%;"+
						    "width: 500px;"+
						    "height: 150px;"+
						    "margin-left: -250px;"+
						    "top: 100px;"+
						    "background-color: lightgray;"+
						    "padding: 30px;"+
						    "border-radius: 30px;"+
						    "font-family: sans-serif;"+
						    "font: small-caption;"+
						    "color: darkolivegreen;"+
					    "}"+
					    "#confPackageURL,#submit,#compDescr {"+
					    	"color: darkolivegreen;"+
					    "}"+
					    "body {"+
					    	"background-color: darkolivegreen;"+
					    "}"+
					"</style>"+
					"</head>"+
					"<body>"+
						"<div id=\"uploadDiv\">"+
							"<b>"+
							"Generation completed successfully! <br> <br></b>" +
							"The identifier URL for you <b>DSM platform configuration package</b> is: <br><br><b><i>" + baseDSMPfURL +
							"</i></b><br><br>You can dowloand the generated documents here:" +
							"<ul> <li><a href=\"" + baseDSMPfURL +  "configuration.xml\" target=\"_black\">DSM Platform Configuration Document</a>" +
							"<li><a href=\"" + baseDSMPfURL +  "DSMCompositionLanguage.xsd\" target=\"_black\">DSM Composition Language Schema</a>" +
							"<li><a href=\"" + baseDSMPfURL +  "DSMComponentDescriptionLanguage.xsd\" target=\"_black\">DSM Component Description Language Schema</a> </ul>" +
							"</b>"+
						"</div>"+
					"</body>"+
				"</html>";
	}
	
	private boolean writeFile(String fileURI, InputStream inputStream){
		
		try {
			File f=new File(fileURI);
			OutputStream out=new FileOutputStream(f);
			byte buf[]=new byte[1024];
			int len;
	
			while((len=inputStream.read(buf))>0)
				out.write(buf,0,len);
		
			out.close();
			
			inputStream.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	

	private boolean buildConfigFile(Document configDoc, HashMap<String, Boolean> featureList, String baseDSMPfURL, String configFileURI, String dSMPfId) {
		
		try{
			
		    Element configuration = configDoc.createElement("configuration");
		    configuration.setAttribute("platformId", dSMPfId);
		    configDoc.appendChild(configuration);
		    
			Element feats = configDoc.createElement("features");
			configuration.appendChild(feats);
		    
		    
			for (String currKey: featureList.keySet()) {
		    	boolean currVal = featureList.get(currKey);
		    	
		    	if(currVal){
		    		Element feat = configDoc.createElement("feature");
		    		feat.setAttribute("name", currKey);
		    		feats.appendChild(feat);
		    	}
		    }
		    
		    Element composLang = configDoc.createElement("DSMCompositionLanguage");
		    composLang.setAttribute("url", baseDSMPfURL+"DSMCompositionLanguage.xsd");
		    configuration.appendChild(composLang);
		    
		    Element componLang = configDoc.createElement("DSMComponentDescriptionLanguage");
		    componLang.setAttribute("url", baseDSMPfURL+"DSMComponentDescriptionLanguage.xsd");
		    configuration.appendChild(componLang);
		    
		    Element composRepo = configDoc.createElement("compositionsRepository");
		    composRepo.setAttribute("url", baseDSMPfURL+"compositions/");
		    configuration.appendChild(composRepo);
		    
		    Element componRepo = configDoc.createElement("componentsRepository");
		    componRepo.setAttribute("url", baseDSMPfURL+"components/");
		    configuration.appendChild(componRepo);
		    
		    if(featureList.get("user_interface")!=null){
		    	Element templRepo = configDoc.createElement("templatesRepository");
		    	templRepo.setAttribute("url", baseDSMPfURL+"templates/");
			    configuration.appendChild(templRepo);
		    }
		    
		    Element domainSyntax = configDoc.createElement("domainSyntax");
		    domainSyntax.setAttribute("url", baseDSMPfURL+"DomainSyntax.xml");
		    configuration.appendChild(domainSyntax);
		    
			// write the content into xml file
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			transformer.setOutputProperty(OutputKeys.INDENT, "yes");
			DOMSource source = new DOMSource(configDoc);
			StreamResult result = new StreamResult(new File(configFileURI));
	 
			// Output to console for testing
			// StreamResult result = new StreamResult(System.out);
	 
			transformer.transform(source, result);
	 
			System.out.println("File saved!");
			
		}
		catch(Exception e){
			e.printStackTrace();
			return false;
		}
		return true;

	}

	private boolean buildCustomFile(Document schemaDoc, ArrayList<String> includeList, ArrayList<String> setList, String customSchemaFileURI) {
		try{
			
			XPathFactory factory = XPathFactory.newInstance();
		    XPath xpath = factory.newXPath();
		    XPathExpression XPathExpr; 
			
			// this cast is checked on Apache implementation (Xerces):
		    DocumentTraversal traversal = (DocumentTraversal) schemaDoc;

		    NodeIterator iterator = traversal.createNodeIterator(schemaDoc.getDocumentElement(), NodeFilter.SHOW_ELEMENT, null, true);

		    // Delete all the unnecessary schema fragments.
		    // for each element of schemaBase check if it has a fragId attr. 
		    // if yes check if it is in the includeList, if it is not remove this node.
		    // remove the fragId attribute by all the nodes in the doc
		    for (Node n = iterator.nextNode(); n != null; n = iterator.nextNode()) {
		      
		      Node fragIdNode= n.getAttributes().getNamedItem("fragmentId");
		      if(!(fragIdNode==null || includeList.contains(fragIdNode.getNodeValue()))){
		    	  n.getParentNode().removeChild(n);
		      }
		      else if(fragIdNode!=null){
		    	  n.getAttributes().removeNamedItem("fragmentId");
		      }
		    }
		    
		    // Apply all the needed set cardinality operations. 
		    Iterator<String> setIter = setList.iterator();
		    while(setIter.hasNext()){
		    	String setString = setIter.next();
		    	
		    	String setId = setString.split(",")[0];
		    	String cardinalityType = setString.split(",")[1];
		    	String cardinalityValueString = setString.split(",")[2];
		    	int cardinalityValueNumber = cardinalityValueString.equals("unbounded")?1000:new Integer(cardinalityValueString).intValue();
		    	
		    	XPathExpr = xpath.compile("//*[@setId='"+ setId +"']");
			    Node setNode= (Node)XPathExpr.evaluate(schemaDoc, XPathConstants.NODE);
			    
			    if(setNode != null){
			    	String currentCardinalityString = setNode.getAttributes().getNamedItem(cardinalityType).getNodeValue();
				    int currentCardinality = currentCardinalityString.equals("unbounded")?1000:new Integer(currentCardinalityString).intValue();
				    
			    	if(cardinalityType.equals("minOccurs") && cardinalityValueNumber<currentCardinality)
			    		setNode.getAttributes().getNamedItem(cardinalityType).setNodeValue(cardinalityValueString);
			    	else if(cardinalityType.equals("maxOccurs") && cardinalityValueNumber>currentCardinality)
			    		setNode.getAttributes().getNamedItem(cardinalityType).setNodeValue(cardinalityValueString);
			    }
		    	
		    }
		    
		    //remove all setId attributes from final custom language. must be done at the very end since we cannot delete the attr from the DOM because different successive set operations may refer to it
		    setIter = setList.iterator();
		    while(setIter.hasNext()){
		    	String setString = setIter.next();
		    	
		    	String setId = setString.split(",")[0];
		    	
		    	XPathExpr = xpath.compile("//*[@setId='"+ setId +"']");
			    Node setNode= (Node)XPathExpr.evaluate(schemaDoc, XPathConstants.NODE);
			    
			    if(setNode != null){
			    	setNode.getAttributes().removeNamedItem("setId");
			    }
		    }
		    		
			// write the content into xml file
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			DOMSource source = new DOMSource(schemaDoc);
			StreamResult result = new StreamResult(new File(customSchemaFileURI));
	 
			// Output to console for testing
			// StreamResult result = new StreamResult(System.out);
	 
			transformer.transform(source, result);
	 
			System.out.println("File saved!");
			
		}
		catch(Exception e){
			e.printStackTrace();
			return false;
		}
		return true;
	}

	private void createConstraintList(ArrayList<String> selectedFeatures, ArrayList<String> constraintList, NodeList constraintNodes) {

		for (int temp = 0; temp < constraintNodes.getLength(); temp++) {

			Node currentConstr = constraintNodes.item(temp);
			if (currentConstr.getNodeType() == Node.ELEMENT_NODE) {
				String parentFeatName = currentConstr.getParentNode().getAttributes().getNamedItem("name").getNodeValue();

				if(selectedFeatures.contains(parentFeatName)){
					String constrString = currentConstr.getTextContent();

					constraintList.add(constrString);
				}

			}

		}
	}

	private void createSetOperationList(ArrayList<String> selectedFeatures, ArrayList<String> setList, NodeList setNodes) {
		// create the hashmap contianing the setCardinality operations to be applied on the final XSD spec. the format is: XSDelementName-(minOccurs/maxOccurs=value)
		for (int temp = 0; temp < setNodes.getLength(); temp++) {

			Node currentSet = setNodes.item(temp);
			if (currentSet.getNodeType() == Node.ELEMENT_NODE) {
				String parentFeatName = currentSet.getParentNode().getParentNode().getAttributes().getNamedItem("name").getNodeValue();

				if(selectedFeatures.contains(parentFeatName)){
					String elemName = currentSet.getAttributes().getNamedItem("element").getNodeValue();

					if(currentSet.getAttributes().getNamedItem("minOccurs") != null)
						setList.add(elemName +",minOccurs,"+currentSet.getAttributes().getNamedItem("minOccurs").getNodeValue());
					else if(currentSet.getAttributes().getNamedItem("maxOccurs") != null)
						setList.add(elemName + ",maxOccurs,"+currentSet.getAttributes().getNamedItem("maxOccurs").getNodeValue());
				}

			}
		}
	}

	private void createIncludeList(ArrayList<String> selectedFeatures,
			HashMap<String, Boolean> featureList,
			ArrayList<String> includeList, NodeList includeNodes) {
		// create the list of fragments IDs to be kept in the final XSD specification
		for (int temp = 0; temp < includeNodes.getLength(); temp++) {
 
		   Node currentInclude = includeNodes.item(temp);
		   if (currentInclude.getNodeType() == Node.ELEMENT_NODE) {
			  String parentFeatName = currentInclude.getParentNode().getParentNode().getAttributes().getNamedItem("name").getNodeValue();

			  String condition = "";
			  if(currentInclude.getAttributes().getNamedItem("if") != null)
				  condition=currentInclude.getAttributes().getNamedItem("if").getNodeValue();
			  
			  if(selectedFeatures.contains(parentFeatName) && evaluateBooleanExpression(featureList, condition)){
				  String fragsString = currentInclude.getAttributes().getNamedItem("fragments").getNodeValue();
				  String[] fragsList = fragsString.split(",");
				  
				  for(int f=0; f<fragsList.length; f++){
					  includeList.add(fragsList[f]);
				  }
				  
			  }
				  
		   }
		}
	}

	private void createFeatureList(ArrayList<String> selectedFeatures,
			HashMap<String, Boolean> featureList, NodeList featureNodes) {
		// create the hashmap containing the pairs featureName-selected/notSelected (true/false)
		for (int temp = 0; temp < featureNodes.getLength(); temp++) {
			Node currentFeat = featureNodes.item(temp);
			String featName = currentFeat.getAttributes().getNamedItem("name").getNodeValue();
			String featConstr = currentFeat.getChildNodes().item(3).getNodeValue();

			if(selectedFeatures.contains(featName))
				featureList.put(featName, true);
			else
				featureList.put(featName, false);
		}
	}

	private boolean evaluateBooleanExpression(HashMap<String, Boolean> featureList, String condition) {
		
		// magari fare merge con checkCompatConstr
		
		if(condition!=""){
			condition = condition.replaceAll(" AND ", " && ");
			condition = condition.replaceAll(" OR ", " || ");
			condition = condition.replaceAll(" NOT", " !");
			
			String[] tokens = condition.split(" ");
			
			for(int t=0; t<tokens.length; t++){
				if (featureList.containsKey(tokens[t]))
					condition = condition.replaceAll(tokens[t], featureList.get(tokens[t]).toString());
			}
			
			// create a script engine manager
	        ScriptEngineManager factory = new ScriptEngineManager();
	        // create a JavaScript engine
	        ScriptEngine engine = factory.getEngineByName("JavaScript");
	        // evaluate JavaScript code from String
	        try {
				boolean res = (Boolean) engine.eval(condition);
				return res;
			} catch (ScriptException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}
			
			
			/*// Create or retrieve a JexlEngine
	        JexlEngine jexl = new JexlEngine();
	        // Create an expression object
	        String jexlExp = condition;
	        Expression e = jexl.createExpression( jexlExp );
	
	        // Create a context and add data
	        //JexlContext jc = new MapContext();
	
	        // Now evaluate the expression, getting the result
	        Object o = e.evaluate(featureList);*/
		}
		
		return true;
	}
	
	private boolean checkConstraintCompatibility(ArrayList<String> constraintList, HashMap<String, Boolean> featureList){

		try {

			//for(f=0; f<fList.length; f++){
			for(int c=0; c<constraintList.size(); c++){
				if(constraintList.get(c)!=""){
					String constraint = constraintList.get(c);

					String tokens = constraint;

					constraint = constraint.replaceAll("(?i) XOR ", " != ");
					constraint = constraint.replaceAll("(?i) AND ", " && ");
					constraint = constraint.replaceAll("(?i) OR ", " || ");
					constraint = constraint.replaceAll("(?i)NOT\\(", "!(");

					tokens = tokens.replaceAll("(?i) XOR ", " ");
					tokens = tokens.replaceAll("(?i) AND ", " ");
					tokens = tokens.replaceAll("(?i) OR ", " ");
					tokens = tokens.replaceAll("(?i)NOT\\(", "(");
					tokens = tokens.replaceAll("\\(", "");
					tokens = tokens.replaceAll("\\)", "");

					String[] tokensList = tokens.split(" ");

					int t=0;
					while(t<tokensList.length){
						tokensList[t] = tokensList[t].trim();

						if(tokensList[t]!=""){
							if (featureList.get(tokensList[t])==true)
								constraint = constraint.replaceAll(tokensList[t], "true");
							else
								constraint = constraint.replaceAll(tokensList[t],"false");
						}
						t++;
					}

					// create a script engine manager
					ScriptEngineManager factory = new ScriptEngineManager();
					// create a JavaScript engine
					ScriptEngine engine = factory.getEngineByName("JavaScript");
					// evaluate JavaScript code from String

					boolean res = (Boolean) engine.eval(constraint);
					//System.out.println("This selection is not valid! It brakes the constraint of feature \"" + c + "\"\n Contraint: " + fList[c].constraint + "\n Selection values: "+ constraint);
					if (res==false) 
						return false;

				}

			}

		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
		}

		System.out.println("Constraints compatibility check completed successfully!");
		return true; 
	}

}
