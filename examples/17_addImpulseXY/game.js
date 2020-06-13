// Main code app file.
var ST = 0;
var load;
var img;
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function setup(){                       // first time execution code..
    backgroundColor = 0x222222;         // background clear color..
    fadingColor = 0xffffff;             // screen fade color..
    setMode(640, 360, false, false);     // set video mode..
    loader = new loadImages("data/images/", 1);

}
//---------------------------------------------------------------------------------
function main(){                        // game loop..
    switch(ST){
        case 0:
            if(loader.ready){
                img = loader.get();
                new nave();
                ST = 10;
            }
        break;
        case 10:
            
        break;
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
class nave extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.p1;
        this.pr;
    }
    //--------------------------------------------------------------
    //--------------------------------------------------------------
    frame(){
        switch(this.st){
            case 0:
                this.x = 320
                this.y = 180;    
                this.setGraph(img[0]);
                this.createBody(TYPE_BOX);
                
                this.pl = new gameObject();
                this.pl.setGraph(img[1]);
                this.pl.setCenter(this.pl.graph.width/2, 0);
                this.pl.sizex = 0.3;
                this.pl.sizey = 0.1;
                
                this.pr = new gameObject();
                this.pr.setGraph(img[1]);
                this.pr.setCenter(this.pr.graph.width/2, 0);
                this.pr.sizex = 0.3;
                this.pr.sizey = 0.1;

                this.st = 10;
            break;
            case 10:
                this.addVy(0.01);
                this.pointLeft = this.getPoint(15, 30);
                this.pl.x = this.pointLeft.x;
                this.pl.y = this.pointLeft.y;
                this.pointRight= this.getPoint(57, 27);
                this.pr.x = this.pointRight.x;
                this.pr.y = this.pointRight.y;

                if(key(_LEFT)){
                    this.addImpulse(this.pointLeft, this.angle-90, 0.0001);
                    if(this.pl.sizey<0.3){
                        this.pl.sizey += 0.01;
                    }
                    if(frameCount%5===0){
                        this.pl.visible = !this.pl.visible;
                    }
                }else{
                    this.pl.visible = true;
                    if(this.pl.sizey>0.1){
                        this.pl.sizey -=0.05;
                    }
                }
                if(key(_RIGHT)){
                    this.addImpulse(this.pointRight, this.angle-90, 0.0001);
                    if(this.pr.sizey<0.3){
                        this.pr.sizey += 0.01;
                    }
                    if(frameCount%5===0){
                        this.pr.visible = !this.pr.visible;
                    }
                }else{
                    this.pr.visible = true;
                    if(this.pr.sizey>0.1){
                        this.pr.sizey -=0.05;
                    }
                }
            break;
        }
    }
}
//---------------------------------------------------------------------------------