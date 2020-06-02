////////////////////////////////////////////////////////////////////////
//            This file are part of:
//            GameLibZero 2.4.5 by Luis Lopez Martinez
//                13/04/2019 - Barcelona SPAIN.
//                        OPEN SOURCE  
////////////////////////////////////////////////////////////////////////

import fisica.*;
FWorld world;
final int TYPE_BOX = -1;
final int TYPE_CIRCLE = -2;
final int TYPE_SENSOR = -3;

// materiales disponibles para la simulación física..
final int WOOD    = 1;
final int METAL   = 2;
final int STONE   = 3;
final int PLASTIC = 4;
final int RUBBER  = 5;
final int HUMAN   = 6;

import java.util.*;
int resolutionWidth;
int resolutionHeight;
int virtualResolutionWidth;
int virtualResolutionHeight;
boolean fullscreen_ = false;
ArrayList<sprite> sprites;
sprite _id_;
PGraphics blitter;
int fps = 60;
boolean fading = false;
float deltaFading = 0;
float alphaFading = 255;
int fadingType = 0;
color fadingColor = 1;
Mouse mouse;
color backgroundColor = 0;

// new..
color LIGHTGRAY = color( 200, 200, 200, 255 );        // Light Gray
color GRAY      = color( 130, 130, 130, 255 );        // Gray
color DARKGRAY  = color( 80, 80, 80, 255 );           // Dark Gray
color YELLOW    = color( 253, 249, 0, 255 );          // Yellow
color GOLD      = color( 255, 203, 0, 255 );          // Gold
color ORANGE    = color( 255, 161, 0, 255 );          // Orange
color PINK      = color( 255, 109, 194, 255 );        // Pink
color RED       = color( 230, 41, 55, 255 );          // Red
color MAROON    = color( 190, 33, 55, 255 );          // Maroon
color GREEN     = color( 0, 228, 48, 255 );           // Green
color LIME      = color( 0, 158, 47, 255 );           // Lime
color DARKGREEN = color( 0, 117, 44, 255 );           // Dark Green
color SKYBLUE   = color( 102, 191, 255, 255 );        // Sky Blue
color BLUE      = color( 0, 121, 241, 255 );          // Blue
color DARKBLUE  = color( 0, 82, 172, 255 );           // Dark Blue
color PURPLE    = color( 200, 122, 255, 255 );        // Purple
color VIOLET    = color( 135, 60, 190, 255 );         // Violet
color DARKPURPLE= color( 112, 31, 126, 255 );         // Dark Purple
color BEIGE     = color( 211, 176, 131, 255 );        // Beige
color BROWN     = color( 127, 106, 79, 255 );         // Brown
color DARKBROWN = color( 76, 63, 47, 255 );           // Dark Brown
color WHITE     = color( 255, 255, 255, 255 );        // White
color BLACK     = color( 0, 0, 0, 255 );              // Black
color BLANK     = color( 0, 0, 0, 0 );                // Transparent
color MAGENTA   = color( 255, 0, 255, 255 );          // Magenta
color RAYWHITE  = color( 245, 245, 245, 255 );        // Ray White

