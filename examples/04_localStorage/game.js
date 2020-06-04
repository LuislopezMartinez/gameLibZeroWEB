// Main code app file.
var ST = 0;
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
            
            ST = 10;
        break;
        case 10:
            var datos = new storage();          // crear gestor de almacenamiento..
            if(datos.available()){
                console.log("Tienes acceso al almacenamiento!");
                datos.set("username", "juanDeDios");
                console.log("valor recuperado para Username: ",  datos.get("username"));
            }else{
                console.log("Has agotado tu cuota de datos en el almacenamiento local.");
            }
            ST = 20;
        break;
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------



