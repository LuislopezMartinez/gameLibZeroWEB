////////////////////////////////////////////////////////////////////////
//            This file are part of:
//            GameLibZero 2.4.5 by Luis Lopez Martinez
//                13/04/2019 - Barcelona SPAIN.
//                        OPEN SOURCE  
////////////////////////////////////////////////////////////////////////
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
color c1 = #002d5a;        // azul fuerte..
color c2 = #0074d9;        // azul claro..
color c3 = #505050;        // gris fondo ventana claro..
color c4 = #323232;        // gris fondo ventana oscuro..
color c5 = #fe0000;        // rojo fuerte..
color c6 = #680000;        // rojo claro..
color c7 = #11A557;        // verde..
color c8 = #F8FC0A;        // amarillo..
color c9 = #F2A30F;        // naranja..
color c10 = #4A72FC;       // lila boton resaltado..
boolean lockUi = false;
//==============================================================================================================================================
class EGUIinputArea extends sprite{
    int st = 0;
    PImage g1, g2;
    int numLines;
    int interLineSeparation = 0;
    int w, h;
    String[] lines;
    PFont fnt = null;
    int maxTextWidth;
    String buffer = "";
    boolean lock = false;
    int activeLine = 0;            // indica la linea en la que estoy escribiendo actualmente..
    int textSize = 16;
    color textColor = BLACK;
    int inter = 0;                 // separancion extra entre lineas..
    boolean _ENTER_LOCK = false;
    boolean _BACKSPACE_LOCK = false;
    float offsety=0;
    float extraLineOffsety=0;
    float offsetx=0;
    public EGUIinputArea(PFont fnt, int textSize, String text, float x, float y, int w, int numLines, color textColor){
        // PARA SEPARAR MAS LAS LINEAS.. TOCAR INTER = 0..
        inter = 5;
        type = -1001;
        interLineSeparation = textSize;
        this.textSize = textSize;
        this.numLines = numLines;
        int interlineTotalSeparationHeight = inter+(2+(numLines-1))*interLineSeparation;
        this.h = numLines*textSize + inter*numLines + interLineSeparation/2;
        this.maxTextWidth = w-8;
        // crear el marco para contener el texto..
        g1 = newGraphBox(w, h, GRAY, LIGHTGRAY);
        g2 = newGraphBox(w, h, GRAY, WHITE);
        priority = 64;
        this.fnt = fnt;
        this.x = x;
        this.y = y;
        this.textColor = textColor;
        lines = new String[numLines];
        for(int i=0; i<numLines; i++){
            lines[i] = "";
        }
    }
    void frame(){
        // no compatible con Android por el \G que no lo soporta..
        // en Android se hace diferente.. si hacemos port buscar solucion..
        //String[] params = keyboard.buffer.split("(?<=\\G.{23})");
        //println(params);
        switch(st){
            case 0:
                setGraph(g1);
                createBody(TYPE_BOX);
                setStatic(true);
                offsety = y - (g1.height/2) + interLineSeparation/2 + inter;
                extraLineOffsety = interLineSeparation + inter;
                offsetx = x - g1.width/2 + 4;
                st = 10;
                break;
            case 10:
                escribeLineas();
                if (collisionMouse(this) && !lockUi ) {
                    graph = g2;
                    
                    if (mouse.touch && !lock) {
                        st = 20;
                    }
                } else {
                    graph = g1;
                }
                break;
            case 20:
                escribeLineas();
                if (!mouse.touch) {
                    lockUi = true;
                    keyboard.setActive(true);
                    hint(ENABLE_KEY_REPEAT);
                    keyboard.clear();
                    keyboard.buffer = lines[activeLine];
                    st = 30;
                }
                break;
            case 30:
                escribeLineas();
                
                lines[activeLine] = keyboard.buffer;
                if(blitter.textWidth(keyboard.buffer)>(g1.width-10)){
                    if(activeLine<numLines-1){
                        activeLine++;
                        // get last char on buffer..
                        String lastChar = keyboard.buffer.substring(keyboard.buffer.length()-1);
                        // purgue last char from line..
                        lines[activeLine-1] = lines[activeLine-1].substring(0, lines[activeLine-1].length()-1);
                        // clear keyboard buffer..
                        keyboard.clear();
                        // inject last char on keyboard buffer for add to new line..
                        keyboard.buffer = lastChar;
                    }else{
                        keyboard.buffer = keyboard.buffer.substring(0, keyboard.buffer.length()-1);
                    }
                }else {
                    
                    if(key(_BACKSPACE)){
                        if(blitter.textWidth(keyboard.buffer)<1 && !_BACKSPACE_LOCK){
                            _BACKSPACE_LOCK = true;
                            if(activeLine>0){
                                activeLine--;
                                keyboard.buffer = lines[activeLine];
                            }
                        }
                    }
                    
                    if(key(_ENTER) && !_ENTER_LOCK){
                        _ENTER_LOCK = true;
                        if(activeLine<numLines-1){
                            activeLine++;
                            keyboard.buffer = lines[activeLine];
                        }
                    }
                    
                    if(!key(_ENTER) && _ENTER_LOCK){
                        _ENTER_LOCK = false;
                    }
                    
                    if(!key(_BACKSPACE) && _BACKSPACE_LOCK){
                        _BACKSPACE_LOCK = false;
                    }
                    
                }
                
                if( mouse.touch && !collisionMouse(this) ){
                    lockUi = false;
                    keyboard.setActive(false);
                    keyboard.clear();
                    hint(DISABLE_KEY_REPEAT);
                    st = 40;
                }
                
                break;
            case 40:
                escribeLineas();
                if (!mouse.touch) {
                    keyboard.clear();
                    st = 10;
                }
                break;
        }
    }
    
