/*
 * Copyright (c) 2020 gameLibZero.js 
 * Author:  Luis lopez martinez.
 * contact: luislopezmartinez1979@gmail.com
 * youtube: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
 * 
 * MIT License
 * 
 * Copyright (c) 2020 LuislopezMartinez
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * 
 */
const s_kill        = 77;
const s_protected   = 777;
const s_unprotected = 7777;

const LEFT          = 15;
const RIGHT         = 16;
const CENTER        = 17;

// tipos de cuerpos para la simulación física..
const TYPE_BOX    = -1;
const TYPE_CIRCLE = -2;
const TYPE_SENSOR = -3;
// materiales disponibles para la simulación física..
const WOOD    = 1;
const METAL   = 2;
const STONE   = 3;
const PLASTIC = 4;
const RUBBER  = 5;
const HUMAN   = 6;

// module aliases..
var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Events = Matter.Events;
// create an engine..
var engine = Engine.create();
var world = engine.world;
var glz_collisions = [];
world.gravity.y = 0;
world.gravity.x = 0;
//engine.enableSleeping = true;     // default false.
//engine.positionIterations = 10;   // default 6.
//engine.velocityIterations = 1;    // default 4.

//---------------------------------------------------------------------------------

Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;
    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];
        if (pair.bodyA == mouse.body) {
            pair.bodyB.render.visible = false;
        } else if (pair.bodyB == mouse.body) {
            pair.bodyA.render.visible = false;
        }
        
        
        
    }
});


Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    for (var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];
        if (pair.bodyA == mouse.body) {
            pair.bodyB.render.visible = true;
        } else if (pair.bodyB == mouse.body) {
            pair.bodyA.render.visible = true;
        }
    }
});


Events.on(engine, 'collisionActive', function(event) {
    
    var pairs = event.pairs;
    for(var i = 0, j = pairs.length; i != j; ++i) {
        var pair = pairs[i];
        glz_collisions.push(pair);
        if (pair.bodyA === mouse.body) {
            pair.bodyB.render.visible = true;
        } else if (pair.bodyB === mouse.body) {
            pair.bodyA.render.visible = true;
        }
    }
});


Events.on(world, 'afterAdd', function(event) {
event.object.render.visible = false;            // al añadir un cuerpo al mundo le pongo la colision con el mouse en false..
});

//---------------------------------------------------------------------------------



var app;
var frameCount = 0;
var backgroundColor = 0xAAAAAA;
var _glz_fullscreen = false;
var width = 320;
var height = 200;

var gameObjects = [];
var _id_;                               // pointer to actual gameObject executing frame..
var unique_process_id_ = 0;

var _glz_render_filter_ = true;         // bilinear filter activated/deactivated..

var mouse;

var ctx;
var fading = false;
var alphaFading = 0;
var deltaFading = 0;
var fadingColor = 0xffffff;
var fadingType  = 0;
var fadeRect;
const fadingRect_z = 100000;

var fps = 0;            // indica los frames reales por segundo..
var fps_counter = 0;    // contador de frames mientras no pasen 1000 milisegundos..
var fps_flag = false;   // se pone a true cuando pasan 1000 milisegundos..
var fps_time_start = 0; // marca el tiempo al inicio de la cuenta de frames..
var fps_time_now = 0;   // marca el tiempo actual..

