var id_a;            // carta id A..
var id_b;            // carta id B..
var pareja_st = 0;      // estado de la pareja..
var pares = 0;          // parejas conseguidas..
//---------------------------------------------------------------------------------
class carta extends gameObject{
    constructor(num, gr){
        super();
        this.st = 0;
        this.num = num;
        this.minx = 52;
        this.separacion = 100;
        this.gr = gr;
        this.cartas = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
        this.delay = 0;
        this.a = 0.0;
    }
    frame(){
        switch(this.st){
            case 0:
                this.setGraph(mazo_seleccionado[this.cartas[this.num]]);
                if(this.num<8){
                    this.y = 150;
                    this.x = this.minx + this.num*this.separacion;
                }else{
                    this.y = 330;
                    this.x = this.minx + (this.num-8)*this.separacion;
                }
                this.createBody(TYPE_BOX, TYPE_SENSOR);
                this.st = 10;
            break;
            case 10:
                this.delay = (this.delay+1)%(60+this.num*10);
                if(this.delay==0){
                    this.st = 20;
                }
            break;
            case 20:
                if(this.sizex>0){
                    this.sizex-=0.1;
                }else{
                    this.setGraph(img[3]);
                    this.st = 30;
                }
            break;
            case 30:
                if(this.sizex<1){
                    this.sizex+=0.1;
                }else{
                    // CUANDO LA ULTIMA CARTA ESTA GIRADA..
                    if(this.num==15){
                        // jugar!!!!!!!!!!!!
                    }
                    this.st = 40;
                }
            break;
            case 40:
                if(this.a<360){
                    this.a+=10;
                    this.setAngle(this.a);
                }else{
                    this.st = 42;
                }
            break;
            case 42:
                if(this.touched() && pareja_st<2){
                    switch(pareja_st){
                        case 0:
                            id_a = this;
                            pareja_st++;
                        break;
                        case 1:
                            id_b = this;
                            pareja_st++;
                        break;
                    }
                    this.st = 45;
                }
            break;
            case 45:
                this.st = 50;
            break;
            case 50:
                if(this.sizex>0){
                    this.sizex-=0.1;
                }else{
                    this.setGraph(mazo_seleccionado[this.gr]);
                    this.st = 60;
                }
            break;
            case 60:
                if(this.sizex<1){
                    this.sizex+=0.1;
                }else{
                    this.delay = 0;
                    this.st = 70;
                }
            break;
            case 70:
                this.delay = (this.delay+1)%30;
                if(this.delay==0){
                    this.st = 80;
                }
            break;
            case 80:
                // aqui la carta ha terminado de girar para mostrarse..
            break;
            case 100:
                if(this.sizex>0){
                    this.sizex-=0.1;
                }else{
                    this.setGraph(img[3]);
                    this.st = 110;
                }
                break;
            case 110:
                if(this.sizex<1){
                    this.sizex+=0.1;
                }else{
                    this.st = 40;
                }
                break;
        }
    }
}
//---------------------------------------------------------------------------------
class PJ_genera_cartas extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.delay = 0;
        this.cartas = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];            // rellenar el array con cartas..
        this.cartas.sort( function(){return Math.random() - 0.5} ); // barajar las cartas del array..
    }
    frame(){
        switch(this.st){
            case 0:
                for(var i=0; i<16; i++){
                    new carta(i, this.cartas[i]);
                }
                this.st = 10;
            break;
            case 10:
                if(pareja_st==2){
                    if(id_a.gr == id_b.gr){
                        // PAREJA CORRECTA
                        snd[1].play();
                        pares ++;           // sumar 1 a las parejas descubiertas..
                        this.delay = 0;
                        pareja_st = 0;
                        if(pares == 8){
                            this.st = 20;
                        }
                        
                    }else{
                        // PAREJA INCORRECTA
                        if(id_a.st==80 && id_b.st==80){
                            snd[2].play();
                            id_a.st = 100;
                            id_b.st = 100;
                            this.delay = 0;
                            pareja_st = 0;
                            //st = 20;
                        }
                        
                    }
                }
            break;
            case 20:
                this.delay = (this.delay+1)%120;
                if(this.delay==0){
                    fadeOff(1000);
                    this.st = 30;
                }
            break;
            case 30:
                if(!fading){
                    ST = 30;
                    this.st = 40;
                }
            break;
        }
    }
}
//---------------------------------------------------------------------------------
class PJ_boton_back extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.delay = 0;
        this.t;
    }
    frame(){
        switch(this.st){
            case 0:
                this.setGraph(img[7]);
                this.x = 45;
                this.y = 440;
                this.createBody(TYPE_BOX, TYPE_SENSOR);
                this.t = new text("Arial", 22, "TOCAR 2 SEGUNDOS PARA VOLVER AL MENU..", RIGHT, this.x+50, this.y, 0x0000ff, 1 );
                this.st = 10;
            break;
            case 10:
                if(this.touched()){
                    this.tint(0x00ffff);
                    this.delay++;
                    if(this.delay==120){
                        snd[2].play();
                        fadeOff(500);
                        this.st = 20;
                    }
                }else{
                    this.tint(0xffffff);
                }
            break;
            case 20:
                if(!fading){
                    ST = 30;
                    this.st = 30;
                }
            break;
        }
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function pantalla_jugar(){
    new PJ_genera_cartas();
    new PJ_boton_back();
}
//---------------------------------------------------------------------------------