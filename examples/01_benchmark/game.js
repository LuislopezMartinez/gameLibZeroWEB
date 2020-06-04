// Global var block..
var ST = 0;
var loader;
var img = [];
var text_inicio;
//---------------------------------------------------------------------------------
function setup(){
    //backgroundColor = 0x658890;
    //fadingColor = 0x0000ff;
    setMode(640, 360, false, false);
//    fadeOff(0);
}
//---------------------------------------------------------------------------------
function main(){
    //console.log(fps);
    switch(ST){
        case 0:
            text_inicio = new text('Arial', 22, "gameLibZero Benchmark - touch screen to start", CENTER, width/2, height/2, 0x0000ff, 1);
            ST = 2;
        break;
        case 2:
            if(mouse.left){
                text_inicio.text = "loading assets..";
                text_inicio.color = 0xd3d61c;
                ST = 8;
            }
        break;
        case 8:
            loader = new loadImages("data/images/", 1);     // load files:  00.png.. 01.png
            ST = 10;
            break;
        case 10:
            if(loader.ready){
                img = loader.get();
                console.log("Recursos cargados!");
                text_inicio.x = width/2;
                text_inicio.y = 12;
                text_inicio.color = 0x222222;
                ST = 30;
            }
            break;
        case 30:
            text_inicio.text = "gameObjects: " + str(gameObjects.length) + "    fps: "+str(fps);
            
            if(fps>58){
                for(var i=0; i<10; i++){
                    new proceso();
                }
            }
            
        break;
                    
    }
}
//---------------------------------------------------------------------------------
class proceso extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.counter = 0;
        this.delta = random(1, 5);
        this.vel = 5;
    }
    frame(){
        switch(this.st){
            case 0:
            this.setGraph(img[0]);
            this.x = random(100, 540);
            this.y = random(100, 310);
            this.size = 5;
            this.st = 10;
            break;
            case 10:
                this.counter = (this.counter+this.delta)%360;
                this.size = 5 + 2*sin(radians(this.counter));

                this.angle++;
                
                if(this.touched()){
                    this.tint(0xff0000);
                }else{
                    this.tint(0xffffff);
                }

            break;
        }
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------