int WIDTH = 0;
int HEIGHT = 0;
boolean bilinearFilterActivated = true;
//------------------------------------------------------------
void settings() {
    size(320, 200, P3D);
    noSmooth();
    Settings();
    if (fullscreen_) {
        fullScreen();
    }
}
//------------------------------------------------------------
void setup() {
    prepareExitHandler();
    sprites = new ArrayList<sprite>();
    Fisica.init(this);
    world = new FWorld(-10000,-10000,10000,10000);
    world.setGravity(0,0);
    mouse = new Mouse();
    Setup();
    setModeSecondSteep();
    WIDTH  = virtualResolutionWidth;
    HEIGHT = virtualResolutionHeight;
    frameRate(fps);
    blitter = createGraphics(virtualResolutionWidth, virtualResolutionHeight, P3D);
    blitter.noSmooth();
    
    
    if(bilinearFilterActivated){
        // BILINEAR..
        ((PGraphicsOpenGL)g).textureSampling(4);
        ((PGraphicsOpenGL)blitter).textureSampling(4);
    }else{
        // LINEAR..
        ((PGraphicsOpenGL)g).textureSampling(3);
        ((PGraphicsOpenGL)blitter).textureSampling(3);
    }
    
    surface.setResizable(true);
    //surface.setTitle("CENTRAL PLAN 2.0 - EXPRESSATE S.L");
    //surface.setVisible(false);
    
    background(backgroundColor);
    
    hint(DISABLE_DEPTH_TEST);
    hint(DISABLE_DEPTH_SORT);
    hint(DISABLE_DEPTH_MASK);
}
//------------------------------------------------------------
void draw() {
    if(frameCount==2){
        blitter.hint(DISABLE_DEPTH_TEST);
        blitter.hint(DISABLE_DEPTH_SORT);
    }
    
    // screen resize operations..
    if (resolutionWidth != width || resolutionHeight != height) {
        resolutionWidth = width;
        resolutionHeight = height;
    }
    
    // mouse operations..
    mouse.oldX = mouse.x;
    mouse.oldY = mouse.y;
    mouse.x = (mouseX * virtualResolutionWidth ) / resolutionWidth; 
    mouse.y = (mouseY * virtualResolutionHeight) / resolutionHeight;
    
    mouse.wheelUp = false;    // 2018
    mouse.wheelDown = false;
    if(mouse.wheel != 0){
        if(mouse.wheel > 0){
            mouse.wheelUp = true;
        }else{
            mouse.wheelDown = true;
        }
        mouse.wheel = 0;
    }
    
    // Sort sprites..
    Collections.sort(sprites, new spriteComparator());

    // clean background and draw sprite collection..
    blitter.beginDraw();
    blitter.noClip();
    blitter.background(backgroundColor);
    blitter.shapeMode(CENTER);
    blitter.noStroke();
    // draw sprites..
    for (int i = sprites.size()-1; i >= 0; i--) {
        _id_ = sprites.get(i);
        if(_id_.liveFrames == 0){
            _id_.initialize();
        }
        _id_.liveFrames++;
        // first steep.. execute sprite code..
        _id_.draw();
        // second steep.. 
        // check if this sprite needs dead..
        if (_id_.statusKill) {
            _id_.finalize();
            world.remove(_id_.b);        // elimino el shape del mundo..
            sprites.remove(_id_);        // elimino el sprite de la lista..
            _id_.deleteFromMemory();     // operaciones internas de la clase sprite antes de expirar..
        }
        if (!_id_.live) {
            _id_.statusKill = true;
            //println(_id_, "marcado para morir!");
        }
        
        
    }
    
    if (fading) {
        if (fadingType == -1) {
            if (alphaFading < 255) {
                alphaFading += deltaFading;
            } else {
                deltaFading = 0;
                alphaFading = 255;
                fading = false;
            }
        } else if (fadingType == 1) {
            if (alphaFading > 0) {
                alphaFading -= deltaFading;
            } else {
                deltaFading = 0;
                alphaFading = 0;
                fading = false;
            }
        }
    }
    
    _id_ = null;
    Draw();
    world.step();
    
    blitter.endDraw();
    noStroke();
    image(blitter, 0, 0, width, height);
    if (alphaFading<255) {
        fill(fadingColor, 255-alphaFading);
        rect(0, 0, width, height);
    }
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
void setGravity(float x, float y){
     world.setGravity(x,y);
}
//------------------------------------------------------------
class region{
    float x;
    float y;
    float w;
    float h;
    public region(float x, float y, float w, float h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
//------------------------------------------------------------
int _gameLibZeroUUID_ = 0;
int getGameLibZeroUUID(){
    return ++_gameLibZeroUUID_;
}
//------------------------------------------------------------
class sprite {
    int priority = 512;                    // priority execution..
    boolean live = true;                   // if false this sprite has prepared ti killed by the core in the next frame..
    boolean statusKill = false;            // if true.. core kills this sprite inmediatly..
    boolean visible = false;               // show/hide sprite..
    PImage graph;                          // texture of sprite..
    float x = 0;                           // x position..
    float y = 0;                           // y position..
    float z = 0;                           // profundidad..
    float angle = 0;                       // angle of rotation in degrees..
    float sizeX = 100.0;                   // size widtt for scale sprite..
    float sizeY = 100.0;                   // size height for scale sprite..
    float size  = 100.0;                   // size of the sprite.. if this are diferent of 100.0 apply the sizeX & sizeY..
    float alpha = 255;                     // transparency of sprite..
    PShape s;                              // quad shape of sprite..
    int id;                                // UUID identifier of sprite..
    float x0;                              // offsetX texture..
    float y0;                              // offsetY texture..
    float radius;                          // radius of this sprite for simple collision check..
    float type = 0;                       // type of sprite.. for collisionType() check..
    sprite idTempForCheckCollision;
    FBody b = null;                        // physic shape of this sprite..
    region r = new region(0,0,virtualResolutionWidth,virtualResolutionHeight);
    boolean onScene = false;
    scene sceneId = null;
    float oldX;
    float oldY;
    float SX, SY;                          // screen X cord, screen Y cord..
    sprite father;
    boolean killProtection = false;        // evita que este proceso pueda ser destruido por signal o letMeAlone();
    boolean XMIRROR = false;               // bugfix
    boolean YMIRROR = false;               // bugfix
    String className;
    color tintColor = 255;
    float xCenter = 0;
    float yCenter = 0;
    int liveFrames = 0;
    boolean graphic = false;
    boolean model   = false;
    float anglex = 0;
    float angley = 0;
    float sizeZ  = 100;
    //......................................
    // constructor..
    sprite() {
        this.father = _id_;
        this.className = this.getClass().getName();
        sprites.add(this);
        this.id = getGameLibZeroUUID();
    }
    //......................................
    // functions..
    //......................................
    void initialize(){
        
    }
    //......................................
    void finalize(){
        // nothing..
    }
    //......................................
    void setRegion(region r){
        this.r = r;
    }
    //......................................
    void setType(int type){
        this.type = type;
    }
    //......................................
    void setCenter(float Px, float Py){
        if(size==100){
            this.xCenter = graph.width/2 - Px;
            this.yCenter = graph.height/2 - Py;
        }else{
            this.xCenter = graph.width/2 - Px;
            this.yCenter = graph.height/2 - Py;
        }
    }
    //......................................
    void draw() {
        if(!live){
            return;        // bugfix 
        }
        if (graphic) {
            s.setTexture(graph);
            blitter.pushMatrix();
            
            
            blitter.imageMode(CORNER);            // bugfix..
            blitter.rotate(0);                    // bugfix..
            blitter.clip( r.x, r.y, r.w, r.h );   // bugfix..
            
            
            blitter.imageMode(CENTER);
            if(onScene){
                SX = x - sceneId.x + sceneId.xInicial;
                SY = y - sceneId.y + sceneId.yInicial;
                blitter.translate(SX, SY, z);
            } else{
                blitter.translate(x, y, z);
            }
            
            blitter.rotate(radians(-angle));
            blitter.rotateX(radians(anglex));
            blitter.rotateY(radians(angley));
            
            if(size==100){
                blitter.scale( XMIRROR ? -sizeX/100.0 : sizeX/100.0, YMIRROR ? -sizeY/100.0 : sizeY/100.0);
            }else{
                blitter.scale( XMIRROR ? -size/100.0 : size/100.0, YMIRROR ? -size/100.0 : size/100.0);
            }
            
            blitter.tint(tintColor, alpha);
            //blitter.clip(0,0,mouse.x,mouse.y);
            blitter.noStroke();
            if(visible){
                blitter.shape(s, xCenter, yCenter);
            }
            blitter.popMatrix();
        }
        oldX = x;
        oldY = y;
        
        if (b != null) {
            x = b.getX();
            y = b.getY();
            angle = -degrees(b.getRotation());
        }
        
        if (model) {
            if (visible) {
                blitter.pushMatrix();
                blitter.translate(x, y, z);
                blitter.scale(size/10);
                blitter.rotate(radians(-angle));
                blitter.rotateY(radians(angley));
                blitter.rotateX(radians(anglex));
                blitter.shapeMode(CORNERS);
                blitter.shape(s);
                blitter.shapeMode(CENTER);
                blitter.popMatrix();
            }
        }
        
        frame();
    }
    //......................................
    void createBody(int TYPE_BODY, int material){
        createBody(TYPE_BODY);
        if(material == TYPE_SENSOR){
            setSensor(true);
        } else{
            setMaterial(material);
        }
    }
    void createBody( int TYPE_BODY) {
        switch(TYPE_BODY) {
        case TYPE_BOX:
            if(size==100){
                b = new FBox( (graph.width*sizeX)/100, (graph.height*sizeY)/100 );
            }else{
                b = new FBox( (graph.width*size)/100, (graph.height*size)/100 );
            }
            b.setPosition( x, y );
            world.add( b );
            break;
        case TYPE_CIRCLE:
            if(size==100){
                b = new FCircle( ((graph.width*sizeX)/100 + (graph.height*sizeY)/100) / 2.0 );
            }else{
                b = new FCircle( (graph.width*size)/100 );
            }
            b.setPosition( x, y );
            world.add( b );
            break;
        }
        b.setGrabbable(false);
        b.setRotation(radians(angle));
        //b.setGroupIndex(-1);
    }
    //......................................
    void setMaterial( int material ) {
        switch(material) {
        case WOOD:
            b.setFriction(0.50);
            b.setRestitution(0.17);
            b.setDensity(0.57);
            break;
        case METAL:
            b.setFriction(0.13);
            b.setRestitution(0.17);
            b.setDensity(7-80);
            break;
        case STONE:
            b.setFriction(0.75);
            b.setRestitution(0.05);
            b.setDensity(2.40);
            break;
        case PLASTIC:
            b.setFriction(0.38);
            b.setRestitution(0.09);
            b.setDensity(0.95);
            break;
        case RUBBER:
            b.setFriction(0.75);
            b.setRestitution(0.95);
            b.setDensity(1.70);
            break;
        case HUMAN:
            b.setFriction(1.00);
            b.setRestitution(0.00);
            b.setDensity(0.95);
            break;
        }
    }
    //......................................
    void setBullet(boolean bulletMode){
        if(b!=null){
            b.setBullet(bulletMode);
        }
    }
    //..............................
    void setDamping(float damping) {
        b.setDamping(damping);
    }
    //..............................
    void setDrag(boolean drag_) {
        b.setGrabbable(drag_);
    }
    //..............................
    void addImpulse(float angle, float impulse) {
        float fx = impulse*cos(radians(angle));
        float fy = -impulse*sin(radians(angle));
        b.addImpulse(fx, fy);
    }
    //..............................
    void addImpulse(float angle, float impulse, int offsetX, int offsetY) {
        float fx = impulse*cos(radians(angle));
        float fy = -impulse*sin(radians(angle));
        b.addImpulse(fx, fy, -offsetX, -offsetY);
    }
    //..............................
    void addVx(float vx) {
        b.addImpulse(vx, 0);
    }
    //..............................
    void addVy(float vy) {
        b.addImpulse(0, vy);
    }
    //..............................
    void setPosition(float x, float y) {
        if(b==null){
            return;
        }
        b.setPosition(x, y);
    }
    //..............................
    //..............................
    void setVx(float vx) {
        b.setVelocity(vx, getVy());
    }
    //..............................
    //..............................
    void setVy(float vy) {
        b.setVelocity(getVx(), vy);
    }
    //..............................
    void addPosition(float x_, float y_) {
        b.adjustPosition(x_, y_);
    }
    void translate(float x_, float y_){
        b.setPosition(x_, y_);
    }
    //..............................
    float getVx() {
        return b.getVelocityX();
    }
    //..............................
    float getVy() {
        return b.getVelocityY();
    }
    //..............................
    void setGroup(int group_) {
        b.setGroupIndex(group_);
    }
    //..............................
    void setAngle(float ang_) {
        //b.setRotation(radians(ang_-270));
        b.setRotation(radians(-ang_));
    }
    //..............................
    void setStatic(boolean static_) {
        b.setStatic(static_);
    }
    //..............................
    void setSensor(boolean sensor_){
        b.setSensor(sensor_);
    }
    //..............................
    void frame() {
    }
    //......................................
    void setGraph(PImage graph_) {
        graph = graph_;
        s = createShape();
        s.setTexture(graph);
        s.beginShape();
        s.tint(255, alpha);
        s.vertex(0, 0, x0, y0);
        s.vertex(graph.width, 0, graph.width+x0, 0);
        s.vertex(graph.width, graph.height, graph.width+x0, graph.height+y0);
        s.vertex(0, graph.height, x0, graph.height+y0);
        s.endShape(CLOSE);
        s.disableStyle();
        visible = true;
        graphic = true;
        model  = false;
    }
        //......................................
    void setModel(PShape s) {
        this.s = s;
        visible = true;
        model = true;
        graphic = false;
    }
    //......................................
    void deleteFromMemory() {
        //id = null;
    }
    //......................................
    //protected void finalize() throws Throwable{
    //  super.finalize();
    //}
    //......................................
    PVector getPoint(float x_, float y_){                                // pre2019..
        // calcular el punto cero de la imagen..
        // esquina superior izquierda del sprite + el offset indicado..
        float xx = x-graph.width/2 * (sizeX/100);
        float yy = y-graph.height/2 * (sizeY/100);
        x_ += xCenter;
        y_ += yCenter;
        xx += x_ * (sizeX/100);
        yy += y_ * (sizeY/100);
        float dst = getDist(xx, yy);
        float ang = getAngle(xx, yy);
        return advanceVector(dst, ang+angle);
    }
    //......................................
    PVector advanceVector(float dist_, float angle_) {                    // pre2019..
        float x_ = x;
        float y_ = y;
        x_ = x_ + dist_*cos(radians(-angle_));
        y_ = y_ + dist_*sin(radians(-angle_));
        return new PVector(x_, y_);
    }
    //......................................
    PVector advanceVector(float x, float y, float dist_, float angle_) {
        x = x + dist_*cos(radians(-angle_));
        y = y + dist_*sin(radians(-angle_));
        return new PVector(x, y);
    }
    //......................................
    void advance(float dist_, float angle_) {
        x = x + dist_*sin(radians(90.0 + -angle_));
        y = y - dist_*cos(radians(90.0 + -angle_));
        if(b!=null){
            b.setPosition(x,y);
            b.wakeUp();
        }
    }
    //......................................
    void advance(float dist_) {
        x = x + dist_*sin(radians(90.0 + -angle));
        y = y - dist_*cos(radians(90.0 + -angle));
        if(b!=null){
            b.setPosition(x,y);
            b.wakeUp();
        }
    }
    //......................................
    float getAngle(float Bx, float By) {
        float ang = degrees(atan2( By-y, Bx-x ));
        if (ang < 0) {
            ang = 360.0 + ang;
        }
        if (ang >= 360.0) {
            ang = 0;
        }  
        return 360 - ang;
    }
    //......................................
    float getAngle(PVector vec){
        return getAngle(vec.x, vec.y);
    }
    //......................................
    float getDist(float x2, float y2) {
        return sqrt((x-x2)*(x-x2) + (y-y2)*(y-y2));
    }
    //......................................
    float getDist(sprite s) {
        return sqrt((x-s.x)*(x-s.x) + (y-s.y)*(y-s.y) + (z-s.z)*(z-s.z));
    }
    //......................................
    float getDist(PVector vec) {
        return sqrt((x-vec.x)*(x-vec.x) + (y-vec.y)*(y-vec.y));
    }
    //......................................
    boolean collision(sprite id_) {
        if(!exists(id_)){
            println("Collision warning! remote sprite not has a body..");
            return false;
        }
        if(b == null){
            println("Collision warning! sprite not has a body..");
            return false;
        }
        return b.isTouchingBody(id_.b);
    }
    //......................................
        sprite collisionMouseType(int type_){
        for(sprite s : sprites){
            if(s.type == type_){
                if(s.b!=null){
                    if(world.getBody(mouse.x,mouse.y) == s.b){
                        return s;
                    }
                }
            }
        }
        return null;
    }
    //......................................
    sprite collisionType(int type_) {
        // recorrer la colección de sprites..
        for (int i = sprites.size()-1; i >= 0; i--) {
            // buscar los que son del tipo indicado..
            idTempForCheckCollision = sprites.get(i);
            if (idTempForCheckCollision.type == type_) {
                // comprobar si hay colision..
                if (collision(idTempForCheckCollision)) {
                    // retorno el id del sprite que colisiona..
                    return idTempForCheckCollision;
                }
            }
        }
        return null;
    }
    //......................................
    void setScene(scene sceneId){
        onScene = true;
        this.sceneId = sceneId;
        r = sceneId.r;
        //priority = sceneId.priority-1;
    }
    //......................................
    boolean isContact(float angA, float angB){
        // angulo del vector entre el cuerpo del sprite y el punto de contacto..
        float ang = 0;
        
        // lista de contactos..
        ArrayList contacts = b.getContacts();
        
        // recorrer lista de contactos..
        for (int i=0; i<contacts.size(); i++) {
            // recojo el contacto actual..
            FContact c = (FContact)contacts.get(i);
            
            // si el cuerpo 1 soy yo..
            if(c.getBody1() == b){
                ang = getAngle(c.getX(), c.getY());
                //println(ang);
            } else{    // si el cuerpo 2 soy yo..
                ang = getAngle(c.getX(), c.getY());
                //println(frameCount, ang);
                
            }
            
            // si el angulo que formo con el contacto esta entre los margenes pasados como parametros..
            if( ang > angA && ang < angB ){
                return true;
            }
        }
        return false;
    }
    //......................................
    void tint(color c){
        this.tintColor = c;
    }
    //......................................
    void brakeVx(float percent){
        b.setVelocity(b.getVelocityX()*percent, b.getVelocityY());
    }
    //......................................
    void brakeVy(float percent){
        b.setVelocity(b.getVelocityX(), b.getVelocityY()*percent);
    }
    //......................................
    void brakeVelocity(float percent){
        brakeVx(percent);
        brakeVy(percent);
    }
    //......................................
    //......................................
}
//------------------------------------------------------------
class spriteComparator implements Comparator {
    int compare(Object o1, Object o2) {
        int z1 = ((sprite) o1).priority;
        int z2 = ((sprite) o2).priority;
        return z1 - z2;
    }
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
//------------------------------------------------------------
final void screenDrawText(PFont fnt_, int size, String text, int cod, float x, float y, color col, float alpha) {  
    blitter.pushMatrix();
    blitter.camera();
    blitter.noLights();
    blitter.hint(DISABLE_DEPTH_TEST); 
    if (fnt_ != null) {
        blitter.textFont(fnt_);
    }
    blitter.textSize(size);
    if (cod==CENTER) {
        blitter.textAlign(CENTER, CENTER);
    }
    if (cod==RIGHT) {
        blitter.textAlign(LEFT, CENTER);
    }
    if (cod==LEFT) {
        blitter.textAlign(RIGHT, CENTER);
    }
    blitter.noClip();
    blitter.fill(col, alpha);
    blitter.text(text, x, y);
    blitter.hint(ENABLE_DEPTH_TEST);
    blitter.popMatrix();
}
//------------------------------------------------------------
// pintar un grafico de manera sencilla en pantalla con size_x e size_y y alpha..
final void screenDrawGraphic(PImage img_, float x, float y, float angle, float sizeX, float sizeY, float alpha) {
    blitter.pushMatrix();
    blitter.camera();
    blitter.noLights();
    blitter.hint(DISABLE_DEPTH_TEST); 
    blitter.imageMode(CENTER);
    blitter.tint(255, alpha);
    blitter.translate(x, y, 0);
    blitter.rotate(radians(angle));
    blitter.scale(sizeX/100.0, sizeY/100.0);
    blitter.noClip();
    blitter.image(img_, 0, 0);
    blitter.hint(ENABLE_DEPTH_TEST);
    blitter.popMatrix();
}
//------------------------------------------------------------
final void screenDrawGraphic(region r, PImage img_, float x, float y, float angle, float sizeX, float sizeY, float alpha) {    // bugfix..
    blitter.pushMatrix();
    blitter.camera();
    blitter.noLights();
    blitter.hint(DISABLE_DEPTH_TEST); 
    blitter.imageMode(CORNER);
    blitter.tint(255, alpha);
    blitter.clip( r.x, r.y, r.w, r.h );
    blitter.rotate(0);
    //blitter.background(color(255,255,255));
    blitter.imageMode(CENTER);
    blitter.translate(x, y, 0);
    blitter.rotate(radians(angle));
    blitter.scale(sizeX/100.0, sizeY/100.0);
    blitter.image(img_, 0, 0);
    blitter.noClip();
    blitter.hint(ENABLE_DEPTH_TEST);
    blitter.popMatrix();
}
//------------------------------------------------------------
final PImage writeInMap(PFont fnt, int size, String texto) {
    PGraphics buffer = null;
    buffer = createGraphics(virtualResolutionWidth, virtualResolutionHeight, P2D);
    buffer.beginDraw();
    buffer.textAlign(LEFT, TOP);
    buffer.textFont(fnt);
    buffer.textSize(size);
    buffer.fill(#FFFFFF);
    PImage dst = createImage((int)buffer.textWidth(texto), (int)(buffer.textAscent()+buffer.textDescent()+size), ARGB);
    buffer.text(texto, 0, 0);
    buffer.endDraw();
    dst.blend( buffer, 0, 0, dst.width, dst.height, 0, 0, dst.width, dst.height, BLEND );
    buffer = null;
    return dst;
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
//------------------------------------------------------------
PImage[] loadImages(String nameFolder) {
    java.io.File folder = new java.io.File(dataPath("")+"/"+nameFolder);
    String[] filenames = folder.list();
    //println(filenames.length);
    //println(dataPath("")+"/"+nameFolder);
    PImage[] img;
    try{
        img = new PImage[filenames.length];
    } catch(Exception e){
        println("ERROR: loadImages(" + nameFolder + "); check folder name ?");
        return null;
    }
    for (int i = 0; i < filenames.length; i++) {
        //println("Loading: "+filenames[i]);
        img[i] = loadImage(dataPath("") + "/" + nameFolder + "/" + filenames[i]);
    }
    return img;
}
//------------------------------------------------------------
// new..
PFont[] loadFonts(String nameFolder) {
    java.io.File folder = new java.io.File(dataPath("")+"/"+nameFolder);
    String[] filenames = folder.list();
    //println(filenames.length);
    //println(dataPath("")+"/"+nameFolder);
    PFont[] fnt;
    try{
        fnt = new PFont[filenames.length];
    } catch(Exception e){
        println("ERROR: loadFonts(" + nameFolder + "); check folder name ?");
        return null;
    }
    for (int i = 0; i < filenames.length; i++) {
        //println("Loading: "+filenames[i]);
        fnt[i] = loadFont(dataPath("") + "/" + nameFolder + "/" + filenames[i]);
    }
    return fnt;
}
//------------------------------------------------------------
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
//------------------------------------------------------------
final void setMode(int w, int h, boolean modeWindow_) {
    virtualResolutionWidth = w;
    virtualResolutionHeight = h;
    fullscreen_ = modeWindow_;
}
final void setMode(int w, int h, boolean modeWindow_, boolean bilinear) {
    virtualResolutionWidth = w;
    virtualResolutionHeight = h;
    fullscreen_ = modeWindow_;
    bilinearFilterActivated = bilinear;
}
//------------------------------------------------------------
final void setModeSecondSteep() {
    if (fullscreen_) {
        surface.setSize(resolutionWidth = int(displayWidth), resolutionHeight = int(displayHeight));
    } else {
        surface.setSize(resolutionWidth = virtualResolutionWidth, resolutionHeight = virtualResolutionHeight);
    }
    int x = (displayWidth/2) - (virtualResolutionWidth/2);
    int y = (displayHeight/2) - (virtualResolutionHeight/2);
    if (!fullscreen_) {
        surface.setLocation(x-3, y);
    }
}
//------------------------------------------------------------
void setFps(int fps_){
    fps = fps_;
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
//------------------------------------------------------------
// lista de constantes para las teclas..
// -------------------------------------
final int _BACKSPACE  = 8;
final int _UP =     38;
final int _DOWN =   40;
final int _LEFT =   37;
final int _RIGHT =  39;
final int _SPACE =  32;
final int _ESC =    27;
final int _ENTER =  10;
final int _F1 =     112;
final int _F2 =     113;
final int _F3 =     114;
final int _F4 =     115;
final int _F5 =     116;
final int _F6 =     117;
final int _F7 =     118;
final int _F8 =     119;
final int _F9 =     120;
final int _F10 =    121;
final int _PRINT =  154;
final int _BLOQ =   145;
final int _PAUSE =  19;
final int _PLUS  =  139;
final int _MINUS =  140;
final int _DEL   =  147;
final int _A =      65;
final int _B =      66;
final int _C =      67;
final int _D =      68;
final int _E =      69;
final int _F =      70;
final int _G =      71;
final int _H =      72;
final int _I =      73;
final int _J =      74;
final int _K =      75;
final int _L =      76;
final int _M =      77;
final int _N =      78;
final int _O =      79;
final int _P =      80;
final int _Q =      81;
final int _R =      82;
final int _S =      83;
final int _T =      84;
final int _U =      85;
final int _V =      86;
final int _W =      87;
final int _X =      88;
final int _Y =      89;
final int _Z =      90;
final int _a =      65 + 32;
final int _b =      66 + 32;
final int _c =      67 + 32;
final int _d =      68 + 32;
final int _e =      69 + 32;
final int _f =      70 + 32;
final int _g =      71 + 32;
final int _h =      72 + 32;
final int _i =      73 + 32;
final int _j =      74 + 32;
final int _k =      75 + 32;
final int _l =      76 + 32;
final int _m =      77 + 32;
final int _n =      78 + 32;
final int _o =      79 + 32;
final int _p =      80 + 32;
final int _q =      81 + 32;
final int _r =      82 + 32;
final int _s =      83 + 32;
final int _t =      84 + 32;
final int _u =      85 + 32;
final int _v =      86 + 32;
final int _w =      87 + 32;
final int _x =      88 + 32;
final int _y =      89 + 32;
final int _z =      90 + 32;
boolean[] keys = new boolean[256];
Keyboard keyboard = new Keyboard();
//.............................................................................................................................................................
void keyPressed() {
    if(keyCode != 17 && keyCode != 18){
        if( keyboard.active ){
            keyboard.core();
        }
    }
    //println(keyCode);
    keys[keyCode] = true;
    if (keyCode == 27) {
        key = 0;
        stop();
    }
}
//.............................................................................................................................................................
void keyReleased() {
    keys[keyCode] = false;
}
//.............................................................................................................................................................
final boolean key(int code) {
    return keys[code];
}
//------------------------------------------------------------
class Keyboard {
    String buffer = "";
    boolean active = false;
    //++++++++++++++++++++++++++++++++
    void core() {
        if (keyCode == BACKSPACE) {
            if (buffer.length() > 0) {
                buffer = buffer.substring(0, buffer.length()-1);
            }
        } else if (keyCode == DELETE) {
            buffer = "";
        } else if (keyCode == ENTER) {
            //active = false;
        } else if (keyCode != SHIFT) {
            buffer = buffer + key;
        }
    }
    //++++++++++++++++++++++++++++++++
    void clear(){
        buffer = "";
    }
    //++++++++++++++++++++++++++++++++
    void setActive( boolean active ){
        this.active = active;
    }
    //++++++++++++++++++++++++++++++++
}
//------------------------------------------------------------
void stop() {
    exit();
}
//------------------------------------------------------------
private void prepareExitHandler () {
Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
public void run () {
    System.out.println("SHUTDOWN HOOK");
    // application exit code here
    method("onExit");
}

}));

}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
void _fade_instantaneo_() {
    if (fadingType == -1) {
        deltaFading = 0;
        alphaFading = 255;
        fading = false;
    } else if (fadingType == 1) {
        deltaFading = 0;
        alphaFading = 0.0f;
        fading = false;
    }
}
//------------------------------------------------------------
void fadeOff(int time_) {
    fading = true;
    fadingType = 1;
    int fadingFramesLeft = (int)(time_ * fps) / 1000;          // frames para hacer el fading..
    deltaFading = (255.0 / fadingFramesLeft);                  // incremento del alpha por frame..
    if(time_ == 0){
        _fade_instantaneo_();
    }
}
//------------------------------------------------------------
void fadeOn(int time_) {
    fading = true;
    fadingType = -1;
    int fadingFramesLeft = (int)(time_ * fps) / 1000;          // frames para hacer el fading..
    deltaFading = (255.0 / fadingFramesLeft);                  // incremento del alpha por frame..
    if(time_ == 0){
        _fade_instantaneo_();
    }
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
boolean collisionMouse(sprite id) {    
    if(id.b==null){
        return false;
    }
    if(world.getBody(mouse.x,mouse.y) == id.b){
        return true;
    }else{
        return false;
    }
}
//------------------------------------------------------------
class Mouse {
    boolean left = false;
    boolean right = false;
    boolean touch = false;
    float x;
    float y;
    float oldX;
    float oldY;
    boolean wheelUp = false;
    boolean wheelDown = false;
    int wheel = 0;
    boolean dragged = false;
    boolean onRegion(region r){
        return(x>r.x && x<r.w && y>r.y && y<r.h);
    }
}
//------------------------------------------------------------
// modulo para el control del mouse..
void mousePressed() {
    if (mouseButton == LEFT) {
        mouse.left = true;
        mouse.touch = true;
    }
    if (mouseButton == RIGHT) {
        mouse.right = true;
        mouse.touch = true;
    }
}

void mouseReleased() {
    mouse.touch = false;
    if (mouseButton == LEFT) {
        mouse.left = false;
    }
    if (mouseButton == RIGHT) {
        mouse.right = false;
    }
    mouse.dragged = false;
}

void mouseDragged(){
    mouse.dragged = true;
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
void letMeAlone() {
    for (sprite s : sprites) {
        if(!s.killProtection){
            if(s != _id_ ){
                s.live = false;
                //println(s, "marcado para morir!");
            }
        }
    }
    ArrayList<FBody>bodies = world.getBodies();
    for(FBody bb : bodies){
        if(_id_!=null){
            if(_id_.b!=null){
                if(bb!=_id_.b){
                    world.remove(bb);
                }
            }
        }
    }
}
//------------------------------------------------------------
final int s_kill = -1;
final int s_protected = -2;
final int s_unprotected = -3;
void signal( sprite id_, int signalType_ ) {
    if(id_==null){
        return;
    }
    switch(signalType_) {
    case s_kill:
        if(!id_.killProtection){
            id_.live = false;
        }
        break;
        case s_protected:
        id_.killProtection = true;
        break;
    case s_unprotected:
        id_.killProtection = false;
        break;
    }
}
//------------------------------------------------------------
void signal( int type, int signalType_ ){
    for( sprite s : sprites ){
        if( s.type == type ){
            signal( s, signalType_ );
        }
    }
}
//------------------------------------------------------------
void signal( String type, int signalType_ ){
    for( sprite s : sprites ){
        if( s.className == type ){
            signal( s, signalType_ );
        }
    }
}
//------------------------------------------------------------
final boolean exists(sprite id_) {
    if (id_ != null) {
        return id_.live;
    }
    return false;
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
import ddf.minim.*;
import ddf.minim.analysis.*;
import ddf.minim.effects.*;
import ddf.minim.signals.*;
import ddf.minim.spi.*;
import ddf.minim.ugens.*;
Minim minim = new Minim(this);
//------------------------------------------------------------
AudioPlayer[] loadSounds(String nameFolder) {
    java.io.File folder = new java.io.File(dataPath("")+"/"+nameFolder);
    String[] filenames = folder.list();
    //println(filenames.length);
    //println(dataPath("")+"/"+nameFolder);
    AudioPlayer[] snd = new AudioPlayer[filenames.length];
    for (int i = 0; i < filenames.length; i++) {
        //println("Loading: "+filenames[i]);
        snd[i] = minim.loadFile(dataPath("") + "/" + nameFolder + "/" + filenames[i]);
    }
    return snd;
}
//------------------------------------------------------------
AudioPlayer loadSound(String file_) {
    return minim.loadFile(file_);
}
//------------------------------------------------------------
void soundPlay( AudioPlayer a ) {
    //a.rewind();
    a.cue(0);
    a.loop(0);
    a.play();
}
//------------------------------------------------------------
void soundPlay(AudioPlayer a, boolean repeat){
    a.cue(0);
    a.play();
    if(repeat){
        a.loop(-1);
    }
}
//------------------------------------------------------------
void soundPlay(AudioPlayer a, int repeatCycles){
    a.cue(0);
    a.play();
    a.loop(repeatCycles);
}
//------------------------------------------------------------
void soundStop( AudioPlayer a ){ // bugfix
    try{
        a.pause();
    } catch( Exception e ){
        
    }
}
//------------------------------------------------------------
void soundFade( AudioPlayer a, int millis, int level ){
    float currentVolume = a.getGain();
    a.shiftGain(currentVolume, map( level, 0, 255, -80, 13 ), millis);
}
//------------------------------------------------------------
// new..
void soundSetVolume( AudioPlayer a, int level ){
    float currentVolume = a.getGain();
    a.setGain( map( level, 0, 255, -80, 13 ) );
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
class scroll {
    int st = 0;
    PImage gr;
    PShape s = null;
    float size = 100;
    float sizeX = 100;
    float sizeY = 100;
    float x = 0;
    float y = 0;
    float angle = 0;
    PVector offset = new PVector(0, 0);
    PVector tiling = new PVector(1, 1);
    boolean xmirror = false;
    boolean ymirror = false;
    float alpha = 255;
    //......................................
    scroll(PImage gr) {
        this.gr = gr;
    }
    //......................................
    void render() {

        // configure transformation matrix..
        blitter.pushMatrix();
        blitter.shapeMode(CENTER);
        blitter.textureWrap(REPEAT);

        // create a pshape..
        s = createShape();
        s.setTexture(gr);
        s.disableStyle();
        s.beginShape();
        s.vertex(0, 0,                     offset.x*tiling.x, offset.y*tiling.y);
        s.vertex(gr.width, 0,              (gr.width+offset.x)*tiling.x, 0+(offset.y)*tiling.y);
        s.vertex(gr.width, gr.height,      (gr.width+offset.x)*tiling.x, (gr.height+offset.y)*tiling.y);
        s.vertex(0, gr.height,             offset.x*tiling.x, (gr.height+offset.y)*tiling.y);
        s.endShape(CLOSE);

        // apply pshape fx translate, rotate and scale..
        blitter.translate(x, y);
        blitter.rotate(radians(-angle));
        if(size==100){
            blitter.scale( xmirror ? -sizeX/100.0 : sizeX/100.0, ymirror ? -sizeY/100.0 : sizeY/100.0);
        }else{
            blitter.scale( xmirror ? -size/100.0 : size/100.0, ymirror ? -size/100.0 : size/100.0);
        }
        blitter.tint(255, alpha);
        blitter.shape(s);
        blitter.popMatrix();
    }
    //......................................
    //......................................
    //......................................
}
//------------------------------------------------------------
//------------------------------------------------------------
PImage newGraph(int w, int h, color col) {
    PImage gr = createImage(w, h, ARGB);
    gr.loadPixels();
    for (int i = 0; i < gr.pixels.length; i++) {
        gr.pixels[i] = col;
    }
    gr.updatePixels();
    return gr;
}
//......................................
PImage newGraph(float w, float h, color col) {
    PImage gr = createImage((int)w, (int)h, ARGB);
    gr.loadPixels();
    for (int i = 0; i < gr.pixels.length; i++) {
        gr.pixels[i] = col;
    }
    gr.updatePixels();
    return gr;
}
//------------------------------------------------------------
// cambiar todos los pixels que contengan un color por otro en toda una imagen..
final void mapSetColor(PImage gr, color actual, color nuevo) {
    gr.loadPixels();
    for (int i = 0; i < gr.pixels.length; i++) {
        if (gr.pixels[i] == actual) {
            gr.pixels[i] = nuevo;
        }
    }
    gr.updatePixels();
}
//------------------------------------------------------------
// inyectar un grafico en otro CONTEMPLANDO alpha_channel..
final void putGraphic(PImage dst, int dst_offset_x, int dst_offset_y, PImage src) {
    dst.blend(src, 0, 0, src.width, src.height, dst_offset_x, dst_offset_y, src.width, src.height, BLEND);
}
//------------------------------------------------------------
//------------------------------------------------------------
// limpiar un grafico indicando un color..
void clearGraphic(PImage gr, color c) {
    gr.loadPixels();
    for (int i = 0; i < gr.pixels.length; i++) {
        gr.pixels[i] = c;
    }
    gr.updatePixels();
}
//------------------------------------------------------------
// limpiar un buffer offscreen indicando un color..
void clearGraphic(PGraphics gr, color c) {
    gr.beginDraw();
    gr.loadPixels();
    for (int i = 0; i < gr.pixels.length; i++) {
        gr.pixels[i] = c;
    }
    gr.updatePixels();
    gr.endDraw();
}
//------------------------------------------------------------
//************************************************************
//------------------------------------------------------------
//------------------------------------------------------------
class scene extends sprite{
    int st = 0;
    PImage texture;
    float w, h;
    region r;
    float xInicial;                // cord. x to paint scene image..
    float yInicial;                // cord. y yo paint scene image..
    float limiteX;
    float limiteY;
    sprite camera;
    float cameraLimit =  50;
    float cameraLimitx = 50;
    float cameraLimity = 50;
    //.....................
    float CSX, CSY;                // camera screen x, camera screen y..
    float LSX0, LSX1;              // limit screen left, limit screen right..
    float LSY0, LSY1;              // limit screen up, limit screen down..
    //.....................
    float scale;
    //++++++++++++++++++++++++++++++++
    public scene( PImage texture, float x, float y, float w, float h ){
        this.texture = texture;
        this.xInicial = x;
        this.yInicial = y;
        this.x = 0;
        this.y = 0;
        if(w>texture.width){
            w = texture.width;
        }
        if(h>texture.height){
            h = texture.height;
        }
        this.w = w;
        this.h = h;
        this.r = new region(x, y, w, h);
        limiteX = texture.width  - w;
        limiteY = texture.height - h;
    }
    //++++++++++++++++++++++++++++++++
    void draw(){
        blitter.pushMatrix();
        blitter.scale(1, 1);
        blitter.rotate(0);
        blitter.tint(255, alpha);
        blitter.imageMode(CORNER);
        blitter.clip(r.x,r.y,r.w,r.h);
        blitter.image(texture, xInicial-x, yInicial-y);
        blitter.noClip();
        blitter.popMatrix();
        frame();
    }
    //++++++++++++++++++++++++++++++++
    void frame(){
        switch(st){
            //++++++++++++++++++++++++++++++++
            case 0:
                
                st = 10;
                break;
            //++++++++++++++++++++++++++++++++
            case 10:
                // control de movimiento por camara..
                if(camera != null){
                    CSX = camera.SX;
                    CSY = camera.SY;
                    LSX0 = xInicial + cameraLimitx;
                    LSX1 = xInicial + r.w - cameraLimitx;
                    LSY0 = yInicial + cameraLimity;
                    LSY1 = yInicial + r.h - cameraLimity;
                    // camera screen x exceds scene limit left..
                    if( CSX < LSX0 ){
                        x-=abs(camera.x-camera.oldX);
                    }
                    // camera screen x exceds scene limit right..
                    if( CSX > LSX1 ){
                        x+=abs(camera.x-camera.oldX);
                    }
                    // camera screen y exceds scene limit down..
                    if( CSY > LSY1 ){
                        y+=abs(camera.y-camera.oldY);
                    }
                    // camera screen y exceds scene limit up..
                    if( CSY < LSY0 ){
                        y-=abs(camera.y-camera.oldY);;
                    }
                }
                
                // scene limits control..
                if (x < 0) {
                    x = 0;
                }
                if (x > limiteX) {
                    x = limiteX;
                }
                if (y < 0) {
                    y = 0;
                }
                if (y > limiteY) {
                    y = limiteY;
                }
                break;
            //++++++++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++
        }
    }
    //++++++++++++++++++++++++++++++++
    void setPosition(float x, float y){
        this.xInicial = x;
        this.yInicial = y;
        this.x = 0;
        this.y = 0;
        this.r = new region(x, y, w, h);
        limiteX = texture.width  - w;
        limiteY = texture.height - h;
    }
    //++++++++++++++++++++++++++++++++
    void setCamera(sprite cam_){
        this.camera = cam_;
    }
    //++++++++++++++++++++++++++++++++
    void setCameraLimit( int cameraLimit_ ){
        this.cameraLimitx = this.cameraLimity = cameraLimit_;
    }
    //++++++++++++++++++++++++++++++++
    void setCameraLimit( int cameraLimitx, int cameraLimity ){
        this.cameraLimitx = cameraLimitx;
        this.cameraLimity = cameraLimity;
    }
    //++++++++++++++++++++++++++++++++
}
//------------------------------------------------------------
/*
void toggleBit( int myByte, int bit ){
    myByte ^= 1 << bit;
}
//------------------------------------------------------------
void setBit( int myByte, int bit, boolean st ){
    if(st){
        myByte |= 1 << bit;
    } else {
        myByte &= ~(1 << bit);
    }
}
*/
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
void mouseWheel(MouseEvent event) {
    mouse.wheel = int(event.getCount());
}
//------------------------------------------------------------
boolean onRegion(int x, int y, region r) {
        return(x>r.x && x<r.w && y>r.y && y<r.h);
}
//------------------------------------------------------------
boolean onRegion(float x, float y, region r) {
        return(x>r.x && x<r.w && y>r.y && y<r.h);
}
//------------------------------------------------------------
class tween extends sprite{
    int st      = 0;
    float delta = 0;
    float size  = 0;
    float steep = 0;
    float fps_;
    float rango;
    float value;
    float min;
    float max;
    int mode;
    float time;
    tween(float min, float max, int mode, float time){
        this.min = min;
        this.max = max;
        this.mode = mode;
        this.time = time/1000.0;
        frame();
    }
    void frame(){
        switch(st){
            case 0:
                fps_ = fps;
                steep = (2.0 * PI) /(time * fps);
                rango = max - min;
                st = 10;
                break;
            case 10:
                delta += steep;
                switch(mode){
                    case 0:
                        size = cos(delta);
                        break;
                    case 1:
                        size = sin(delta);
                        break;
                    case 2:
                        size = cos(delta) * sin(delta);
                        break;
                    case 3:
                        size = sin(delta) * sin(delta * 1.5 );
                        break;
                    case 4:
                        size = sin(tan( cos(delta) * 1.2 ));
                        break;
                    case 5:
                        size = sin(tan(delta) * 0.05);
                        break;
                    case 6:
                        size = cos(sin(delta * 3)) * sin(delta * 0.2);
                        break;
                    case 7:
                        size = sin(pow(8.0, sin(delta)));
                        break;
                    case 8:
                        size = sin(exp(cos(delta * 0.8)) * 2.0);
                        break;
                    case 9:
                        size = sin(delta - PI * tan(delta) * 0.01);
                        break;
                    case 10:
                        size = pow(sin(delta * PI), 12.0);
                        break;
                    case 11:
                        size = cos(sin(delta) * tan(delta * PI) * PI / 8.0);
                        break;
                    case 12:
                        size = sin(tan(delta) * pow(sin(delta), 10.0));
                        break;
                    case 13:
                        size = cos(sin(delta * 3.0) + delta * 3.0);
                        break;
                    case 14:
                        size = pow(abs(sin(delta * 2.0)) * 0.6, sin(delta * 2.0)) * 0.6;
                    break;
                }
                if( delta > (2.0 * PI) ){
                    signal(this, s_kill);
                }
                value = min + (rango* size);
        }
    }
}
//------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
// rutina para seguir caminos prefabricados, gracias hokuto por la idea!
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
final int FORWARD = 1;
final int REVERSE = 2;
final int FORWARD_LOOP = 3;
final int REVERSE_LOOP = 4;
class path{
    ArrayList<PVector>points;            // vector list of path..
    float lastDist = 999999999;          // last distanci to next vector..
    float vel = 3;                       // velocity of movemento..
    int pos = 0;                         // actual point of path..
    int fst = 0;                         // machine state of forward mode..
    int flst = 0;                        // machine state of forward loop mode..
    int rst = 0;                         // machine state of reverse mode..
    int rlst = 0;                        // machine state of reverse loop mode..
    //----------------------------------------------
    path(){
        points = new ArrayList<PVector>();
    }
    //----------------------------------------------
    void add(float x, float y){
        PVector vec = new PVector(x, y);
        points.add(vec);
    }
    //----------------------------------------------
    int length(){
        return points.size();
    }
    //----------------------------------------------
    void setPoint(int num){
        pos = num;
    }
    //----------------------------------------------
    void setVelocity(float vel){
        this.vel = vel;
    }
    //----------------------------------------------
    void move(int type_){
        switch(type_){
            case FORWARD:
                switch(this.fst){
                    case 0:
                        float angle = degrees(atan2(_id_.y - points.get(pos).y, _id_.x - points.get(pos).x )); 
                        _id_.advance(-vel, 360-angle);
                        float d = dist(_id_.x, _id_.y, points.get(pos).x, points.get(pos).y);
                        if(d <= lastDist){
                            lastDist = d;
                        } else{
                            if(_id_.b!=null){
                                _id_.setPosition(points.get(pos).x, points.get(pos).y);
                            } else{
                                _id_.x = points.get(pos).x;
                                _id_.y = points.get(pos).y;
                            }
                            lastDist = 999999999;
                            fst = 10;
                        }
                        //return false;
                        break;
                    case 10:
                        if(pos+1 < points.size()){
                            pos++;
                            fst = 0;
                            //return false;
                        } else{
                            //return true;
                        }
                        break;
                }
                break;
            
            case FORWARD_LOOP:
                switch(this.flst){
                    case 0:
                        float angle = degrees(atan2(_id_.y - points.get(pos).y, _id_.x - points.get(pos).x ));
                        _id_.advance(-vel, 360-angle);
                        float d = dist(_id_.x, _id_.y, points.get(pos).x, points.get(pos).y);
                        if(d <= lastDist){
                            lastDist = d;
                        } else{
                            if(_id_.b!=null){
                                _id_.setPosition(points.get(pos).x, points.get(pos).y);
                            } else{
                                _id_.x = points.get(pos).x;
                                _id_.y = points.get(pos).y;
                            }
                            lastDist = 999999999;
                            flst = 10;
                        }
                        //return this.pos;
                        break;
                    case 10:
                        if(pos+1 < points.size()){
                            pos++;
                            flst = 0;
                        } else{
                            pos = 0;
                            flst = 0;
                        }
                        //return this.pos;
                        break;
                }
                break;
            
            case REVERSE:
                switch(this.rst){
                    case 0:
                        float angle = degrees(atan2(_id_.y - points.get(pos).y, _id_.x - points.get(pos).x ));
                        _id_.advance(-vel, 360-angle);
                        float d = dist(_id_.x, _id_.y, points.get(pos).x, points.get(pos).y);
                        if(d <= lastDist){
                            lastDist = d;
                        } else{
                            if(_id_.b!=null){
                                _id_.setPosition(points.get(pos).x, points.get(pos).y);
                            } else{
                                _id_.x = points.get(pos).x;
                                _id_.y = points.get(pos).y;
                            }
                            lastDist = 999999999;
                            rst = 10;
                        }
                        //return false;
                        break;
                    case 10:
                        if(pos > 0){
                            pos--;
                            rst = 0;
                            //return false;
                        } else{
                            //return true;
                        }
                        break;
                }
                break;
            
            case REVERSE_LOOP:
                switch(this.rlst){
                    case 0:
                        float angle = degrees(atan2(_id_.y - points.get(pos).y, _id_.x - points.get(pos).x ));
                        _id_.advance(-vel, 360-angle);
                        float d = dist(_id_.x, _id_.y, points.get(pos).x, points.get(pos).y);
                        if(d <= lastDist){
                            lastDist = d;
                        } else{
                            if(_id_.b!=null){
                                _id_.setPosition(points.get(pos).x, points.get(pos).y);
                            } else{
                                _id_.x = points.get(pos).x;
                                _id_.y = points.get(pos).y;
                            }
                            lastDist = 999999999;
                            rlst = 10;
                        }
                        //return this.pos;
                        break;
                    case 10:
                        if(pos > 0){
                            pos --;
                            rlst = 0;
                        } else{
                            pos = points.size()-1;
                            rlst = 0;
                        }
                        //return this.pos;
                        break;
                }
                break;
            
        }
    }
    //----------------------------------------------
    PVector getPoint(int pos){
        return points.get(pos);
    }
    //----------------------------------------------
}
//------------------------------------------------------------
//------------------------------------------------------------
void loadScene(String filename){
    String[] lines = loadStrings(filename);
    //println("there are " + lines.length + " lines");
    
    // PREPARAR VARIABLES..
    FPoly p = null;
    boolean polygon = false;
    boolean object  = false;
    
    for (int i = 0 ; i < lines.length; i++) {
        
        String[] params = split(lines[i], "#@#");
        //println(params);
        
        // PARSEAR ARCHIVO LINEA A LINEA..
        switch(params[0]){
            
            case "#POLY_START":
                p = new FPoly();
                polygon = true;
                break;
            
            case "#POLY_NAME":
                if(!params[1].equals("")){
                    p.setName(params[1]);
                }
                break;
            
            case "#POLY_META":
                
                break;
                
            case "#SENSOR":
                if(polygon){
                    if(params[1].equals("TRUE")){
                        p.setSensor(true);
                    }else{
                        p.setSensor(false);
                    }
                }
                break;
                
            case "#VERTEX":
                if(polygon){
                    p.vertex(int(params[1]), int(params[2]));
                }
                break;
            
            case "#POLY_END":
                if(p!=null){
                    p.setStaticBody(true);
                    world.add(p);
                }
                polygon = false;
                //println("added polygon to world!");
                break;
            
        }
        
    }
}
//------------------------------------------------------------
PShape[] loadModels(String nameFolder) {
    java.io.File folder = new java.io.File(dataPath("")+"/"+nameFolder);
    String[] filenames = folder.list();

    // RECOUNT .OBJ FILES..
    PShape[] sha = null;
    int numShapes = 0;
    for (String s : filenames) {
        String[] params = split(s, '.');
        String ext = params[params.length-1].toLowerCase();
        if (ext.equals("obj")) {
            numShapes++;
        }
    }

    // CREATE ARRAY OF PSHAPES..
    try {
        sha = new PShape[numShapes];
    } 
    catch(Exception e) {
        println("ERROR: loadImages(" + nameFolder + "); check folder name ?");
        return null;
    }

    // SCAN FOLDERLIST AND LOAD .OBJ FILES..
    int index = 0;
    for (String s : filenames) {
        String[] params = split(s, '.');
        String ext = params[params.length-1].toLowerCase();
        if (ext.equals("obj")) {
            //println("Loaded: ", s);
            sha[index] = loadShape(dataPath("") + "/" + nameFolder + "/" + s);
            index++;
        }
    }

    return sha;
}
//------------------------------------------------------------
void screenDrawShape(PShape s, float x, float y, float z, float size, float ax, float ay, float az) {
    blitter.pushMatrix();
    blitter.translate(x, y, z);
    blitter.scale(size);
    blitter.rotate(radians(az));
    blitter.rotateY(radians(ay));
    blitter.rotateX(radians(ax));
    blitter.shapeMode(CORNERS);
    blitter.shape(s);
    blitter.shapeMode(CENTER);
    blitter.popMatrix();
}
//------------------------------------------------------------
class soundPlayTimed extends sprite{
    int startTime;
    int millis = 0;
    AudioPlayer snd;
    public soundPlayTimed(AudioPlayer snd, int millis){
        startTime = millis();
        this.millis = millis;
        this.snd = snd;
    }
    void frame(){
        if(millis()-startTime > millis){
            soundPlay(snd);
            signal(this, s_kill);
        }
    }
}
//------------------------------------------------------------
