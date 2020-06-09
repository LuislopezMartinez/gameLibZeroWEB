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
            //setGravity(0, 1);
            new rectangulo();
            ST = 10;
        break;
        case 10:
            
        break;
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
class rectangulo extends gameObject{
    constructor(){
        super();
        this.st = 0;
    }
    //--------------------------------------------------------------
    //--------------------------------------------------------------
    frame(){
        switch(this.st){
            case 0:
                this.x = 320
                this.y = 180;    
                this.setGraph(newGraph(300, 20, 0x666666));
                this.createBody(TYPE_BOX);
                this.st = 10;
            break;
            case 10:
                this.addVy(0.01);
                if(key(_LEFT)){
                    var position = {x:0, y:0};
                    var force = {x:0, y:-0.001};
                    Matter.Body.applyForce(this.body, position, force);
                    //this.addImpulse();
                }
                if(key(_RIGHT)){
                    var position = {x:this.x+300, y:0};
                    var force = {x:0*cos(radians()), y:-0.001};
                    Matter.Body.applyForce(this.body, position, force);
                    //this.addImpulse();
                }
            break;
        }
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------