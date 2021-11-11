
import java.util.*;

void setup() {
  String[] lines = loadStrings("../data_optimized.txt");
  println(new ArrayList(Arrays.asList(lines)));
  println();
  JSONObject json;

  json = new JSONObject();
  json.setJSONArray("subElements", new JSONArray());

  String[] layerIdent = {"– ", "!", "$##", "$#", "$"};
  int layer = -1;

  String[] layersName = new String[layerIdent.length];
  JSONObject[] layerObjects = new JSONObject[layerIdent.length+1];
  layerObjects[0] = json;

  ElementParser eP = new ElementParser();

  int id = -1;

  for (String line : lines) {
    id++;
        
    print("starts not with: ");
    layer = layerIdent.length-1;
    for (String ident : layerIdent) {
      if (line.startsWith(ident)) {
        break;
      }
      print(ident + ", ");
      layer--;
    }
    println();
    

    JSONObject element = new JSONObject();

    Element e = eP.parseString(line, layer);

    element.setInt("id", id);
    element.setInt("layer", layer);
    element.setString("name", e.title.name);

    if (layer < 4) {
      element.setJSONArray("subElements", new JSONArray());
    }

    if (e.elBody != null) {
      element.setString("entsprichtEinheit", e.elBody.entsprichtEinheit);
      element.setString("einheitsGroesse", e.elBody.einheitsGroesse);
      element.setString("be", e.elBody.be);
      element.setString("ke", e.elBody.ke);
    }

    
    layerObjects[layer + 1] = element;
    
    JSONArray parentArr = layerObjects[layer].getJSONArray("subElements");
    parentArr.setJSONObject(parentArr.size(), element);
  }
  
  json.setInt("lastId", id);
  
  saveJSONObject(json,"../data.json");
  saveJSONObject(json,"../data.min.json","compact");
  println("done");
}
