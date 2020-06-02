import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import java.io.*;
import java.net.*;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import org.java_websocket.WebSocket;

// NO MODIFICAR EL TOKEN SEPARADOR..
// HA DE SER EL MISMO QUE EN LA LIBRERIA gameLibZeroWEB..
final char NET_TOK_DATA = '~';    // delimitier for datagram tokens..



WebSocketServer createServer(int port){
    WebSocketServer ser = null;
    try {
        ser = new Servidor(port);
        ser.start();
    } 
    catch (UnknownHostException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }
    return ser;
}
//------------------------------------------------------------
public class Servidor extends WebSocketServer {
    public Servidor(int puerto) throws UnknownHostException {
        super(new InetSocketAddress(puerto));
        System.out.println("WebSocket server started at: " + puerto);
    }

    @Override
        public void onClose(WebSocket arg0, int arg1, String arg2, boolean arg3) {
        onNetServerClose(arg0);
        //System.out.println("Connection closed.");
    }

    @Override
        public void onError(WebSocket arg0, Exception e) {
        System.out.println("Connection error.");
        e.printStackTrace();
    }

    @Override
        public void onMessage(WebSocket webSocket, String mensaje) {
        //webSocket.send("Gracias por el mensaje: " + mensaje);
        //System.out.println("Se ha recibido el mensaje: " + mensaje);
        //println("RAW DATA: ", mensaje);
        StringList datum = new StringList();                 // crear un stringlist de salida..
        String[] buffer = split(mensaje, NET_TOK_DATA);      // trocear lo recibido del socket..
        for (int i=0; i<buffer.length; i++) {
            datum.append(buffer[i]);                         // inyectar los tokens al stringlist de salida..
        }
        onNetServerMessage(webSocket, datum);                  // enviar salida a la función que la va a interpretar..
    }

    @Override
        public void onOpen(WebSocket webSocket, ClientHandshake arg1) {
        onNetServerOpen(webSocket);
        //System.out.println("Connection established.");
    }
}



//------------------------------------------------------------
//------------------------------------------------------------
/* CLASE MENSAJE DE RED.. */
class netMessage {
    char delimitier = NET_TOK_DATA;
    String buffer = "";
    WebSocket client;
    //-------------CONSTRUCTOR MSG----------------------------
    //--------------------------------------------------------
    netMessage(WebSocket client) {
        this.client = client;
    }
    //-------------SIMPLE ADD DATA TO MSG---------------------
    //--------------------------------------------------------
    void add(String token) {
        if (buffer.length()==0) {
            buffer += token;
        } else {
            buffer += delimitier + token;
        }
    }
    //--------------------------------------------------------
    void add(int token) {
        this.add(str(token));
    }
    //--------------------------------------------------------
    void add(float token) {
        this.add(str(token));
    }
    //--------------------------------------------------------
    void add(boolean token) {
        this.add(str(token));
    }
    //--------------------------------------------------------
    void add(char token) {
        this.add(str(token));
    }
    //--------------------------------------------------------
    void add(long token) {
        this.add(str(token));
    }
    //--------------------------------------------------------
    //-------------COMPLEX ADD DATA TO MSG--------------------
    void add(StringList msg) {
        for (int i=0; i<msg.size(); i++) {
            this.add(msg.get(i));
        }
    }
    //-------------SIMPLE SEND MSG TO NETWORK-----------------
    void send(){
        this.client.send(this.buffer);
    }
    //--------------------------------------------------------
}
//------------------------------------------------------------
//------------------------------------------------------------
//import java.net.InetAddress;
//import java.net.NetworkInterface;
//import java.net.SocketException;
//import java.net.UnknownHostException;

public class getMac {

    public getMac() {

        InetAddress ip;
        try {

            ip = InetAddress.getLocalHost();
            System.out.println("Current IP address : " + ip.getHostAddress());

            NetworkInterface network = NetworkInterface.getByInetAddress(ip);

            byte[] mac = network.getHardwareAddress();

            System.out.print("Current MAC address : ");

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < mac.length; i++) {
                sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));
            }
            System.out.println(sb.toString());
        } 
        catch (UnknownHostException e) {

            e.printStackTrace();
        } 
        catch (SocketException e) {

            e.printStackTrace();
        }
    }
}
//------------------------------------------------------------
String getIp(){
    String ip = "";
    String name = "";
    try{
        ip = InetAddress.getLocalHost().getHostAddress() ;
        //String hostName = InetAddress.getLocalHost().getHostName();
    }catch(Exception e){
        
    }
    return ip;
}
//------------------------------------------------------------
String getHostName(){
    String ip = "";
    String name = "";
    try{
        //ip = InetAddress.getLocalHost().getHostAddress() ;
        name = InetAddress.getLocalHost().getHostName();
    }catch(Exception e){
        
    }
    return name;
}
//------------------------------------------------------------