    void escribeLineas(){
        for(int i=0; i<numLines; i++){
            if(i==activeLine && st==30){
                screenDrawText(this.fnt, this.textSize, lines[i]+(frameCount/10 % 2 == 0 ? "_" : ""), RIGHT, offsetx, offsety+extraLineOffsety*i, textColor, 255);
            }else{
                screenDrawText(this.fnt, this.textSize, lines[i], RIGHT, offsetx, offsety+extraLineOffsety*i, textColor, 255);
            }
        }
    }
    
    PImage newGraphBox(int w, int h, color stroke, color fill){
        PImage gr = newGraph(w, h, fill);
        for(int x=0; x<w; x++){
            gr.set(x, 0, stroke);
            gr.set(x, h-1, stroke);
        }
        for(int y=0; y<h; y++){
            gr.set(0, y, stroke);
            gr.set(w-1, y, stroke);
        }
        return gr;
    }
    
    void setLock(boolean lock){
        this.lock = lock;
    }
    
}
//==============================================================================================================================================
class EGUIinputBox extends sprite {
    int st = 0;
    PImage g1, g2;
    String parameter="";
    String pwdModeParameter ="";
    int w, h;
    String title;
    int textSize = 14;
    boolean pwdMode;
    String eventName;
    color titleColor = BLACK;
    color parameterColor = BLACK;
    PFont fntText = null;
    int sizeText;
    String labelText;
    int alignText;
    float xText;
    float yText;
    color colorText;
    float alphaText;
    boolean drawLabel = false;
    boolean lock = false;
    public EGUIinputBox( String title, String str, float x, float y, int w, int h, boolean pwdMode ) {
        type = -1001;        // tipo de proceso UI..
        blitter.pushMatrix();
        blitter.textSize(textSize);
        float anchoTitulo = blitter.textWidth(title);
        blitter.popMatrix();
        this.x = x + w/2 + anchoTitulo;
        this.y = y;
        this.w = w;
        this.h = h;
        this.title = title;
        this.pwdMode = pwdMode;
        this.parameter = str;
        pwdModeParameter = "";
        for(int i=0; i<this.parameter.length(); i++){
            pwdModeParameter += "*";
        }
        priority = 64;
    }
    void frame() {
        switch(st) {
        case 0:
            g1 = newGraphBox(w, h, GRAY, LIGHTGRAY);
            g2 = newGraphBox(w, h, GRAY, WHITE);
            setGraph(g1);
            createBody(TYPE_BOX);
            setStatic(true);
            st = 10;
            break;
        case 10:
            screenDrawText(fntText, textSize, title, LEFT, x-graph.width/2, y, titleColor, 255);
            if(pwdMode){
                screenDrawText(fntText, textSize, pwdModeParameter, RIGHT, x-(graph.width/2)+5, y, parameterColor, 255);
            } else{
                screenDrawText(fntText, textSize, parameter, RIGHT, x-(graph.width/2)+5, y, parameterColor, 255);
            }
            if (collisionMouse(this) && !lockUi ) {
                graph = g2;
                
                if (mouse.touch && !lock) {
                    keyboard.buffer = parameter;
                    st = 20;
                }
            } else {
                graph = g1;
            }
            break;
        case 20:
            screenDrawText(fntText, textSize, title, LEFT, x-graph.width/2, y, titleColor, 255);
            if(pwdMode){
                screenDrawText(fntText, textSize, pwdModeParameter, RIGHT, x-(graph.width/2)+5, y, parameterColor, 255);
            } else{
                screenDrawText(fntText, textSize, parameter, RIGHT, x-(graph.width/2)+5, y, parameterColor, 255);
            }
            if (!mouse.touch) {
                lockUi = true;
                keyboard.setActive(true);
                hint(ENABLE_KEY_REPEAT);
                st = 30;
            }
            break;
        case 30:
            screenDrawText(fntText, textSize, title, LEFT, x-graph.width/2, y, titleColor, 255);
            if(pwdMode){
                pwdModeParameter = "";
                for(int i=0; i<parameter.length(); i++){
                    pwdModeParameter += "*";
                }
                screenDrawText(fntText, textSize, pwdModeParameter+(frameCount/10 % 2 == 0 ? "_" : ""), RIGHT, x-(graph.width/2)+5, y, parameterColor, 255);
            } else{
                screenDrawText(fntText, textSize, parameter+(frameCount/10 % 2 == 0 ? "_" : ""), RIGHT, x-(graph.width/2)+5, y, parameterColor, 255);
            }
            parameter = keyboard.buffer;

            if (key(_ENTER)) {
                method(eventName);
                st = 40;
            }
            
            if(mouse.touch){                    // si este control esta activo y hay mouse.touch..
                if(collisionMouse(this)){      // si el click es en el mismo control..
                                               // no pasa nada..
                } else{                        // si el click es en otro control..
                    method(eventName);         // finalizo la entrada de texto de este control..
                    st = 40;
                }
            }
            
            break;
        case 40:
            screenDrawText(fntText, textSize, title, LEFT, x-graph.width/2, y, titleColor, 255);
            if(pwdMode){
                screenDrawText(fntText, textSize, pwdModeParameter, RIGHT, x-(graph.width/2)+5, y, parameterColor, 255);
            } else{
                screenDrawText(fntText, textSize, parameter, RIGHT, x-(graph.width/2)+5, y, parameterColor, 255);
            }
            if (!key(_ENTER)) {
                lockUi = false;
                keyboard.setActive(false);
                keyboard.clear();
                hint(DISABLE_KEY_REPEAT);
                st = 10;
            }
            break;
        }
        
        if(drawLabel){
            screenDrawText(fntText, sizeText, labelText, alignText, x+xText, y+yText, colorText, alphaText);
        }
        
    }
    void setEvent( String methodName ){
        this.eventName = methodName;
    }
    void setTextFont(PFont textFont){
       this.fntText = textFont;
    }
    void setTitleColor(color c){
        titleColor = c;
    }
    void setParameterColor(color c){
        parameterColor = c;
    }
    void setTextSize(int size){
        this.textSize = size;
    }
    PImage newGraphBox(int w, int h, color stroke, color fill){
        PImage gr = newGraph(w, h, fill);
        for(int x=0; x<w; x++){
            gr.set(x, 0, stroke);
            gr.set(x, h-1, stroke);
        }
        for(int y=0; y<h; y++){
            gr.set(0, y, stroke);
            gr.set(w-1, y, stroke);
        }
        return gr;
    }
    void setLabel(PFont fntText, int sizeText, String labelText, int alignText, float xText, float yText, color colorText, float alphaText){
        this.drawLabel = true;
        this.fntText = fntText;
        this.sizeText = sizeText;
        this.labelText = labelText;
        this.alignText = alignText;
        this.xText = xText;
        this.yText = yText;
        this.colorText = colorText;
        this.alphaText = alphaText;
    }
    void setLock(boolean lock){
        this.lock = lock;
    }
}
//==============================================================================================================================================
class EGUIbutton extends sprite {
    int st = 0;
    int value = 0;
    int w;
    int h = 18;
    PImage g1, g2, g3;
    float textSize = 14;
    String title="";
    PImage gTile;
    float size;
    String eventName;
    color textColor = WHITE;
    color c1 = BLUE;
    color c2 = DARKBLUE;
    color c10 = SKYBLUE;
    public EGUIbutton( String title, float x, float y ) {
        type = -1001;        // tipo de proceso UI..
        this.title = title;
        blitter.pushMatrix();
        blitter.textSize(textSize);
        w = (int)blitter.textWidth(title) + 10;
        blitter.popMatrix();
        this.x = x;
        this.y = y;
        this.size = 100;
        priority = 64;
    }
    public EGUIbutton( PFont fnt, float textSize, String title, float x, float y ) {
        type = -1001;        // tipo de proceso UI..
        this.title = title;
        blitter.pushMatrix();
        blitter.textFont(fnt);
        this.textSize = textSize;
        h = (int)(textSize + textSize/2);
        blitter.textSize(textSize);
        w = (int)blitter.textWidth(title) + (int)textWidth("OO");
        blitter.popMatrix();
        this.x = x;
        this.y = y;
        this.size = 100;
        priority = 64;
    }
    public EGUIbutton( PImage gTile, float size, float x, float y ) {
        type = -1001;        // tipo de proceso UI..
        this.gTile = gTile;
        this.x = x;
        this.y = y;
        this.size = size;
        this.w = gTile.width;
        priority = 64;
    }
    void frame() {
        if (gTile != null) {
            screenDrawGraphic( gTile, x, y, 0, size, size, 255 );
        }
        switch(st) {
        case 0:
            if (gTile != null) {
                g1 = newGraph(w+10, gTile.height+4, c1);
                g2 = newGraph(w+10, gTile.height+4, c2);
                g3 = newGraph(w+10, gTile.height+4, c10);
            } else {
                g1 = newGraph(w+4, h, c1);
                g2 = newGraph(w+4, h, c2);
                g3 = newGraph(w+4, h, c10);
            }
            sizeX = sizeY = size;
            setGraph(g1);
            createBody(TYPE_BOX);
            setStatic(true);
            st = 10;
            break;
        case 10:
            screenDrawText(null, (int)textSize, title, CENTER, x, y, textColor, 255);
            if (collisionMouse(this) && !lockUi ) {
                graph = g3;
                if (mouse.touch) {
                    graph = g2;
                    value = 1;
                    //method(eventName);
                    st = 20;
                }
            } else {
                graph = g1;
            }
            break;
        case 20:
            lockUi = true;
            screenDrawText(null, (int)textSize, title, CENTER, x, y, textColor, 255);
            value = 0;
            if (!mouse.touch) {
                lockUi = false;
                graph = g1;
                method(eventName);
                st = 10;
            }
            break;
        }
    }
    
