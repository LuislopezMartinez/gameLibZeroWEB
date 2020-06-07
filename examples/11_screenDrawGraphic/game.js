// Main code app file.
var ST = 0;
var loader;
var img = [];
var num = 3;
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
function setup(){                       // first time execution code..
    backgroundColor = 0x555555;         // background clear color..
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
                new text("Currier", 32, "Utilize los cursores izquierda y derecha", CENTER, width/2, 20, 0xffffff, 1);
                ST = 20;
            }
        break;
        case 20:
            var x = 20;
            var y = 100;
            var angle = 0;
            var sizex = 1;
            var sizey = 1;
            var alpha = 1;
            for(var i=0; i<num; i++){
                screenDrawGraphic(img[0], x + i*50, y, angle, sizex, sizey, alpha);
            }
            if(key(_LEFT)){
                if(num>0){
                    num--;
                }
            }
            if(key(_RIGHT)){
                if(num<10){
                    num++;
                }
            }
        break;
    }
}
//---------------------------------------------------------------------------------

