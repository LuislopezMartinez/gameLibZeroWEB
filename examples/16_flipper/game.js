// Main code app file.
var ST = 0;
var loader;
var img = [];
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function setup(){                       // first time execution code..
    backgroundColor = 0x222222;         // background clear color..
    fadingColor = 0xffffff;             // screen fade color..
    setMode(640, 360, false, false);     // set video mode..
    loader = new loadImages("data/images/", 2);
}
//---------------------------------------------------------------------------------
function main(){                        // game loop..
    switch(ST){
        case 0:
            if(loader.ready){
                img = loader.get();
                new flipper();
                ST = 10;
            }
        break;
        case 10:
            
        break;
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
class flipper extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.local_glz_constraints = [];
        this.gr = newGraph(2, 2, 0xff0000);
        this.point;                     // variable donde guardaré el centro geometrico del grafico..
    }
    frame(){
        switch(this.st){
            case 0:
                this.x = 320            // posicionar el proceso..
                this.y = 180;           // posicionar el proceso..
                this.setGraph(img[0]);  // setear imagen..
                this.setCenter(7, 7);   // setear nuevo centro de rotacion..
                this.st = 10;           
            break;
            case 10:
                new flipper_collider2(); // crear collider con fisicas..
                this.st = 20;
            break;
            case 20:
                if(key(_LEFT)){
                    this.rotate(-1);
                }
                if(key(_RIGHT)){
                    this.rotate(1);
                }

                // obtener el punto real en el mundo del centro geometrico del grafico..
                // simplemente llamo a .getPoint() indicando el centro de la imagen..
                // y recibiré en que posicion en el mundo esta ese pixel..
                this.point = this.getPoint(this.graph.width/2, this.graph.height/2);
                // pinto el punto en rojo para ver una referencia..
                screenDrawGraphic(this.gr, this.point.x, this.point.y, 0, 1, 1, 1);

            break;
        }
    }
}
//---------------------------------------------------------------------------------
class flipper_collider extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.z = this.father.z-1;       // me pinto detras de mi padre..
    }
    frame(){
        switch(this.st){
            case 0:
                this.setGraph( newGraph(this.father.graph.width, this.father.graph.height, 0xffffff) );
                this.createBody(TYPE_BOX);
                this.setStatic(true);
                this.st = 10;
            break;
            case 10:
                if(this.father.point!==undefined){
                    this.setAngle(this.father.angle);
                    this.translate(this.father.point.x, this.father.point.y);
                }
            break;
        }
    }
}
//---------------------------------------------------------------------------------
class flipper_collider2 extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.z = this.father.z-1;       // me pinto detras de mi padre..
    }
    frame(){
        switch(this.st){
            case 0:
                // he restado 5 pixels al alto del grafico para corregir imperfecciones..
                this.setGraph( newGraph(this.father.graph.width, this.father.graph.height-5, 0xffffff) );
                this.createBody(TYPE_BOX);
                this.setStatic(true);
                this.st = 10;
            break;
            case 10:
                if(this.father.point!==undefined){
                    // he sumado 14 grados a la rotacion para corregir imperfecciones..
                    this.setAngle(this.father.angle+14);
                    this.translate(this.father.point.x, this.father.point.y);
                }
            break;
        }
    }
}
//---------------------------------------------------------------------------------