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
        this.local_glz_constraints = [];
        this.gr = newGraph(5, 5, 0xff0000);
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
                if(key(_LEFT)){
                    this.addImpulseAtPoint(0, 10, this.angle, 0.1);
                }
            break;
        }
    }
    addImpulseAtPoint(x, y, ang, mod){
        // ADD A IMPULSE AT LOCAL POINT WITH ANGLE AND MODULE..
        var position = {x: x, y: y};
        var force = {x: 0, y: 0};
        Matter.Body.applyForce(this.body, position, force);
    }
}
//---------------------------------------------------------------------------------