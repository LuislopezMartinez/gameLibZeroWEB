//------------------------------------------------------------
void onNetServerClose(WebSocket s){
    println("[SERVER] Conection closed.");
}
//------------------------------------------------------------
void onNetServerOpen(WebSocket s){
    println("[SERVER] New conection established!");
}
//--------------------------------------------------------------------
// PUT HERE YOUR NET RCV PARSER CODE----------------------------------
//--------------------------------------------------------------------
void onNetServerMessage(WebSocket s, StringList msg) {
    println(msg);
    netMessage m = new netMessage(s);
    m.add("Hola cliente!! te saluda tu servidor!");
    m.send();
}
