<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:variable name="ctx" select="''"/>

	<xsl:template match="/">
		 
      	<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> </meta>
				<title>Feature Selection</title>
				
				<link rel="stylesheet" type="text/css" href="./tooltip/style.css" > </link>
				<script type="text/javascript" language="javascript" src="./tooltip/script.js"> </script>
				
				<link rel="stylesheet" type="text/css" href="./featureSelectionUI.css" > </link>
				
				<script type="text/javascript" language="javascript">
				<![CDATA[
					fList= {};
					
					function addFeature(f, constr) {
						if(fList[f]==undefined)
							fList[f]={selected:true, constraint:constr};
						else
							fList[f].selected=!fList[f].selected;
					}
					
					function checkCompatibility(){
						
						//for(f=0; f<fList.length; f++){
						for(c in fList){
							if(fList[c].selected==true && fList[c].constraint!=""){
								constraint = fList[c].constraint;
						
								tokens = constraint;
								
								constraint = constraint.replace(/ XOR /gi, " != ");
								constraint = constraint.replace(/ AND /gi, " && ");
								constraint = constraint.replace(/ OR /gi, " || ");
								constraint = constraint.replace(/NOT\(/gi, "!(");
								
								tokens = tokens.replace(/ XOR /gi, " ");
								tokens = tokens.replace(/ AND /gi, " ");
								tokens = tokens.replace(/ OR /gi, " ");
								tokens = tokens.replace(/NOT\(/gi, "(");
								tokens = tokens.replace(/\(/g, "");
								tokens = tokens.replace(/\)/g, "");
								
								tokens = tokens.split(" ");
								
								t=0;
								while(t<tokens.length){
									tokens[t] = tokens[t].trim();
									
									if(tokens[t]!=""){
										if (fList[tokens[t]])
											constraint = constraint.replace(tokens[t], fList[tokens[t]].selected);
										else
											constraint = constraint.replace(tokens[t],false);
									}
									t++;
								}
								
								res = eval(constraint);
								
								if(res==false){
									document.getElementById("checkResult").innerHTML='This selection is not valid! It brakes the constraint of feature \"' + c + '\"\n Constraint: ' + fList[c].constraint + '\n Selection values: '+ constraint;
									return 0;
								}
							}
						}
						
						document.getElementById("checkResult").innerHTML="Constraints compatibility check completed successfully!";
					}
				]]>					
				</script>
			</head>
			<body style="padding:20px;">
				<xsl:attribute name="onload"> addFeature('general_constraints','<xsl:value-of select="features/feature[@name='general_constraints']/constraints" />'); </xsl:attribute>
			<h2> Features Selection</h2>
			<br/><br/>
			
			<form action="GenerateDSMLanguagesAndPlatform" method="post">
				
				<xsl:for-each select="features/feature">
					
					<!-- <xsl:if test="$ctx=@context">
					<xsl:if test="features/feature[@context='component'][1]">
						<fieldset><legend><xsl:value-of select="@context" /> Features</legend>
						<br/><br/>ciao
					</xsl:if>
					<xsl:variable name="ctx"><xsl:value-of select="@context" /></xsl:variable> -->
					
					<xsl:if test="@name=/features/feature[@context='component'][1]/@name">
						<div class="component"> <h3>Components Features</h3> 
					</xsl:if>
					<xsl:if test="@name=/features/feature[@context='controlflow'][1]/@name">
						</div><div class="controlflow">  <h3>Control Flow Features</h3>
					</xsl:if>
					<xsl:if test="@name=/features/feature[@context='datapassing'][1]/@name">
						</div><div class="datapassing">  <h3>Data Passing Features</h3>
					</xsl:if>
					<xsl:if test="@name=/features/feature[@context='presentation'][1]/@name">
						</div><div class="presentation"> <h3>Presentation Features</h3>
					</xsl:if>
					<xsl:if test="@name=/features/feature[@context='collaboration'][1]/@name">
						</div><div class="collaboration">  <h3>Collaboration Features</h3>
					</xsl:if>
					<xsl:if test="@name=/features/feature[@context='platform'][1]/@name">
						</div><div class="platform">  <h3>Platform Features</h3>
					</xsl:if>

					<input>
						<xsl:attribute name="name"> <xsl:value-of select="@name" /> </xsl:attribute>
						<xsl:attribute name="onmouseover">tooltip.show('<xsl:value-of select="description" />');</xsl:attribute>
						<xsl:attribute name="onmouseout">tooltip.hide();</xsl:attribute>
						<xsl:attribute name="onclick">addFeature('<xsl:value-of select="@name" />','<xsl:value-of select="constraints" />');</xsl:attribute>
						<xsl:attribute name="type">checkbox</xsl:attribute>
						<xsl:if test="@name='general_constraints'">
							<xsl:attribute name="checked">checked</xsl:attribute>
						</xsl:if>
					</input>
					<xsl:value-of select="@label" />
					<br/><br/>
				</xsl:for-each>
				
				</div>
				<br/><br/>
				<input onclick="checkCompatibility()" value="Check constraints!" type="button"/><br/>
				<span style="top: 10px; position: relative; color:darkred;" id="checkResult"></span> <br/><br/><br/>
				<input type="submit" value="Generate" />
				
			</form>
			
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>