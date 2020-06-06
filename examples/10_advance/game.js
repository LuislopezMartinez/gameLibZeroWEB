// Main code app file.
var ST = 0;
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
            new text("Arial", 16, "Utiliza las teclas de cursor", CENTER, width/2, 20, 0xffffff, 1);
            new cosa();
            ST = 10;
        break;
        case 10:
            if((frameCount%2)===0){
                new bola();
            }
        break;
    }
}
//---------------------------------------------------------------------------------
class cosa extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.t1;
        this.t2;
    }
    frame(){
        switch(this.st){
            case 0:
                this.x = width/2;
                this.y = height/2;
                this.t1 = new text("Arial", 16, "", CENTER, this.x, this.y-20, 0xffffff, 1);
                this.setGraph(newGraph(300, 10, 0xffffff));
                this.createBody(TYPE_BOX);
                //this.setMaterial(TYPE_ICE);
                this.setStatic(true);
                this.st = 10;
            break;
            case 10:
                if(key(_DOWN)){
                    this.advance(-1, this.angle);
                    //this.advance(-1);
                }
                if(key(_UP)){
                    //this.advance(1);
                    this.advance(1, this.angle);
                }
                if(key(_LEFT)){
                    this.rotate(-1);
                }
                if(key(_RIGHT)){
                    this.rotate(1);
                }

                this.t1.text = this.angle;
                this.t1.x = this.x;
                this.t1.y = this.y-20;

            break;
        }
    }
}
//---------------------------------------------------------------------------------
class bola extends gameObject{
    constructor(){
        super();
        this.st = 0;
    }
    frame(){
        switch(this.st){
            case 0:
                this.x = random(width);
                this.y = 0;
                this.setGraph(newGraph(10, 10, 0xff0000));
                this.createBody(TYPE_CIRCLE);
                this.setMaterial(TYPE_ICE);
                this.st = 10;
            break;
            case 10:
                this.addVy(0.3);
                if(this.y> height+50){
                    signal(this, s_kill);
                }
            break;
        }
    }
}
//---------------------------------------------------------------------------------


