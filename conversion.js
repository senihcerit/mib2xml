function saveConfigToFile(){
    xmlDoc = this.initializeXML();      
    var rootElement = xmlDoc.getElementsByTagName("root")[0];  

    var moduleNamesArray = ["firstModule","firstModule"];
    var objectNamesArray = ["firstObject","secondObject"];
    var mibParametersArray = ["oid","oid_numeric","type","value"];
    var position = 0;

    for(var j = 0; j < moduleNamesArray.length; j++){
        axios.get(this.url + "routingeng/get" + moduleNamesArray[position] + "Data").then(function (response) {
            if(response.data[objectNamesArray[position]] != null){
          
                data = JSON.parse(response.data[objectNamesArray[position]]);          
                var moduleElement = xmlDoc.createElement(moduleNamesArray[position]);
                position++;
  
                for (var i = 0; i < data.length; i++) {
                    var mibElementName = (data[i][mibParametersArray[0]]).substring(0,((data[i][mibParametersArray[0]]).length-2));            
                    var nodeElement = xmlDoc.createElement(mibElementName);          
  
                    for (var par = 1; par < mibParametersArray.length; par++) {
                        var node = xmlDoc.createElement(mibParametersArray[par]);
                        node.innerHTML = data[i][mibParametersArray[par]];  
                        nodeElement.appendChild(node);  
                    }  
                    moduleElement.appendChild(nodeElement);                    
                }
                rootElement.appendChild(moduleElement); 
            
                var xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
                if(position == (moduleNamesArray.length)){

                    this.download(xmlString, 'config.xml', 'text/xml'); 
                    console.log(xmlDoc);
                }
            }
        });
    };
}

function download(data, filename, type){
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
      var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
    }
};

function initializeXML(){
    var xmlString = '<?xml version="1.0" encoding="UTF-8"?><root></root>';
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlString, "text/xml"); 

    return xmlDoc;
};

