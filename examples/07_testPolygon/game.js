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
            new testPolygon();
            ST = 10;
        break;
        case 10:
            
        break;
    }
}
//---------------------------------------------------------------------------------
class testPolygon extends gameObject{
    constructor(){
        super();
        this.st = 0;
    }
    frame(){
        switch(this.st){
            case 0:
                this.x = width/2;
                this.y = 50;
                this.createPolygon();
                this.st = 10;
            break;
            case 10:
                console.log(this.y);

                //this.addVy(0.001);

            break;
        }
    }
    createPolygon(){
        this.body_created = true;
        var geometry2d = [
                            {x : 0 , y : 0},
                            {x : 0 , y : 50},
                            {x : 50 , y : 50},
                            {x : 50 , y : 0}
                        ];
        this.body = Bodies.fromVertices(this.x, this.y, geometry2d , {isStatic : false} );
        Matter.Body.setAngle(this.body, radians(this.angle));
        World.add(engine.world, this.body);
    }
}
