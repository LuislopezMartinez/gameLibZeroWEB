// Main code app file.
var ST = 0;
var loader;
var img;
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
            loadScene("data/images/00.png.scn");
            loader = new loadImages("data/images/", 0);
            ST = 10;
        break;
        case 10:
            if(loader.ready){
                img = loader.get();
                new fondo();
                new cosa();
                ST = 20;
            }
        break;
        case 20:
            //console.log(glz_collisions);
        break;
    }
}
//---------------------------------------------------------------------------------
class fondo extends gameObject{
    constructor(){
        super();
        this.st = 0;
    }
    frame(){
        switch(this.st){
            case 0:
                this.x = width/2;
                this.y = height/2;
                this.setGraph(img[0]);
                this.st = 10;
            break;
            case 10:

            break;
        }
    }
}
//---------------------------------------------------------------------------------
class cosa extends gameObject{
    constructor(){
        super();
        this.st = 0;
    }
    frame(){
        switch(this.st){
            case 0:
                this.x = 190;
                this.y = 200;
                this.setGraph(newGraph(5,5,0xff0000));
                this.createBody(TYPE_BOX);
                this.st = 10;
            break;
            case 10:
                if(key(_LEFT)){
                    this.advance(1, 180);
                }
                if(key(_RIGHT)){
                    this.advance(1, 0);
                }
                if(key(_UP)){
                    this.advance(1, -90);
                }
                if(key(_DOWN)){
                    this.advance(1, 90);
                }
                //console.log(this.body);
            break;
        }
    }
    
}
