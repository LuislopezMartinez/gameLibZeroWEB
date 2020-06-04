// Main code app file.
var ST = 0;
var cli;
//---------------------------------------------------------------------------------
function setup(){                       // first time execution code..
    backgroundColor = 0x222222;         // background clear color..
    fadingColor = 0xffffff;             // screen fade color..
    setMode(640, 360, false, false);     // set video mode..
}
//---------------------------------------------------------------------------------
function main(){                        // game loop..
    switch(ST){
        case 0:
            cli = createClient("ws://192.168.1.110", 7777);
            ST = 10;
        break;
        case 10:
            if(cli.status === SOCKET_CONNECTED){
                var m = new netMessage(cli);
                m.add("Hola mundo de los web sockets!!");
                m.send();
                ST = 20;
            }
        break;
    }
}
//---------------------------------------------------------------------------------
function onNetOpen(){
    console.log("Conectaste al servidor!");
}
function onNetClose(){
    console.log("Desconectaste del servidor!");
}
function onNetError(){
    console.log("Ocurrieron errores en la conexion!");
}
function onNetMessage(msg){
    console.log(msg);
}
