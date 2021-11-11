class ElementParser{
  String[] layerIdent = {"$", "$#", "$##", "!", "– "};
  
  public Element parseString(String line, int layer){
    
    println(line);
    
    Title t;
    ElementBody eB = null;
    
    line = line.replace(layerIdent[layer],"");
    
    String name = line;
          
    if(layer > 2) {
      String[] parts = line.split("#");
      for(int i = 0; i < parts.length; i++){
        if(parts[i] == "") parts[i] = null;
      }
      eB = new ElementBody(parts);
      
      name = parts[0];
    }
        
    t = new Title(name);
    
    return new Element(t,eB);
  }
}
