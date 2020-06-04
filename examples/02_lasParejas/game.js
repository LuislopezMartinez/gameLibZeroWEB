// Global var block..
var ST = 0;
var loaders = [6];
var img = [];
var formas = [];
var animales = [];
var colores = [];
var transportes = [];
var frutas = [];
var snd = [];

var text_inicio;

var tipo_elegido = false;
var mazo_seleccionado;

//---------------------------------------------------------------------------------
function setup(){
    backgroundColor = 0xffffff;
    fadingColor = 0xffffff;
    setMode(800, 480, false, true);
//    fadeOff(0);
}
//---------------------------------------------------------------------------------
function main(){
    //console.log(fps);
    switch(ST){
        case 0:
            text_inicio = new text('Arial', 22, "TOUCH TO START", CENTER, width/2, height/2, 0x0000ff, 1);
            ST = 10;
        break;
        case 10:
            if(mouse.left){
                text_inicio.text = "loading assets..";
                text_inicio.color = 0x00ffff;
                loaders[0] = new loadImages("data/image/main/", 8);
                loaders[1] = new loadImages("data/image/animales/", 7);
                loaders[2] = new loadImages("data/image/colores/", 7);
                loaders[3] = new loadImages("data/image/formas/", 7);
                loaders[4] = new loadImages("data/image/frutas/", 7);
                loaders[5] = new loadImages("data/image/transportes/", 7);
                loaders[6] = new loadSounds("data/music/", 2);

                ST = 20;
            }
        break;
        case 20:
            var ready = true;
            for(var i=0;i<loaders.length;i++){
                if(loaders[i].ready==false){
                    ready=false;
                }
            }
            if(ready==true){
                img = loaders[0].get();
                formas = loaders[1].get();
                animales = loaders[2].get();
                colores = loaders[3].get();
                transportes = loaders[4].get();
                frutas = loaders[5].get();
                snd = loaders[6].get();
                text_inicio.y = 0;
                text_inicio.color = 0x000000;
                signal(text_inicio, s_kill);
                fadeOff(500);
                soundPlay(snd[0], 0.5, true);
                ST = 30;
            }
        break;
        case 30:
            if(!fading){
                tipo_elegido = false;
                letMeAlone();
                fadeOn(1500);
                pantalla_titulo();
                ST = 40;
            }
        break;
        case 40:
            // limbo..    
        break;

        case 2000:
            letMeAlone();
            pantalla_jugar();
            fadeOn(1500);
            ST = 2010;
        break;



    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------