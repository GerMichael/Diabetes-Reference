class ElementBody{
  String entsprichtEinheit = null;
  String einheitsGroesse = null;
  String  be = null;
  String  ke = null;
  
  ElementBody (String[] parts){
    entsprichtEinheit = parts[1] == "" ? null : parts[1];
    einheitsGroesse = parts[2] == "" ? null : parts[2];
    this.be = parts[3] == "" ? null : parts[3].replace(",",".");
    this.ke = parts[4] == "" ? null : parts[4].replace(",",".");
  }
}
  