    void setEvent( String methodName ){
        this.eventName = methodName;
    }
    
    void setTextColor(color c){
        this.textColor = c;
    }
    
    void setColor(color a, color b, color c){
        this.c1 = a;        // color del boton normal..
        this.c2 = c;        // color del boton mouseOver..
        this.c10 = b;      // color del boton clickOver..
    }
}
//==============================================================================================================================================
class EGUIgbutton extends sprite{
    int st = 0;
    PImage gr;
    color collisionMouseTintColor = ORANGE;
    color clickMouseTintColor = BLUE;
    String eventName = "";
    PFont fntText;
    int sizeText;
    String labelText;
    int alignText;
    float xText;
    float yText;
    color colorText;
    float alphaText;
    boolean drawLabel = false;
    EGUIgbutton(PImage gr, float x, float y, int size){
        type = -1001;        // tipo de proceso UI..
        this.gr = gr;
        this.x = x;
        this.y = y;
        this.size = size;
        priority = 64;
        setGraph(gr);
        createBody(TYPE_BOX, TYPE_SENSOR);
        setSensor(true);
        setStatic(true);
    }
    void frame(){
        switch(st){
            case 0:
                //setGraph(gr);
                //createBody(TYPE_BOX, TYPE_SENSOR);
                st = 10;
                break;
            case 10:
                if(collisionMouse(this) && !lockUi){
                    tint(collisionMouseTintColor);
                    if(mouse.touch){
                        tint(GRAY);
                        lockUi = true;
                        method(eventName);
                        st = 20;
                    }
                }else{
                    tint(WHITE);
                }
                break;
            case 20:
                if(!mouse.touch){
                    lockUi = false;
                    tint(WHITE);
                    st = 10;
                }
                break;
        }
        
        if(drawLabel){
            screenDrawText(fntText, sizeText, labelText, alignText, x+xText, y+yText, colorText, alphaText);
        }
        
    }
    void setEvent( String methodName ){
        this.eventName = methodName;
    }
    
