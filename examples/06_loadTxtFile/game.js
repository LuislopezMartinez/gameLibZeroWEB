// Main code app file.
var ST = 0;
var loader;
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
            
            loader = loadLines("data/test.txt");
        
            //new test();
            ST = 10;
        break;
        case 10:
            if(loader.ready){
                console.log(loader.get());
                ST = 20;
            }
        break;
    }
}
//---------------------------------------------------------------------------------

