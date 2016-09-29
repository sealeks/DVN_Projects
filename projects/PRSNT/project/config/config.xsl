<?xml version="1.0"?>

<xsl:stylesheet version="1.0"
xmlns="http://www.w3.org/2000/svg"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:html="http://www.w3.org/TR/xhtml1"
xmlns:xlink="http://www.w3.org/1999/xlink" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    
    <xsl:include href="../web-utils/libs/main/mainlib.xsl" xsi:schemaLocation="../web-utils/libs/main/mainlib.xsd"/>
    <xsl:include href="../web-utils/libs/elec/eleclib.xsl" xsi:schemaLocation="../web-utils/libs/elec/eleclib.xsd"/>    
    <xsl:include href="../web-utils/libs/svg/svg.xsl" xsi:schemaLocation="../web-utils/libs/svg/svg.xsd"/>
    
    <xsl:template name="includelib">       
               
        <xsl:call-template name="mainlib"/>    
        
        <xsl:call-template name="apply_mlib_sensor_popup">
            <xsl:with-param name="id">calcpopup__</xsl:with-param>
        </xsl:call-template>
        <xsl:call-template name="lib_svgstyle"/>
        
    </xsl:template> 
    
    <xsl:template name="root_set">    
        
        <xsl:attribute name="onload">
            <xsl:text>libutil.startup.init()</xsl:text>
        </xsl:attribute>
        
        <xsl:attribute name="version">
            <xsl:text>1.1</xsl:text>
        </xsl:attribute>
                
        <script type="text/javascript" xlink:href="../web-utils/js/libutil.js"></script>
        <script type="text/javascript" xlink:href="../web-utils/js/designer.js"></script>
        <script type="text/javascript" xlink:href="../web-utils/js_ext/jquery/jquery.js"></script>
        
    </xsl:template>        


</xsl:stylesheet>