    void setLabel(PFont fntText, int sizeText, String labelText, int alignText, float xText, float yText, color colorText, float alphaText){
        this.drawLabel = true;
        this.fntText = fntText;
        this.sizeText = sizeText;
        this.labelText = labelText;
        this.alignText = alignText;
        this.xText = xText;
        this.yText = yText;
        this.colorText = colorText;
        this.alphaText = alphaText;
    }
}
//==============================================================================================================================================
class EGUIradioButton extends sprite {
    int st = 0;
    String option[];
    int w = 110;
    int h = 18;
    int textSize = 14;
    PImage g1, g2, g3;
    int num = 0;
    int value = 0;        // indica la opcion escogida..
    boolean collision = false;
    String eventName;
    public EGUIradioButton( String option[], float x, float y ) {
        type = -1001;        // tipo de proceso UI..
        this.option = option;
        this.x = x;
        this.y = y;
    }
    void frame() {
        switch(st) {
        case 0:
            priority = 64;
            g1 = newGraph(w-2, h, c1);
            g2 = newGraph(w-2, h, c2);
            g3 = newGraph(w-2, h, c10);
            st = 10;
            break;
        case 10:
            for ( int i=0; i<option.length; i++ ) {
                num = int((mouse.x-(x-w/2)) / w);
                collision = false;
                if (mouse.y>y-h/2 && mouse.y<y+h/2) {
                    collision = true;
                }
                
                if (collision) {
                    if(mouse.touch){
                        this.st = 20;
                    }
                    if (num==i) {
                        if (mouse.touch) {
                            value = num;
                            screenDrawGraphic(g2, x + w*i, y, 0, 100, 100, 255);        // colisiono y mouse SI encima mio y mouse.touch SI..
                        } else {
                            screenDrawGraphic(g3, x + w*i, y, 0, 100, 100, 255);        // colisiono y mouse NO encima mio y mouse.touch NO..
                            if(num==value){
                                screenDrawGraphic(g2, x + w*i, y, 0, 100, 100, 255);
                            }
                        }
                    } else {
                        screenDrawGraphic(g1, x + w*i, y, 0, 100, 100, 255);            // colisiono y mouse NO encima mio..
                    }
                    
                    if(value==i){
                        screenDrawGraphic(g2, x + w*i, y, 0, 100, 100, 255);
                    }
                } else {
                    if (value == i) {
                        screenDrawGraphic(g2, x + w*i, y, 0, 100, 100, 255);    // colision NO y seleccionado SI..
                    } else {
                        screenDrawGraphic(g1, x + w*i, y, 0, 100, 100, 255);    // colision NO y seleccionado NO..
                    }
                }   

                screenDrawText(null, textSize, option[i], CENTER, x + w*i, y-2, 255, 255);
            }
            
            break;
        case 20:
            for ( int i=0; i<option.length; i++ ) {
                num = int((mouse.x-(x-w/2)) / w);
                collision = false;
                if (mouse.y>y-h/2 && mouse.y<y+h/2) {
                    collision = true;
                }
                
                if (collision) {
                    if (num==i) {
                        if (mouse.touch) {
                            value = num;
                            screenDrawGraphic(g2, x + w*i, y, 0, 100, 100, 255);        // colisiono y mouse SI encima mio y mouse.touch SI..
                        } else {
                            screenDrawGraphic(g3, x + w*i, y, 0, 100, 100, 255);        // colisiono y mouse NO encima mio y mouse.touch NO..
                            if(num==value){
                                screenDrawGraphic(g2, x + w*i, y, 0, 100, 100, 255);
                            }
                        }
                    } else {
                        screenDrawGraphic(g1, x + w*i, y, 0, 100, 100, 255);            // colisiono y mouse NO encima mio..
                    }
                    
                    if(value==i){
                        screenDrawGraphic(g2, x + w*i, y, 0, 100, 100, 255);
                    }
                } else {
                    if (value == i) {
                        screenDrawGraphic(g2, x + w*i, y, 0, 100, 100, 255);    // colision NO y seleccionado SI..
                    } else {
                        screenDrawGraphic(g1, x + w*i, y, 0, 100, 100, 255);    // colision NO y seleccionado NO..
                    }
                }   

                screenDrawText(null, textSize, option[i], CENTER, x + w*i, y-2, 255, 255);
            }
            
            if(!mouse.touch){
                method(eventName);
                this.st = 10;
            }
            break;
        }
    }
    //++++++++++++++++++++++++++
    void setEvent( String methodName ){
        this.eventName = methodName;
    }
    //++++++++++++++++++++++++++
}
//==============================================================================================================================================
class EGUIlabel extends sprite {
    PFont fnt_;
    int size;
    String text;
    int cod;
    color col;
    //++++++++++++++++++++++++++
    public EGUIlabel(PFont fnt_, int size, String text, int cod, float x, float y, color col, float alpha){
        this.fnt_ = fnt_;
        this.size = size;
        this.text = text;
        this.cod = cod;
        this.x = x;
        this.y = y;
        this.col = col;
        this.alpha = alpha;
        priority = 64;
        type = -1001;        // tipo de proceso UI..
    }
    //++++++++++++++++++++++++++
    void frame(){
        screenDrawText(fnt_, size, text, cod, x, y, col, alpha);
    }
    //++++++++++++++++++++++++++
}
//==============================================================================================================================================
class EGUIcheckBox extends sprite {
    int st = 0;
    PImage g1, g2, g3;
    String title = "";
    boolean value = false;        // parametro de salida que dice como esta la caja..
    int w = 22;
    int h = 18;
    color color1 = c1;
    color color2 = c2;
    String eventName;
    String text = "";
    PFont fnt = null;
    int textSize = 14;
    color textColor;
    //++++++++++++++++++++++++++
    public EGUIcheckBox( float x, float y, int w, int h ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        g1 = newGraph(w, h, color1);
        g2 = newGraph(w, h, color2);
        g3 = newGraph(w, h, color2);
        type = -1001;        // tipo de proceso UI..
        priority = 64;
    }
    //++++++++++++++++++++++++++
    public EGUIcheckBox( float x, float y, int w, int h, color cc1, color cc2 ) {
        this.x = x;
        this.y = y;
        this.color1 = cc1;
        this.color2 = cc2;
        this.w = w;
        this.h = h;
        g1 = newGraph(w, h, color1);
        g2 = newGraph(w, h, color2);
        g3 = newGraph(w, h, color2);
        type = -1001;        // tipo de proceso UI..
        priority = 64;
    }
    //++++++++++++++++++++++++++
    void frame() {
        switch(st) {
        case 0:
            //g1 = newGraph(size, size, color1);
            //g2 = newGraph(size, size, color2);
            //g3 = newGraph(size, size, color2);
            if(graph!=null){        // si he llamado a setValue() antes de que pase un frame.. graph ya tiene algun valor.. lo uso para el setGraph()..
                setGraph(graph);
            } else{
                setGraph(g1);
            }
            createBody(TYPE_BOX);
            setStatic(true);
            st = 10;
            break;
        //++++++++++++++++++++++++++
        case 10:
            if ( collisionMouse(this) && !lockUi ) {
                screenDrawGraphic(g3, x, y, 0, 100, 100, 64);
                if (mouse.touch) {
                    
                    if(value) {
                        value = false;
                        graph = g1;
                    } else if (!value) {
                        value = true;
                        graph = g2;
                    }
                    st = 20;
                }
            }
            break;
        //++++++++++++++++++++++++++
        case 20:
            lockUi = true;
            if (!mouse.touch) {
                lockUi = false;
                method(eventName);
                st = 10;
            }
            break;
        }
        screenDrawText(fnt, textSize, text, CENTER, x, y, textColor, 255);
    }
    //++++++++++++++++++++++++++
    void setValue(boolean value) {
        if(value) {
            graph = g2;
            this.value = true;
            } else{
                graph = g1;
                this.value = false;
        }
    }
    //++++++++++++++++++++++++++
    void setColorSelected( color c ){
        this.color1 = c;
    }
    //++++++++++++++++++++++++++
    void setColorUnselected(color c){
        this.color2 = c;
    }
    //++++++++++++++++++++++++++
    void setEvent( String methodName ){
        this.eventName = methodName;
    }
    //++++++++++++++++++++++++++
    void setText(PFont fnt, String text){
        this.fnt = fnt;
        this.text = text;
    }
    //++++++++++++++++++++++++++
    void setTextColor(color col){
        this.textColor = col;
    }
    //++++++++++++++++++++++++++
}
//==============================================================================================================================================
//==============================================================================================================================================
//==============================================================================================================================================
//==============================================================================================================================================
