// Main code app file.
var ST = 0;
var loader;
var img = [];
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
                new fondo();
                new cosa();
                ST = 20;
            }
        break;
        case 20:

        break;
    }
}
//---------------------------------------------------------------------------------
class cosa extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.pix;
    }
    frame(){
        switch(this.st){
            case 0:
                this.setGraph( newGraph(10, 10, 0xff0000) );
                this.x = width/2;
                this.y = height/2;
                this.pix = new loadPixels(img[0]);
                this.st = 2;
            break;
            case 2:
                if(this.pix.ready){
                    console.log(this.pix.getPixel(30, 30));
                    this.st = 10;
                }
            break;
            case 10:
                if(key(_LEFT)){
                    var color = this.pix.getPixel(this.x-10, this.y);
                    if(color!==undefined){
                        if(color[0]!==0){
                            this.x--;
                        }
                    }
                }
                if(key(_RIGHT)){
                    var color = this.pix.getPixel(this.x+10, this.y);
                    if(color!==undefined){
                        if(color[0]!==0){
                            this.x++;
                        }
                    }
                }
                if(key(_UP)){
                    var color = this.pix.getPixel(this.x, this.y-10);
                    if(color!==undefined){
                        if(color[0]!==0){
                            this.y--;
                        }
                    }
                }
                if(key(_DOWN)){
                    var color = this.pix.getPixel(this.x, this.y+10);
                    if(color!==undefined){
                        if(color[0]!==0){
                            this.y++;
                        }
                    }
                }

                
            break;
        }
    }
}
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
class fondo extends gameObject{
    st = 0;
    frame(){
        switch(this.st){
            case 0:
                this.setGraph(img[0]);
                this.x = width/2;
                this.y = height/2;
                this.st = 10;
            break;
        }
    }
}
//---------------------------------------------------------------------------------