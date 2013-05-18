import java.io.FileOutputStream;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;

public class InterfaceGeneratorMain {
public static void main(String[] args) {
  try {
	  
    TransformerFactory tFactory = TransformerFactory.newInstance();

    Transformer transformer =
      tFactory.newTransformer
         (new javax.xml.transform.stream.StreamSource
            ("WebContent/interfaceGeneration.xsl"));

    transformer.transform
      (new javax.xml.transform.stream.StreamSource
            ("WebContent/schemas/features.xml"),
       new javax.xml.transform.stream.StreamResult
            ( new FileOutputStream("WebContent/featureSelectionUI.html")));
	  
//	  TransformerFactory factory = TransformerFactory.newInstance();
//	  
//	  
//	  Source xsl = new StreamSource(new File("WebContent/interfaceGeneration.xsl"));
//	  Templates template = factory.newTemplates(xsl);
//	  Transformer transformer = template.newTransformer();
//	  
//	  Source xml = new StreamSource(new File("WebContent/schemas/features.xml"));
//	  Result result = new StreamResult(new File("WebContent/featureSelectionUI.html"));
//	  transformer.transform(xml, result);
//	  
    }
  catch (Exception e) {
    e.printStackTrace( );
    }
  }
}