window.onload = function(){
    window.addEventListener("resize", resizeGame);
    this.setup();
    window.onbeforeunload = null;
    resizeGame();
    Waud.init();
    Waud.autoMute();
    initTouch();
    mouse = new Mouse();
    //var canvas2d = document.getElementById("myCanvas");
    //ctx = canvas2d.getContext("2d");

    fadeRect = PIXI.Sprite.from(PIXI.Texture.WHITE);
    fadeRect.width = width;
    fadeRect.height = height;
    fadeRect.tint = fadingColor;
    fadeRect.alpha = 0;
    fadeRect.zIndex = fadingRect_z;        // cuanto mas alto mas delante se pintara..
    app.stage.addChild(fadeRect);


}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function sin(num){
    return Math.sin(num);
}
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function random(min, max){
    if(arguments.length == 1) {
        return Math.random()*min;
    }else if(arguments.length == 2){
        return (Math.random()*(max-min))+min;
    }
}
//----------------------------------------------------------------------------------
// Convert from degrees to radians.
function radians (degrees) {
	return degrees * Math.PI / 180;
}
//----------------------------------------------------------------------------------
// Convert from radians to degrees.
function degrees (radians) {
	return radians * 180 / Math.PI;
}
//----------------------------------------------------------------------------------
// ported from processing/java..
function method (codeToExecute, gameObjectCaller){
    window[codeToExecute](gameObjectCaller);
}
//----------------------------------------------------------------------------------
function str(number){
    return number.toString();
}
//----------------------------------------------------------------------------------
function int(floatvalue){
    return Math.floor( floatvalue );
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
function resizeGame(){
    var canvas = document.getElementById("myCanvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    app.renderer.view.style.width = canvas.width + 'px';
    app.renderer.view.style.height = canvas.height + 'px';
}
//----------------------------------------------------------------------------------
function requestFullScreen() {
    if(_glz_fullscreen){
        var el = document.body;

        // Supports most browsers and their versions.
        var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;

        if (requestMethod) {

            // Native full screen.
            requestMethod.call(el);

        } else if (typeof window.ActiveXObject !== "undefined") {

            // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");

            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }

        

    }
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
function setMode(width_, height_, fullscreen_, bilinear_filter_){
    app = new PIXI.Application(
        {
            width: width_,
            height: height_,
            backgroundColor: backgroundColor
        }
    );
    _glz_fullscreen = fullscreen_;
    width = width_;
    height = height_;
    _glz_render_filter_ = bilinear_filter_;
    if(_glz_render_filter_===false){
        PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    }
    this.document.body.appendChild(app.view);
    app.stage.sortableChildren = true;
    app.ticker.add(glz_main_core);
}
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
function exists(proc){
    if(proc===undefined){
        return false;
    }
    if(proc.live){
        return true;
    }else{
        return false;
    }
}
//----------------------------------------------------------------------------------
function signal (id, sig){
    switch(sig){
        case s_kill:
            id.live = false;
            break;
        case s_protected:
            id.killProtection = true;
            break;
        case s_unprotected:
            id.killProtection = false;
            break;
    }
}
//----------------------------------------------------------------------------------
function letMeAlone() {
    for (var i=0; i<gameObjects.length; i++) {
        if(!gameObjects[i].killProtection){
            if(gameObjects[i] != _id_ ){
                gameObjects[i].live = false;
            }
        }
    }
}
//----------------------------------------------------------------------------------
function glz_main_core(){


    // MAIN LOOP..
    _id_ = undefined;
    if(frameCount>1){
        main();
    }


    // SORT gameObject SET..
    gameObjects.sort(function (a, b) {
        return a.priority - b.priority;
    });
    
    
    // EXECUTE SPRITE BATCH OPERATIONS FOR PURGE OBJECTS..
    for(var i=0; i<gameObjects.length; i++){
        if (gameObjects[i].statusKill) {
            gameObjects[i].finalize();
            if(gameObjects[i].graph!=undefined){
                app.stage.removeChild(gameObjects[i].graph);
            }
            if(gameObjects[i].body_created){
                World.remove(world, gameObjects[i].body);
            }
            gameObjects.splice(i, 1);        // elimino el proceso de la lista..
        }else if (!gameObjects[i].live) {
            gameObjects[i].statusKill = true;
        }
    }

    // SCAN GAMEPADS..
    scangamepads();

    for(var i=0; i<gameObjects.length; i++){
                
        _id_ = gameObjects[i];
        
        if(_id_.livedFrames==0){
            _id_.initialize();
        }
        _id_.livedFrames++;
        
        if(_id_.live){
            // DRAW SPRITE GRAPH..
            gameObjects[i].draw();
            // EXECUTE SPRITE CODE..
            gameObjects[i].frame();
        }
        
    }

    
    glz_collisions.splice(0,glz_collisions.length);
    Engine.update(engine); 
    

    if (fading) {
        if (fadingType == -1) {
            if (alphaFading > 0.0) {
                alphaFading -= deltaFading;
            } else {
                deltaFading = 1.0;
                alphaFading = 0.0;
                fading = false;
            }
        } else if (fadingType == 1) {
            if (alphaFading < 1.0) {
                alphaFading += deltaFading;
            } else {
                deltaFading = 0;
                alphaFading = 1.0;
                fading = false;
            }
        }
    }

    if(alphaFading > 0){ 
        fadeRect.alpha = alphaFading;
    }

    frameCount++;




    if(fps_flag){
        fps_counter++;
        fps_time_now = Date.now();
        if((fps_time_now-fps_time_start)>1000){
            fps_flag = false;
        }
    }else{
        fps = fps_counter;
        fps_counter = 0;
        fps_time_start = Date.now();
        fps_flag = true;
    }

}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
class gameObject{
    constructor(){
        this.graph;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.oldx = 0;
        this.oldy = 0;
        this.cx = 0.5;
        this.cy = 0.5;
        this.angle = 0;
        this.size = 1;
        this.sizex = 1;
        this.sizey = 1;
        this.alpha = 1.0;
        this.live = true;
        this.statusKill = false;
        this.killProtection = false;
        this.livedFrames = 0;
        this.priority = 0;
        this.type = 0;
        unique_process_id_++;
        this.id = unique_process_id_;   // id del proceso.. int..
        this.touch_id;
        gameObjects.push(this);
        this.body = null;
        this.body_created = false;
        this.collisionTypeIds = []; // array de id de los sprites detectados por collisionType()
        this.id;
        this.father = _id_;
    }
    initialize(){

    }
    frame(){
        
    }
    draw(){
        this.oldx = this.x;
        this.oldy = this.y;
        if(this.body_created){
            this.x = this.body.position.x;
            this.y = this.body.position.y;            
            this.angle = degrees(this.body.angle);
        }
        if(this.graph!=undefined){
            this.graph.x = this.x;
            this.graph.y = this.y;
            this.graph.zIndex = this.z;
            this.graph.anchor.x = this.cx;
            this.graph.anchor.y = this.cy;
            this.graph.alpha = this.alpha;
            this.graph.rotation = -radians(this.angle);

            if(this.sizex===1 && this.sizey===1){
                this.graph.scale.x = this.size;
                this.graph.scale.y = this.size;
            }else{
                this.graph.scale.x = this.sizex;
                this.graph.scale.y = this.sizey;
            }

        }
    }
    finalize(){
        // for override on polimorphic classes..
    }
    setGraph(texture){
        if(_glz_render_filter_ === false ){
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
        if(this.graph!==undefined){
            app.stage.removeChild(this.graph);
        }
        this.graph = new PIXI.Sprite(texture);
        this.draw();
        app.stage.addChild(this.graph);
    }
    tint(color){
        //this.graph.tint = Math.random() * 0xFFFFFF;
        this.graph.tint = color;
    }
    //=======================================================
    touched(){
        var width  = this.graph.texture.baseTexture.width;
        var height = this.graph.texture.baseTexture.height;
        var xmin = this.x-(width/2)*this.size;
        var xmax = this.x+(width/2)*this.size;
        var ymin = this.y-(height/2)*this.size;
        var ymax = this.y+(height/2)*this.size;
        for (var i=0; i<mouse.points.length; i++) {
            if(mouse.points[i].active===true){
                var x = mouse.points[i].x;
                var y = mouse.points[i].y;
                if(x>xmin && x<xmax && y>ymin && y<ymax){
                    this.touch_id = i;
                    return true;
                }
            }
        }
        return false;
    }
    getTouch(){
        return {x: mouse.points[this.touch_id].x, y: mouse.points[this.touch_id].y};
    }
    touchPersists(){
        return mouse.points[this.touch_id].active;
    }
    //=======================================================
    advance(dist, angle){
        //dist = -dist;
        if(arguments.length == 1) {
            
            if(this.body_created){
                this.x = this.x + dist * Math.cos(radians(this.angle));
                this.y = this.y - dist * Math.sin(radians(this.angle));
                Matter.Body.setPosition(this.body, {x: this.x, y: this.y});
            }else{
                this.x = this.x + dist * Math.cos(radians(this.angle));
                this.y = this.y - dist * Math.sin(radians(this.angle));
            }
            
        }else if (arguments.length == 2) {
            if(this.body_created){
                this.x = this.x + dist * Math.cos(radians(angle));
                this.y = this.y - dist * Math.sin(radians(angle));
                Matter.Body.setPosition(this.body, {x: this.x, y: this.y});
            }else{
                this.x = this.x + dist * Math.cos(radians(angle));
                this.y = this.y - dist * Math.sin(radians(angle));
            }
        }
    }
    getDist(p1, p2){
        if(arguments.length == 1) {
            var dx = this.x - p1.x;
            var dy = this.y - p1.y;
            return Math.sqrt(dx*dx+dy*dy);
        }else if(arguments.length == 2){
            var dx = this.x - p1;
            var dy = this.y - p2;
            return Math.sqrt(dx*dx+dy*dy);
        }
    }
    getAngle(p1, p2){
        if(arguments.length == 1) {
            return -degrees(Math.atan2( p1.y-this.y, p1.x-this.x ));
        }else if(arguments.length == 2){
            return -degrees(Math.atan2( p2-this.y, p1-this.x ));
        }
    }
    //=======================================================
    createBody (TYPE_BODY, material){
        var w, h;
        this.body_created = true;
        switch(TYPE_BODY) {
            case TYPE_BOX:
                if(this.sizex!=1 || this.sizey!=1 ){
                    w = this.graph.texture.baseTexture.width*this.sizex;
                    h = this.graph.texture.baseTexture.height*this.sizey;
                } else{
                    w = this.graph.texture.baseTexture.width*this.size;
                    h = this.graph.texture.baseTexture.height*this.size;
                }
                this.body = Bodies.rectangle(this.x, this.y, w, h);
                Matter.Body.setAngle(this.body, radians(this.angle));
                World.add(engine.world, this.body);
                break;
            case TYPE_CIRCLE:
                w = this.graph.texture.baseTexture.width*this.size;
                h = this.graph.texture.baseTexture.height*this.size;
                this.body = Bodies.circle(this.x, this.y, w/2);
                Matter.Body.setAngle(this.body, radians(this.angle));
                World.add(world, this.body);
                break;
        }
        this.id = this.body.id;
        if(material!==undefined){
            this.setMaterial(material);
        }
    }
    //-------------------------------------------------------
    setMaterial(material){
        switch(material) {
            case WOOD:
                this.body.friction = 0.50;
                this.body.restitution = 0.17;
                this.body.density = 0.57;
                break;
            case METAL:
                this.body.friction = 0.13;
                this.body.restitution = 0.17;
                this.body.density = 7.80;
                break;
            case STONE:
                this.body.friction = 0.75;
                this.body.restitution = 0.05;
                this.body.density = 2.40;
                break;
            case PLASTIC:
                this.body.friction = 0.38;
                this.body.restitution = 0.09;
                this.body.density = 0.95;
                break;
            case RUBBER:
                this.body.friction = 0.75;
                this.body.restitution = 0.95;
                this.body.density = 1.70;
                break;
            case HUMAN:
                this.body.friction = 1.00;
                this.body.restitution = 0.00;
                this.body.density = 0.95;
                break;
            case TYPE_SENSOR:
                this.setSensor(true);
                break;
        }
    }
    //-------------------------------------------------------
    setStatic(static_){
        if(this.body_created){
            this.body.isStatic = static_;
        }
    }
    //-------------------------------------------------------
    setSensor(sensor){
        if(this.body_created){
            this.body.isSensor = sensor;
        }
    }
    //-------------------------------------------------------
    setDamping(damping){
        if(this.body_created){
            this.body.frictionAir = damping;
        }
    }
    //-------------------------------------------------------
    addVx(vx){
        if(this.body_created){
            Matter.Body.setVelocity(this.body, {x: this.body.velocity.x + vx, y: this.body.velocity.y});
        }
    }
    //-------------------------------------------------------
    addVy(vy){
        if(this.body_created){
            Matter.Body.setVelocity(this.body, {x: this.body.velocity.x, y: this.body.velocity.y + vy});
        }
    }
    //-------------------------------------------------------
    addVelocity(angle, vel){
        if(this.body_created){
            var vx = vel * cos((radians(angle)));
            var vy = -vel * sin((radians(angle)));
            Matter.Body.setVelocity(this.body, {x: this.body.velocity.x + vx, y: this.body.velocity.y + vy});
        }
    }
    //-------------------------------------------------------
    brakeVx(percent){
        if(this.body_created){
            Matter.Body.setVelocity(this.body, {x: this.body.velocity.x * percent, y: this.body.velocity.y});
        }
    }
    //-------------------------------------------------------
    brakeVy(percent){
        if(this.body_created){
            Matter.Body.setVelocity(this.body, {x: this.body.velocity.x, y: this.body.velocity.y * percent});
        }
    }
    //-------------------------------------------------------
    brakeVelocity(percent){
        if(this.body_created){
            Matter.Body.setVelocity(this.body, {x: this.body.velocity.x * percent, y: this.body.velocity.y * percent});
        }
    }
    //-------------------------------------------------------
    getVelocity(){
        if(this.body_created){
            return this.body.velocity;
        }
    }
    //-------------------------------------------------------
    getVx(){
        if(this.body_created){
            return this.body.velocity.x;
        }
    }
    //-------------------------------------------------------
    getVy(){
        if(this.body_created){
            return this.body.velocity.y;
        }
    }
    //-------------------------------------------------------
    setType = function (type){
        this.type = type;
        if(this.body_created){
            this.body.label = type;
        }
    }
    //-------------------------------------------------------
    getType(type){
        if(this.body_created){
            return this.body.label;
        }
    }
    //-------------------------------------------------------
    collisionMouse(){
        console.log("WARNING: .collisionMouse() are deprecated, please use .touched()");
        return this.touched();
    }
    //-------------------------------------------------------
    collision(other){
        if(!this.body_created){
            console.log("WARNING: gameObject without [local] body collider!");
            return false;
        }
        if(!exists(other)){
            console.log("WARNING: gameObject [remote] undefined.");
            return false;
        }
        if(!other.body_created){
            console.log("WARNING: gameObject without [remote] body collider!");
            return false;
        }
        for(var i=0; i<glz_collisions.length; i++){
            
            if( glz_collisions[i].bodyA.id == this.id){
                if( glz_collisions[i].bodyB.id == other.id ){
                   return true;
                }
            } else if(glz_collisions[i].bodyB.id == this.id){
                if( glz_collisions[i].bodyA.id == other.id ){
                   return true;
                }
            }
            
        }
        return false;
    }
    //-------------------------------------------------------
    collisionType(type){
        
        this.collisionTypeIds.splice(0, this.collisionTypeIds.length);
        
        for(var i=0; i<glz_collisions.length; i++){
            
            if( glz_collisions[i].bodyA.id == this.id){
                if(glz_collisions[i].bodyB.label == type){
                    this.collisionTypeIds.push(glz_collisions[i].bodyB.id);
                }
            } else if(glz_collisions[i].bodyB.id == this.id){
                if(glz_collisions[i].bodyA.label == type ){
                    this.collisionTypeIds.push(glz_collisions[i].bodyA.id);
                   }
            }
            
        }
        //console.log(this.collisionTypeIds);
        return this.collisionTypeIds.length;
    }
    //-------------------------------------------------------
    setRotation(angle){
        if(this.body_created){
            Matter.Body.setAngle(this.body, radians(angle));
        }else{
            this.angle = angle;
        }
    }
    setAngle(angle){
        this.setRotation(angle);
    }
    //-------------------------------------------------------
    rotate(ang){
        if(this.body_created){
            Matter.Body.setAngle(this.body, radians(this.angle+ang));
            this.angle += ang;
        }else{
            this.angle += ang;
        }
    }
    //-------------------------------------------------------
    translate(x, y){
        if(this.body_created){
            Matter.Body.setPosition(this.body, {x: x, y: y});
        }else{
            this.x = x;
            this.y = y;
        }
    }
    //-------------------------------------------------------
    isContact(angA, angB){
        var ang;
        
        for(var i=0; i<glz_collisions.length; i++){             // recorrer la lista de colisiones..
            
            if( glz_collisions[i].bodyA.id == this.id){         // buscar si alguna es mia..
                
                for(var j=0; j<glz_collisions[i].activeContacts.length; j++){
                    ang = this.getAngle(glz_collisions[i].activeContacts[j].vertex.x, glz_collisions[i].activeContacts[j].vertex.y);
                    //console.log(ang);
                    if ( ang > angA && ang < angB ) {
                        return true;
                    }
                }
                
            } else if(glz_collisions[i].bodyB.id == this.id){   // buscar si alguna es mia..
                
                for(var j=0; j<glz_collisions[i].activeContacts.length; j++){
                    ang = this.getAngle(glz_collisions[i].activeContacts[j].vertex.x, glz_collisions[i].activeContacts[j].vertex.y);
                    //console.log(ang);
                }
                if ( ang > angA && ang < angB ) {
                        return true;
                }
            }
            
            
                    
        }
        return false;
        
    }
    //-------------------------------------------------------
    //-------------------------------------------------------
    //-------------------------------------------------------
    //-------------------------------------------------------
    //-------------------------------------------------------
    //=======================================================
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
class loadImages extends gameObject{
    
    constructor(path_, numFiles){
        super();
        this.path = path_;
        this.numFiles = numFiles;
        this.st = 0;
        this.pos = 0;
        this.numfiles ;
        this.ext = ".png";
        this.name = "";
        this.nameCode = "";
        this.ready = false;
        this.loader;
        this.img = [];
    }
    initialize(){
        
    }
    frame(){
        switch(this.st){
            case 0:
                if(this.pos<=this.numFiles){
                    if(this.pos<10){
                        this.name = "0" + str(this.pos) + this.ext;
                        this.nameCode = "0" + str(this.pos);
                    }else{
                        this.name = str(this.pos) + this.ext;
                        this.nameCode = str(this.pos);
                    }
                    this.img[this.pos] = PIXI.Texture.from(this.path+this.name);
                    this.pos++;
                }else{
                    var completed = true;
                    for(let i=0; i<this.numFiles; i++){
                        if(this.img[i]===undefined){
                            completed = false;
                        }else{
                            
                        }
                    }

                    if(completed){
                        this.ready = true;
                        this.st = 100;
                    }
                }
            break;
            case 10:
                
            break;
            case 100:
                
            break;
        }
    }
    get(){
        return this.img;
    }
}
//----------------------------------------------------------------------------------
class loadSounds extends gameObject{
    constructor(path, num){
        super();
        this.st = 0;
        this.path = path;
        this.dat = [];
        this.numFiles = num;
        this.pos = 0;
        this.name = "";
        this.ext = ".mp3";
        this.ready = false;
        this.progress = 0.0;    // percent progress of load files..
        this.delta = 0;         // percent up per file..
    }
    initialize(){
        this.delta = 100/(this.numFiles);
    }
    frame(){
        switch(this.st){
            case 0:
                if(this.pos<=this.numFiles){
                    if(this.pos<10){
                        this.name = "0" + str(this.pos);
                    }else{
                        this.name = str(this.pos);
                    }
                    this.dat[this.pos] = new WaudSound(this.path+this.name+this.ext, { autoplay: false, loop: false, volume: 0.5 });
                    this.pos++;
                }else{
                    // check if load all files completed..
                    var completed = true;
                    let totalFiles = Number(this.numFiles);     // sin Number() no funciona el for.. puto JS..
                    for(var i=0; i<=totalFiles; i++){
                        
                        if(this.dat[i]!==undefined){
                            if(!this.dat[i].isReady()){
                                completed = false;
                            }
                        }else{
                            completed = false;
                        }

                    }
                    if(completed===true){
                        this.ready = true;
                        this.st = 10;
                        //console.log("Audio files loaded!");
                    }
                }
            break;
            case 10:

            break;
        }
    }
    get(){
        return this.dat;
    }
}
//----------------------------------------------------------------------------------
class soundPlayTimed extends gameObject{
    constructor(snd, millis){
        super();
        this.startTime = Date.now();
        this.millis = millis;
        this.snd = snd;
    }
    
    frame(){
        if(Date.now()-this.startTime>this.millis){
            this.snd.play();
            signal(this, s_kill);
        }
    }
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function initTouch(){
    var el = document.getElementById("myCanvas");
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchmove", handleMove, false);

    el.addEventListener("mousedown", handleMouseDown, false);
    el.addEventListener("mouseup", handleMouseUp, false);
    el.addEventListener("mousemove", handleMouseMove, false);
}
//----------------------------------------------------------------------------------
handleMouseDown = function(event){
    event.preventDefault();
    switch(event.which){
        case 1:
            mouse.left = true;
            mouse.setPoint(10, true, event.clientX, event.clientY);
            break;
        case 2:
           mouse.middle = true;
            mouse.setPoint(11, true, event.clientX, event.clientY);
            break;
        case 3:
            mouse.right = true;
            mouse.setPoint(12, true, event.clientX, event.clientY);
            break;
           
    }
    mouse.canvas_x = event.clientX;
    mouse.canvas_y = event.clientY;
}
//----------------------------------------------------------------------------------
handleMouseUp = function(event){
    event.preventDefault();
    switch(event.which){
        case 1:
            mouse.left = false;
            mouse.setPoint(10, false, event.clientX, event.clientY);
            break;
        case 2:
           mouse.middle = false;
            mouse.setPoint(11, false, event.clientX, event.clientY);
            break;
        case 3:
            mouse.right = false;
            mouse.setPoint(12, false, event.clientX, event.clientY);
            break;
           
    }
    mouse.canvas_x = event.clientX;
    mouse.canvas_y = event.clientY;
}
//----------------------------------------------------------------------------------
handleMouseMove = function(event){
    event.preventDefault();
    mouse.canvas_x = event.clientX;
    mouse.canvas_y = event.clientY;
    mouse.updateMousePointsPosition(event.clientX, event.clientY);
}
//----------------------------------------------------------------------------------
function handleStart(event) {
    //event.preventDefault();
    mouse.left = true;
    mouse.canvas_x = event.touches[0].clientX;
    mouse.canvas_y = event.touches[0].clientY;
    mouse.touches = event.touches;
    for(var i=0; i<event.changedTouches.length; i++){
        mouse.setPoint(event.changedTouches[i].identifier, true, event.changedTouches[i].clientX, event.changedTouches[i].clientY);
    }
}
//----------------------------------------------------------------------------------
function handleEnd(event) {
    //event.preventDefault();
    mouse.left = false;
    mouse.touches = event.touches;
    for(var i=0; i<event.changedTouches.length; i++){
        mouse.setPoint(event.changedTouches[i].identifier, false, 0, 0);
    }
}
//----------------------------------------------------------------------------------
function handleMove(event) {
    //event.preventDefault();
    mouse.canvas_x = event.touches[0].clientX;
    mouse.canvas_y = event.touches[0].clientY;
    mouse.touches = event.touches;
    for(var i=0; i<event.changedTouches.length; i++){
        mouse.setPoint(event.changedTouches[i].identifier, true, event.changedTouches[i].clientX, event.changedTouches[i].clientY);
    }
    
}
//----------------------------------------------------------------------------------
class Mouse extends gameObject{
    constructor(){
        super();
        this.canvas_x = 0;
        this.canvas_y = 0;
        this.x = 0;
        this.y = 0;
        this.left = false;
        this.right = false;
        this.middle = false;
        this.oldX = 0;
        this.oldY = 0;
        this.wheelUp = false;
        this.wheelDown = false;
        this.wheel = 0;
        //this.pos = new THREE.Vector3(0,0,0.996);
        this.touches = [];
        this.raycast = false;
        this.moved;
        this.points = [];
        // points es un array de puntos de mouse en pantalla..
        // unifica el mouse y el touch screen..
        // los 10 primeros son punteros del touchscreen..
        // a partir de 10 son mouse.left .midle y .right..
        for(var i=0; i<13;i++){
            this.points.push( {active: false, x: 0, y: 0} );
        }

    }
    initialize(){
        this.body_created = true;
        this.body = Bodies.circle(this.x, this.y, 1);
        this.body.label = "Mouse";
        this.body.isSensor = true;
        this.body.isStatic = true;
        World.add(world, this.body);
        Matter.Body.setStatic(this.body, true);
    }
    frame() {
        if(this.oldX===this.x && this.oldY===this.y){
            this.moved = false;
        }else{
            this.moved = true;
        }
        this.oldX = this.x;
        this.oldY = this.y;
        this.x = (this.canvas_x  * width  ) / window.innerWidth; 
        this.y = (this.canvas_y * height ) / window.innerHeight;
        Matter.Body.setPosition(this.body, {x: this.x, y: this.y});
    }
    setPoint(index, active, x_, y_){
        var finalx = (x_  * width  ) / window.innerWidth;
        var finaly = (y_  * height ) / window.innerHeight;
        this.points[index].active = active;
        this.points[index].x = finalx;
        this.points[index].y = finaly;
    }
    updateMousePointsPosition(x_, y_){
        var finalx = (x_  * width  ) / window.innerWidth;
        var finaly = (y_  * height ) / window.innerHeight;
        this.points[10].x = finalx;
        this.points[10].y = finaly;
        this.points[11].x = finalx;
        this.points[11].y = finaly;
        this.points[12].x = finalx;
        this.points[12].y = finaly;
    }
}
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function _fade_instantaneo_(){
    if (fadingType == -1) {
        deltaFading = 0;
        alphaFading = 0;
        fading = false;
    } else if (fadingType == 1) {
        deltaFading = 0;
        alphaFading = 1;
        fading = false;
    }
}
//---------------------------------------------------------------------------------
function fadeOn(time_) {
    fading = true;
    fadingType = -1;
    var fadingFramesLeft = Math.floor((time_ * 60) / 1000);
    deltaFading = (1.0 / fadingFramesLeft);
    if(time_ == 0){
        _fade_instantaneo_();
    }
}
//---------------------------------------------------------------------------------
function fadeOff(time_) {
    fading = true;
    fadingType = 1;
    var fadingFramesLeft = Math.floor((time_ * 60) / 1000);
    deltaFading = (1.0 / fadingFramesLeft);
    if(time_ == 0){
        _fade_instantaneo_();
    }
}
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
const _UP       = 38;
const _DOWN     = 40;
const _LEFT     = 37;
const _RIGHT    = 39;
const _ENTER    = 13;
const _ESC      = 27;
const _SPACE    = 32;
const _SHIFT    = 16;
const _CONTROL  = 17;
const _BLOCK_SHIFT = 20;
const _TAB      = 9;
const _Q        = 81;
const _W        = 87;
const _E        = 69;
const _R        = 82;
const _T        = 84;
const _Y        = 89;
const _U        = 85;
const _I        = 73;
const _O        = 79;
const _P        = 80;
const _A        = 65;
const _S        = 83;
const _D        = 68;
const _F        = 70;
const _G        = 71;
const _H        = 72;
const _J        = 74;
const _K        = 75;
const _L        = 76;
const _Ñ        = 192;
const _Z        = 90;
const _X        = 88;
const _C        = 67;
const _V        = 86;
const _B        = 66;
const _N        = 78;
const _M        = 77;
const _COMA     = 188;
const _PUNTO    = 190;
const _GUION    = 189;
const _1        = 49;
const _2        = 50;
const _3        = 51;
const _4        = 52;
const _5        = 53;
const _6        = 54;
const _7        = 55;
const _8        = 56;
const _9        = 57;
const _0        = 48;
const _DELETE   = 46;
const _END      = 35;
const _PAGEDOWN = 34;


var keyboard_buffer = "";
var keys    = [256];
document.onkeydown = function(e) {
    keys[e.keyCode] = true;
    if (e.keyCode === 8){
        keyboard_buffer = keyboard_buffer.slice(0, -1);
    }else{
        if(e.keyCode===16 || 
           e.keyCode===222 || 
           e.keyCode===13 || 
           e.keyCode===20 || 
           e.keyCode===18 || 
           e.keyCode===17 || 
           e.keyCode===9){    	// shift dieresis enter mayusculas AltGr control tab..
            
        }else if(e.keyCode===46){   // tecla delete..
            keyboard_buffer = "";
        }else {
            keyboard_buffer += e.key;
        }
    }
};
document.onkeyup = function(e) {
    keys[e.keyCode] = false;
};
function key(keyCode){
    return keys[keyCode];
}
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
class text extends gameObject{
    constructor(font, size, text, align, x, y, color, alpha){
        super();
        this.font = font;
        this.textSize = size+'px';
        this.text = text;
        this.align = align;
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = alpha;

        if(exists(this.father)){
            this.z = this.father.z+1;
        }

        this.style = undefined;
        this.idText = new PIXI.Text(text);
        this.idText.style.font = this.font;
        this.idText.style.fontSize = this.textSize;
        if(_glz_render_filter_ === false ){
            this.idText.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
        app.stage.addChild(this.idText);
    }
    initialize(){
        if(this.style===undefined){

        }
    }
    frame(){
        this.idText.x = this.x;
        this.idText.y = this.y;
        this.idText.zIndex = this.z;
        this.idText.alpha = this.alpha;
        this.idText.text = this.text;
        if(this.style===undefined){
            this.idText.style.fill = this.color;
            switch(this.align){
                case LEFT:
                    this.idText.x -= this.idText.texture.width/2;
                    this.idText.y -= this.idText.texture.height/2;
                break;
                case RIGHT:
                    //this.idText.x -= this.idText.texture.width;
                    this.idText.y -= this.idText.texture.height/2;
                break;
                case CENTER:
                    this.idText.x -= this.idText.texture.width/2;
                    this.idText.y -= this.idText.texture.height/2;
                break;
            }
        }
    }
    finalize(){
        app.stage.removeChild(this.idText);
    }
    setStyle(style){
        this.style = style;
        this.idText.style = this.style;
    }
    getWidth(){
        // el primer frame de vida de este texto no tiene el tamaño actualizado..
        // hasta que no pasa un frame no se calcula..
        if(this.livedFrames>0){
            return this.idText.texture.trim.width;
        }else{
            return undefined;
        }
    }
    getHeight(){
        if(this.livedFrames>0){
            return this.idText.texture.trim.height;
        }else{
            return undefined;
        }
    }
}
//----------------------------------------------------------------------------------
// EXAMPLE TEXT STYLE..
const myStyle00 = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440,
});
// ANOTHER TEXT STYLE EXAMPLE..
const myStyle01 = {font: 'bold italic 36px Arial'};
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
class scroll extends gameObject{
    constructor(texture, width, height){
        super();
        this.texture = texture;
        this.width = width;
        this.height = height;
        this.tiling = {x: 1, y: 1};
        this.offset = {x: 0, y: 0};
    }
    initialize(){
        this.graph = new PIXI.TilingSprite(this.texture, this.width, this.height);
        app.stage.addChild(this.graph);
    }
    frame(){
        this.graph.tileScale.x = this.tiling.x;
        this.graph.tileScale.y = this.tiling.y;
        this.graph.tilePosition.x = this.offset.x;
        this.graph.tilePosition.y = this.offset.y;
    }
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
function soundPlay(snd, volume, loop){
    switch(arguments.length){
        case 1:
            snd.play();
        break;
        case 2:
            snd._options.volume = volume;
            snd.play();
        break;
        case 3:
            snd._options.volume = volume;
            snd._options.loop = loop;
            snd.play();
        break;
    }
}
//----------------------------------------------------------------------------------
function soundStop(snd){
    snd.stop();
}
//----------------------------------------------------------------------------------
function soundSetVolume(snd, volume){
    snd._options.volume = volume;
}
//----------------------------------------------------------------------------------
function soundSetLoop(snd, loop){
    snd._options.loop = loop;
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
function newGraph(w, h, color){
    var hex = Math.floor( color );
    var r = ( hex >> 16 & 255 );
    var g = ( hex >> 8 & 255 );
    var b = ( hex & 255 );
    var pixel = new Uint8Array([r, g, b, 255]);  // opaque blue
    var len = w*h*4;
    var pixels = new Uint8Array(len);
    for(var i=0; i<len; i++){
        pixels[i] = pixel[i%4];
    }
    var tex = PIXI.Texture.fromBuffer(pixels, w, h);
    return tex;
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
var haveEventsgamepads = 'GamepadEvent' in window;
var haveWebkitEventsgamepads = 'WebKitGamepadEvent' in window;
var controllers = {};
function connecthandler(e) {
    addgamepad(e.gamepad);
}
function disconnecthandler(e) {
    removegamepad(e.gamepad);
}
function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad; 
}
function scangamepads() {
    var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (var i = 0; i < gamepads.length; i++) {
      if (gamepads[i] && (gamepads[i].index in controllers)) {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
if (haveEventsgamepads) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
  } else if (haveWebkitEventsgamepads) {
    window.addEventListener("webkitgamepadconnected", connecthandler);
    window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
  } else {
    setInterval(scangamepads, 500);
  }
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
var glz_egui_lock = false;
class gbutton extends gameObject{
    constructor(gr, x, y, size){
        super();
        this.st = 0;
        this.gr = gr;
        this.x = x;
        this.y = y;
        this.size = size;
        this.eventName = "";
        this.colors = [0x02344c, 0x016c9e]; // darkblue.. lightblue..
    }
    frame(){
        switch(this.st){
            case 0:
                this.setGraph(this.gr);
                this.createBody(TYPE_BOX, TYPE_SENSOR);
                this.setStatic(true);
                this.st = 10;
            break;
            case 10:
                if(this.touched() && !glz_egui_lock){
                    this.tint(0x00ffff);
                    glz_egui_lock = true;
                    this.st = 20;
                }else{
                    this.tint(0xffffff);
                }
            break;
            case 20:
                if(!this.touched() && !mouse.left){
                    method(this.eventName, this);
                    glz_egui_lock = false;
                    this.st = 10;
                }
            break;
        }
    }
    setEvent(eventName){
        this.eventName = eventName;
    }
}
//---------------------------------------------------------------------------------
class tbutton extends gameObject{
    constructor(text, x, y, textSize){
        super();
        this.st = 0;
        this.text = text;
        this.x = x;
        this.y = y;
        this.testSize = 0;
        this.textSize = textSize;
        this.eventName = "";
        this.colors = [0x02344c, 0x016c9e]; // darkblue.. lightblue..
        this.g1;
        this.g2;
        this.idText;
    }
    initialize(){
        this.idText = new text("Arial", this.textSize, this.text, CENTER, this.x, this.y, 0xffffff, 1);
        
    }
    frame(){
        switch(this.st){
            case 0:
                var w = this.idText.getWidth();
                var h = this.idText.getHeight();
                if(w!==undefined && h!==undefined){
                    // aqui ya se lo que mide de ancho el sprite..
                    this.g1 = newGraph(w+w/10, h+h/10, this.colors[0]);
                    this.g2 = newGraph(w+w/10, h+h/10, this.colors[1]);
                    this.setGraph(this.g1);
                    this.createBody(TYPE_BOX, TYPE_SENSOR);
                    this.setStatic(true);
                    this.st = 10;
                }
            break;
            case 10: 
                if(this.touched() && !glz_egui_lock){
                    this.setGraph(this.g2);
                    glz_egui_lock = true;
                    this.st = 20;
                }else{
                    this.tint(0xffffff);
                }
            break;
            case 20:
                if(!this.touched() && !mouse.left){
                    method(this.eventName, this);
                    this.setGraph(this.g1);
                    glz_egui_lock = false;
                    this.st = 10;
                }
            break;
        }
    }
    setEvent(eventName){
        this.eventName = eventName;
    }
}
//---------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------