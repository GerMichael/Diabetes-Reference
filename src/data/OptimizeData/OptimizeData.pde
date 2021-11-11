String[] lines = loadStrings("../data.txt");

String[] layerIdent = {"$", "$#", "$##","– "};
for (int i = 0; i < lines.length; i++) {
  boolean isNormal = true;
  for(String ident : layerIdent){
    if(lines[i].startsWith(ident)){
      isNormal = false;
    }
  }
  if(isNormal){
    lines[i] = "!" + lines[i]; //<>//
  }
}
saveStrings("../data_optimized.txt", lines);
println("done");
