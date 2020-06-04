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

const GLZ_VERSION = "1.3.00";
const GLZ_TYPE = "GAME FRAMEWORK";

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

const SOCKET_CONNECTED = 21;
const SOCKET_ERROR     = 22;
const SOCKET_CLOSED    = 23;

const NET_TOK_DATA     = '~';
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

function consoleInfoShow(){
    const args = [
        `\n %c %c %c gameLibZeroWEB ${GLZ_VERSION} - ${GLZ_TYPE}  %c  %c  https://github.com/LuislopezMartinez  %c %c \n\n`,
        'color: #000000; background: #030307; padding:5px 0;',
        'background: #000000; padding:5px 0;',
        'color: #ffffff; background: #0000ff; padding:5px 0;',
        'background: #030307; padding:5px 0;',
        'background: #6685ff; padding:5px 0;',
        'background: #000000; padding:5px 0;',
        'background: #000000; padding:5px 0;'
    ];
    console.log(...args);
}

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
    consoleInfoShow();
    window.addEventListener("resize", resizeGame);
    this.setup();
    window.onbeforeunload = null;
    resizeGame();
    // audio init..
    initTouch();
    mouse = new Mouse();

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
function cos(num){
    return Math.cos(num);
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
    if(codeToExecute===""){
        console.log("WARNING: event undefined.");
        return;
    }
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

    // cambiar background color en caliente..
    app.renderer.backgroundColor = backgroundColor;

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
            if(gameObjects[i].sprite!==undefined){
                app.stage.removeChild(gameObjects[i].sprite);
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
        this.sprite;
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
        this.visible = true;
        this.mask;                  // sprite para hacer el clipping..      esto es la mascara..
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
        
        if(this.sprite!==undefined){
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.sprite.zIndex = this.z;
            this.sprite.anchor.x = this.cx;
            this.sprite.anchor.y = this.cy;
            this.sprite.alpha = this.alpha;
            this.sprite.rotation = -radians(this.angle);
            this.sprite.visible = this.visible;

            if(this.sizex===1 && this.sizey===1){
                this.sprite.scale.x = this.size;
                this.sprite.scale.y = this.size;
            }else{
                this.sprite.scale.x = this.sizex;
                this.sprite.scale.y = this.sizey;
            }

        }
    }
    finalize(){
        // for override on polimorphic classes..
    }
    setGraph(texture){
        this.graph = texture;
        if(_glz_render_filter_ === false ){
            this.graph.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
        
        var sprite_undefined = false;
        if(this.sprite!==undefined){
            sprite_undefined = true;
        }
        this.draw();
        if(sprite_undefined===false){
            this.sprite = new PIXI.Sprite(this.graph);
            this.draw();
            app.stage.addChild(this.sprite);
        }else{
            this.sprite.texture = this.graph;
        }
    }
    tint(color){
        this.sprite.tint = color;
    }
    createMask(texture){
        if(this.sprite!==undefined){
            this.mask = new PIXI.Sprite(texture);
            this.sprite.mask = this.mask;
            this.mask.anchor.x = 0.5;
            this.mask.anchor.y = 0.5;
            app.stage.addChild(this.mask);
        }else{
            console.log("%c WARNING: gameObject without graph..  no masking possible.",  'color: #ff0000; background: #ffffff');
        }
     }
    removeMask(){
        if(this.sprite!==undefined){
            if(this.mask!==undefined){
                app.stage.removeChild(this.mask);
                this.sprite.mask = undefined;
            }
        }
    }
    //=======================================================
    touched(){
        if(this.sprite===undefined){return;}
        var width  = this.sprite.texture.baseTexture.width;
        var height = this.sprite.texture.baseTexture.height;
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
                    w = this.sprite.texture.baseTexture.width*this.sizex;
                    h = this.sprite.texture.baseTexture.height*this.sizey;
                } else{
                    w = this.sprite.texture.baseTexture.width*this.size;
                    h = this.sprite.texture.baseTexture.height*this.size;
                }
                this.body = Bodies.rectangle(this.x, this.y, w, h);
                Matter.Body.setAngle(this.body, radians(this.angle));
                World.add(engine.world, this.body);
                break;
            case TYPE_CIRCLE:
                w = this.sprite.texture.baseTexture.width*this.size;
                h = this.sprite.texture.baseTexture.height*this.size;
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
        signal(this, s_protected);
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
        this.idText.style.fontFamily = this.font;
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
        this.sprite = new PIXI.TilingSprite(this.texture, this.width, this.height);
        app.stage.addChild(this.sprite);
    }
    frame(){
        this.sprite.tileScale.x = this.tiling.x;
        this.sprite.tileScale.y = this.tiling.y;
        this.sprite.tilePosition.x = this.offset.x;
        this.sprite.tilePosition.y = this.offset.y;
    }
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------

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
class inputBox extends gameObject{
    constructor(default_text, x, y, w, h, pwdMode){
        super();
        this.st = 0;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.pwdMode = pwdMode;
        this.eventName = "";
        this.textSize = 14;
        this.textColor = 0x777777;
        this.textColor1 = 0x777777;
        this.textColor2 = 0x000000;
        this.os = window.navigator.platform;
        this.g1 = newGraph(w, h, 0xffffff);
        this.g2 = newGraph(w+2, h+2, 0x000000);
        this.idText;
        this.parameter = default_text;
        this.mobilePlatform = false;
        this.onScreenKeyboard;
    }
    initialize(){
        this.idText = new text("Arial", 22, this.parameter, RIGHT, this.x, this.y, this.textColor, 1);
        if(window.navigator.maxTouchPoints>1){
            this.mobilePlatform = true;
        }else{
            this.mobilePlatform = false;
        }
    }
    frame(){
        switch(this.st){
            case 0:
                if(this.idText.getWidth()!==undefined){
                    this.setGraph(this.g1);
                    this.x += this.w/2;
                    this.createBody(TYPE_BOX, TYPE_SENSOR);
                    this.st = 10;
                }
            break;
            case 10:
                if(this.touched()){
                    if(!glz_egui_lock){
                        glz_egui_lock = true;
                        this.idText.color = this.textColor2;
                        keyboard_buffer = this.parameter;
                        this.st = 12;
                    }
                }

                if(this.pwdMode){
                    var pwdText = "";
                    for(var i=0; i<this.parameter.length; i++){
                        pwdText += "*";
                    }
                    this.idText.text = pwdText;
                }else{
                    this.idText.text = this.parameter;
                }

            break;
            case 12:
                if(!this.touched() && !mouse.left){
                    if(this.mobilePlatform){
                        this.onScreenKeyboard = new Teclado();
                        this.onScreenKeyboard.z = this.z+2;
                    }
                    this.st = 20;
                }
            break;
            case 20:
                if(this.pwdMode){
                    var pwdText = "";
                    for(var i=0; i<this.parameter.length; i++){
                        pwdText += "*";
                    }
                    this.idText.text = pwdText + (frameCount % 30 > 15 ? "_" : "");
                }else{
                    this.idText.text = this.parameter + (frameCount % 30 > 15 ? "_" : "");
                }
                this.parameter = keyboard_buffer;
                
                
                if(this.mobilePlatform){
                    // control de cierre por teclado tactil..
                    if(mouse.left && mouse.y<this.onScreenKeyboard.y){
                        this.parameter = this.onScreenKeyboard.beforeInputText;
                        signal(this.onScreenKeyboard, s_kill);
                    }
                    if(!exists(this.onScreenKeyboard)){
                        glz_egui_lock = false;
                        method(this.eventName, this);
                        this.idText.color = this.textColor1;
                        this.st = 10;
                    }
                }else{
                    if(key(_ENTER) || (mouse.left&&!this.touched())){
                        glz_egui_lock = false;
                        method(this.eventName, this);
                        this.idText.color = this.textColor1;
                        this.st = 10;
                    }
                }
                
                
                
                
            break;
        }
    }

    setEvent(eventName){
        this.eventName = eventName;
    }
}
//----------------------------------------------------------------------------------
//==================================================================================
//----------------------------------------------------------------------------------
class Teclado extends gameObject{
    constructor(){
        super();
        this.st = 0;
        this.img = [];
        this.loader;
        this.shift = false;    // mayusculas activadas o no..
        this.numeric = false;  // teclado numerico en fila cero o no..
        this.t;
        this.beforeInputText = keyboard_buffer;
    }
    frame(){
        switch(this.st){
            case 0:
                this.loader = new loadImages("library/keyboard/", 3);
                this.st = 10;
            break;
            case 10:
                if(this.loader.ready){
                    this.img = this.loader.get();
                    this.size = width / this.img[0].width;
                    this.x = 0;
                    this.y = height - this.img[0].height*this.size;
                    this.cx = 0;
                    this.cy = 0;
                    this.setGraph(this.img[0]);
                    this.t = new text("Arial", 32*this.size, "---", RIGHT, 20*this.size, this.y+31*this.size, 0xffffff, 1);
                    this.t.z = this.z+1;
                    this.st = 20;
                }
            break;
            case 20:
                new _keyboard_key_('q', 'Q', this.img[1],  41, 89, '1');
                new _keyboard_key_('w', 'W', this.img[1], 110, 89, '2');
                new _keyboard_key_('e', 'E', this.img[1], 178, 89, '3');
                new _keyboard_key_('r', 'R', this.img[1], 247, 89, '4');
                new _keyboard_key_('t', 'T', this.img[1], 315, 89, '5');
                new _keyboard_key_('y', 'Y', this.img[1], 384, 89, '6');
                new _keyboard_key_('u', 'U', this.img[1], 452, 89, '7');
                new _keyboard_key_('i', 'I', this.img[1], 521, 89, '8');
                new _keyboard_key_('o', 'O', this.img[1], 590, 89, '9');
                new _keyboard_key_('p', 'P', this.img[1], 659, 89, '0');
                new _keyboard_key_('<<', '<<', this.img[1], 729, 89, '');
                    
                new _keyboard_key_('a', 'A', this.img[1],  41+33, 156, '');
                new _keyboard_key_('s', 'S', this.img[1], 110+33, 156, '');
                new _keyboard_key_('d', 'D', this.img[1], 178+33, 156, '');
                new _keyboard_key_('f', 'F', this.img[1], 247+33, 156, '');
                new _keyboard_key_('g', 'G', this.img[1], 315+33, 156, '');
                new _keyboard_key_('h', 'H', this.img[1], 384+33, 156, '');
                new _keyboard_key_('j', 'J', this.img[1], 452+33, 156, '');
                new _keyboard_key_('k', 'K', this.img[1], 521+33, 156, '');
                new _keyboard_key_('l', 'L', this.img[1], 590+33, 156, '');
                new _keyboard_key_('►', '►', this.img[2], 659+51, 156, '');
                    
                new _keyboard_key_('ctrl', 'ctrl', this.img[1],  41, 224, '');
                new _keyboard_key_('z', 'Z', this.img[1], 110, 224, '');
                new _keyboard_key_('x', 'X', this.img[1], 178, 224, '');
                new _keyboard_key_('c', 'C', this.img[1], 247, 224, '');
                new _keyboard_key_('v', 'V', this.img[1], 315, 224, '');
                new _keyboard_key_('b', 'B', this.img[1], 384, 224, '');
                new _keyboard_key_('n', 'N', this.img[1], 452, 224, '');
                new _keyboard_key_('m', 'M', this.img[1], 521, 224, '');
                new _keyboard_key_('!', '!', this.img[1], 590, 224, '');
                new _keyboard_key_('?', '?', this.img[1], 659, 224, '');
                new _keyboard_key_('ctrl', 'ctrl', this.img[1], 729, 224, '');
                    
                new _keyboard_key_('?123', '?123', this.img[1],  41, 292, '');
                new _keyboard_key_('/', '/', this.img[1], 110, 292, '');
                new _keyboard_key_(' ', ' ', this.img[3], 347, 292, '');
                new _keyboard_key_('.com', '.com', this.img[1], 590, 292, '');
                new _keyboard_key_('.', '.', this.img[1], 659, 292, '');
                new _keyboard_key_('?123', '?123', this.img[1], 729, 292, '');
                this.st = 30;
            break;
            case 30:
                this.t.text = keyboard_buffer+(frameCount % 30 > 15 ? "_" : "");
            break;
        }
    }
    finalize(){
        signal(this.t, s_kill);
    }
}
//---------------------------------------------------------------------------------
class _keyboard_key_ extends gameObject{
    constructor(label, label_shift, tile, x, y, numeric_label){
        super();
        this.st = 0;
        this.tile = tile;
        this.label = label;
        this.label_shift = label_shift;
        this.xx = x;
        this.yy = y;
        this.numeric_label = numeric_label;
    }
    frame(){
        switch(this.st){
            case 0:
                this.setGraph(this.tile);
                this.size = this.father.size;
                this.x = this.father.x + this.xx*this.size;
                this.y = this.father.y + this.yy*this.size;
                this.z = this.father.z+1;
                this.visible = false;
                this.st = 10;
            break;
            case 10:
                if(!exists(this.father)){
                    signal(this, s_kill);
                    glz_egui_lock = false;
                }
                if(this.touched()){
                    if(this.label==='<<'){
                        keyboard_buffer = keyboard_buffer.substr(0, keyboard_buffer.length-1);
                        this.visible = true;
                        this.st = 20;
                    }else if(this.label==='►'){
                        this.visible = true;
                        this.st = 30;
                    }else if(this.label==='ctrl'){
                        switch(this.father.shift){
                            case true:
                                this.father.shift = false;
                                this.visible = false;
                                this.st = 40;
                                break;
                            case false:
                                this.father.shift = true;
                                this.visible = true;
                                this.st = 40;
                                break;
                        }
                    }else if(this.label==='?123'){
                        switch(this.father.numeric){
                            case true:
                                this.father.numeric = false;
                                this.visible = false;
                                this.st = 40;
                                break;
                            case false:
                                this.father.numeric = true;
                                this.visible = true;
                                this.st = 40;
                                break;
                        }
                    }else{
                        // SI NUM y num_label esta definida..
                        if(this.father.numeric && this.numeric_label!==''){
                            keyboard_buffer += this.numeric_label;
                            this.visible = true;
                        // SI NO NUM y num_label indefinida..
                        }else{
                            // SI SHIFT..
                            if(this.father.shift){
                                keyboard_buffer += this.label_shift;
                                this.visible = true;
                            // SI NO SHIFT..
                            }else{
                                keyboard_buffer += this.label;
                                this.visible = true;
                            }
                        }
                        this.st = 20;
                    }
                }
            break;
            case 20:
                // aqui pintar si se quiere la tecla que se esta pulsando..
                if(!this.touched()){
                    this.visible = false;
                    this.st = 10;
                }
                break;
            case 30:
                if(!this.touched()){
                    signal(this.father, s_kill);
                    this.st = 10;
                }
                break;
            case 40:
                if(!this.touched()){
                    this.st = 10;
                }

                break;
        }
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//=================================================================================
//---------------------------------------------------------------------------------
var _glz_pixels_process_id_;
class loadPixels extends gameObject{
    constructor(src){
        super();
        this.src = src;
        this.st = 0;
        this.pixels;
        this.img = document.createElement("img");
        this.ready = false;
    }
    frame(){
        switch(this.st){
            case 0:
                if(_glz_pixels_process_id_===undefined){
                    _glz_pixels_process_id_ = this;
                    this.img.src = this.src.baseTexture.cacheId;
                    this.img.onload = this.onLoad;
                    this.st = 10;
                }
            break;
            case 10:
                if(this.ready){
                    _glz_pixels_process_id_ = undefined;
                    this.st = 20;
                }
            break;
            case 20:
                
            break;
        }
    }
    onLoad(){
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        var pixelData = canvas.getContext('2d').getImageData(0, 0, this.width, this.height).data;
        _glz_pixels_process_id_.pixels = pixelData;
        _glz_pixels_process_id_.ready = true;
    }
    getPixel(x, y){
        if(x>this.img.width || y>this.img.height || this.ready===false){
            return undefined;
        }
        if(x<0 || y<0){
            return undefined;
        }
        var offset = ((this.img.width*y)+x)*4;
        console.log(offset);
        return [this.pixels[offset], this.pixels[offset+1], this.pixels[offset+2], this.pixels[offset+3]];
    }
    getPixels(){
        return pixels;
    }
}
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//=================================================================================
//---------------------------------------------------------------------------------
// controlador de acceso al almacenamiento local de datos..
class storage{
    constructor(){
        this.localStorage = window.localStorage;
    }
    get(key){
        return this.localStorage.getItem(key);
    }
    set(key, value){
        this.localStorage.setItem(key, value);
    }
    remove(key){
        this.localStorage.removeItem(key);
    }
    clear(){
        this.localStorage.clear();
    }
    available() {
        try {
            var storage = window['localStorage'],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage.length !== 0;
        }
    }
}
//---------------------------------------------------------------------------------
//=================================================================================
//---------------------------------------------------------------------------------
// CREA UN CLIENTE DE WEBSOCKET PREPARADO PARA LA NETLIBZERO_SERVER DE PROCESSING..
// ESTE CONSTRUCTOR ESTA INTEGRADO CON EL SISTEMA DE netMessage() muy sencillo de usar.
function createClient(host, port){
    var ws_client = new WebSocket(host+':'+port);
    ws_client.status = 0;
    // SET BET EVENTS TO WEB_SOCKET..
    ws_client.addEventListener('open', function (event) {
        ws_client.status = SOCKET_CONNECTED;
        onNetOpen(event);
    });
    ws_client.addEventListener('message', function (event) {
        ws_client.status = SOCKET_CONNECTED;
        onNetMessage(event.data.split(NET_TOK_DATA));
    });
    ws_client.addEventListener('error', function (event) {
        ws_client.status = SOCKET_ERROR;
        onNetError(event);
    });
    ws_client.addEventListener('close', function (event) {
        ws_client.status = SOCKET_CLOSED;
        onNetClose(event);
    });
    return ws_client;
}
// CREA UN CLIENTE DE WEBSOCKET STANDAR..
// TODO A PELO A TU ROYO MARCELO..
function createWsClient(host, port){
    var ws_client = new WebSocket(host+':'+port);
    ws_client.status = 0;
    // SET BET EVENTS TO WEB_SOCKET..
    ws_client.addEventListener('open', function (event) {
        ws_client.status = SOCKET_CONNECTED;
        onNetWsOpen(event);
    });
    ws_client.addEventListener('message', function (event) {
        ws_client.status = SOCKET_CONNECTED;
        onNetWsMessage(event);
    });
    ws_client.addEventListener('error', function (event) {
        ws_client.status = SOCKET_ERROR;
        onNetWsError(event);
    });
    ws_client.addEventListener('close', function (event) {
        ws_client.status = SOCKET_CLOSED;
        onNetClose(event);
    });
    return ws_client;
}
//---------------------------------------------------------------------------------
function closeClient(ws_socket){
    if(ws_socket!==undefined){
        ws_socket.close();
    }
}
//---------------------------------------------------------------------------------
class netMessage{
    constructor(wsocket){
        this.wsocket = wsocket;
        this.buffer = "";
        this.NET_TOK_DATA = '~';
    }
    add(token){
        var type = typeof(token);
        switch(type){
            case "string":
                // ADD SIMPLE STRING TO MESSAGE..
                if(this.buffer===''){
                    this.buffer += token;
                }else{
                    this.buffer += this.NET_TOK_DATA + token;
                }
            break;
            case "object":
                // ADD STRINGLIST TO MESSAGE..
                for(var i=0; i<token.data.length; i++){
                    this.add(token.get(i));
                }
            break;
        }
    }

    send(){
        this.wsocket.send(this.buffer);
    }

}
// processing compatibility layer for fantastic StringList() of java..
class StringList{
    constructor(){
        this.data = [];
    }
    append(dato){
        this.data.push(dato);
    }
    get(index){
        return this.data[index];
    }
    size(){
        return this.data.length;
    }
}
//---------------------------------------------------------------------------------
//=================================================================================
//---------------------------------------------------------------------------------
// processing compatibility layer for fantastic loadLines()..
function loadLines(filename){
    var client = new XMLHttpRequest();
    client.onload = function(){
        this.ready = true;
    };
    client.open("GET", filename);
    client.send();
    client.ready = false;
    client.get = function(){
        return this.response.split('\n');
    }
    return client;
}
//---------------------------------------------------------------------------------
//=================================================================================
//---------------------------------------------------------------------------------
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
//---------------------------------------------------------------------------------
//=================================================================================
//---------------------------------------------------------------------------------
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
                    this.dat[this.pos] = new Howl({src: [this.path+this.name+this.ext]});
                    this.pos++;
                }else{
                    // check if load all files completed..
                    var completed = true;
                    let totalFiles = Number(this.numFiles);     // sin Number() no funciona el for.. puto JS..
                    for(var i=0; i<=totalFiles; i++){
                        
                        if(this.dat[i]!==undefined){
                            if(this.dat[i]._state !== "loaded"){
                                completed = false;
                            }
                        }else{
                            completed = false;
                        }

                    }
                    if(completed===true){
                        this.ready = true;
                        this.st = 10;
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

function soundPlay(snd, volume, loop){
    switch(arguments.length){
        case 1:
            snd.play();
        break;
        case 2:
            snd.volume(volume);
            snd.play();
        break;
        case 3:
            snd.volume(volume);
            snd.loop = loop;
            snd.play();
        break;
    }
}
//----------------------------------------------------------------------------------
function soundIsPlaying(snd){
    return snd.playing();
}
//----------------------------------------------------------------------------------
function soundStop(snd){
    snd.stop();
}
//----------------------------------------------------------------------------------
function soundSetVolume(snd, volume){
    snd.volume(volume);
}
function soundGetVolume(snd){
    return snd.volume;
}
//----------------------------------------------------------------------------------
function soundSetLoop(snd, loop){
    snd.loop(loop);
}
function soundGetLoop(snd){
    return snd.loop;
}
//----------------------------------------------------------------------------------
function soundSetRate(snd, rate){
    if(rate>4.0){
        console.log("WARNING: soundSetRate(rate): rate too high.  max value: 4.0");
    }else{
        snd.rate(rate);
    }
}
function soundGetRate(snd){
    return snd._rate;
}
//---------------------------------------------------------------------------------
//=================================================================================
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
//=================================================================================
//---------------------------------------------------------------------------------
