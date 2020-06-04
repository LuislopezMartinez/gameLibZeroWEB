//---------------------------------------------------------------------------------
class PT_mazo extends gameObject {
    constructor(gr, x, y, num) {
        super();
        this.st = 0;
        this.cartas = gr;
        this.x = x;
        this.y = y;
        this.num = num;
        this.names = ["", "formas", "animales", "colores", "transportes", "frutas"];
        this.name = this.names[this.num];
        this.t1;
        this.counter = 0;
        this.it = 0;
    }
    frame() {
        switch (this.st) {
            case 0:
                this.sizex = this.sizey = 1.4;
                this.setGraph(this.cartas[0]);
                this.z = 32;
                this.createBody(TYPE_BOX, TYPE_SENSOR);
                this.setStatic(true);
                this.t1 = new text("Arial", 28, this.name, CENTER, this.x, this.y + 110, 0x000000, 1);
                this.st = 10;
                break;
            case 10:
                if (tipo_elegido) {
                    this.t1.text = "";
                    this.st = 100;
                }
                this.counter = (this.counter + 1) % fps;
                if (this.counter == 0) {
                    this.it = (this.it + 1) % this.cartas.length;
                    this.setGraph(this.cartas[this.it]);
                }
                if (this.touched()) {
                    tipo_elegido = true;
                    mazo_seleccionado = this.cartas;
                    this.z = 128;
                    this.t1.text = "";
                    snd[1].play();
                    this.st = 20;
                }
                break;
            case 20:
                if (this.getDist(400, this.y) > 5) {
                    if (this.x < 400) {
                        this.advance(5, 0);
                    } else {
                        this.advance(5, 180);
                    }
                } else {
                    fadeOff(1000);
                    this.st = 30;
                }
                break;
            case 30:
                this.sizex+=0.1;
                this.sizey+=0.1;
                if(!fading){
                    this.st = 40;
                    ST = 2000;
                }
                break;


            case 100:
                if (this.sizex > 0) {
                    this.sizex -= 0.05;
                }
                if (this.sizey > 0) {
                    this.sizey -= 0.05;
                }
                break;
        }
    }
}
//---------------------------------------------------------------------------------
class PT_controller extends gameObject {
    constructor() {
        super();
        this.st = 0;
        this.fondo;
    }
    frame() {
        switch (this.st) {
            case 0:
                this.x = 400;
                this.y = 100;
                this.setGraph(img[1]);
                this.z = 16;
                new PT_mazo(formas, 100, 320, 1);
                new PT_mazo(animales, 250, 320, 2);
                new PT_mazo(colores, 400, 320, 3);
                new PT_mazo(transportes, 550, 320, 4);
                new PT_mazo(frutas, 700, 320, 5);

                this.fondo = new scroll(img[8], width, height);
                this.fondo.x = width / 2;
                this.fondo.y = height / 2;
                this.fondo.z = 0;
                this.st = 10;
                break;
            case 10:
                this.fondo.offset.x++;
                this.fondo.offset.y++;
                if (frameCount % 10 == 0) {
                    //console.log(gameObjects.length);
                }
                break;
        }
    }
}
//---------------------------------------------------------------------------------
function pantalla_titulo() {
    new PT_controller();
}
//---------------------------------------------------------------------------------
