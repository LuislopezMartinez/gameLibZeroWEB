// Main code app file.
var ST = 0;
var loader;
var img = [];
var escena;
var idPerso;
//---------------------------------------------------------------------------------
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
            loader = new loadImages("data/images/", 0);
            ST = 10;
        break;
        case 10:
            if(loader.ready){
                img = loader.get();
                // escena en region..
                escena = new scene(img[0], 100, 80, 440, 200);  // imagen, x, y, ancho, alto
                // escena en fullscreen..
                //escena = new scene(img[0], 0, 0, width, height);  // imagen, x, y, ancho, alto
                idPerso = new personaje();
                escena.setCamera(idPerso)

                for(var i=0; i<100; i++){
                    new cosaEnEscena();
                }

                ST = 20;
            }
        break;
        case 20:
            //escena.cameraPosition(mouse.x, mouse.y);
        break;
    }
}
//---------------------------------------------------------------------------------
class personaje extends gameObject{
    constructor(){
        super();
        // Es importante crear el grafico de un proceso que va a hacer de camara en
        // el constructor, ya que sin pasar un frame debe estar disponible..
        this.setGraph(newGraph(10,10, 0xff0000));
    }
    frame(){
        if(key(_LEFT)){
            this.x-=5;
        }
        if(key(_RIGHT)){
            this.x+=5;
        }
        if(key(_UP)){
            this.y-=5;
        }
        if(key(_DOWN)){
            this.y+=5;
        }
    }
}
//---------------------------------------------------------------------------------
class cosaEnEscena extends gameObject{
    constructor(){
        super();
        this.x = random(img[0].width);
        this.y = random(img[0].height);
        this.setGraph(newGraph(10,10, 0x0000ff));
        this.setScene(escena);
    }
    frame(){
        
    }
}
//---------------------------------------------------------------------------------