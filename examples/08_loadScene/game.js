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
            window.decomp =  "poly-decomp";
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
                    this.advance(1, 90);
                }
                if(key(_DOWN)){
                    this.advance(1, 270);
                }
                //console.log(this.body);
            break;
        }
    }
    
}

// PARSER DE ESCENAS CON FISICA ESTATICA CREADAS CON SZENNER..
function loadScene(filename){
    var client = new XMLHttpRequest();
    client.onload = function(){
        this.ready = true;
        this.lines = this.response.split('\n');
        // eliminar el puto char \r que se queda tras el split en lines..
        // OJO!! este puto char no se muestra en la consola de chrome.. pero si en la de firefox..
        for(var i=0; i<this.lines.length; i++){
            this.lines[i] = this.lines[i].slice(0, -1);
        }
        // PREPARAR VARIABLES..
        var geometry = [];
        var polygon = false;
        var polygon_name = "";
        var polygon_meta = "";
        var polygon_sensor = false;
        var xmax = 0;
        var xmin = 0;
        var ymax = 0;
        var ymin = 0;
        for(var i=0; i<this.lines.length; i++){
            var params = this.lines[i].split("#@#");
            switch(params[0]){
                case "#POLY_START":
                    geometry = undefined;    
                    geometry = [];
                    polygon = true;
                    polygon_name = "";
                    xmax = 0;
                    xmin = 0;
                    ymax = 0;
                    ymin = 0;
                break;
                case "#POLY_NAME":
                    polygon_name = params[1];
                break;
                case "#POLY_META":
                    polygon_meta = params[1];
                break;
                case "#SENSOR":
                    if(polygon){
                        polygon_sensor = params[1];
                    }
                break;
                case "#VERTEX":
                    if(polygon){
                        var xx = int(params[1]);
                        var yy = int(params[2]);
                        geometry.push( {x : xx, y : yy} );
                        if(xx>xmax){xmax = xx;}
                        if(xx<xmin){xmin = xx;}
                        if(yy>ymax){ymax = yy;}
                        if(yy<ymin){ymin = yy;}
                    }
                break;
                case "#POLY_END":
                    var cx = 0;
                    var cy = 0;


                    var body = Matter.Body.create({
                        position: Matter.Vertices.centre(geometry),
                        vertices: geometry,
                        isStatic: true
                    });



                    //var body = Bodies.fromVertices(cx, cy, geometry , {isStatic : true} );
                    body.glz_name = polygon_name;
                    body.glz_meta = polygon_meta;
                    if(polygon_sensor === "TRUE"){
                        body.isSensor = true;
                    }
                    body.glz_maker = "loadScene";
                    Matter.Body.setAngle(body, radians(0));
                    World.add(engine.world, body);
                    polygon = false;
                    console.log("------------------------------------------------------------");
                    console.log("Name: ", polygon_name);
                    console.log("Meta: ", polygon_meta);
                    console.log("Sensor: ", polygon_sensor);
                    console.log("Geometry: ", geometry);
                    console.log("Body: ", body);
                break;
            }
        }
    };
    client.open("GET", filename);
    client.send();
    client.ready = false;
    client.lines = undefined;
    client.get = function(){
        return this.response.split('\n');
    }
    return client;
}

class test extends gameObject{
    constructor(){
        super();
        this.st = 0;
    }
    frame(){
        switch(this.st){
            case 0:
                this.x = 50;
                this.y = 50;
                this.createPolygon();
                this.st = 10;
            break;
            case 10:
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
        this.body = Bodies.fromVertices(this.x, this.y, geometry2d , {isStatic : true} );
        Matter.Body.setAngle(this.body, radians(this.angle));
        World.add(engine.world, this.body);
        console.log("------------------------------------------------------------");
        console.log("Este cuerpo es correcto y colisiona!");
        console.log("Geometry: ", geometry2d);
        console.log("Body: ", this.body);
    }
}