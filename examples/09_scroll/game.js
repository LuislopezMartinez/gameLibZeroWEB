// Main code app file.
var ST = 0;
var loader;
var img = [];
var scroll_layer;
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
            loader = new loadImages("data/images/", 0);
            ST = 10;
        break;
        case 10:
            if(loader.ready){
                img = loader.get();
                scroll_layer = new scroll(img[0], width, height);
                scroll_layer.x = width/2;
                scroll_layer.y = height/2;
                ST = 20;
            }
        break;
        case 20:
            scroll_layer.offset.x++;
        break;
    }
}
//---------------------------------------------------------------------------------



