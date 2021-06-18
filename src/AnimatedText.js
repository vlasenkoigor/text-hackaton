import * as PIXI from "pixi.js";
import  gsap from "gsap";

import {fall} from "./tweens/fall";
import {flatt} from "./tweens/flatt";
import {rotate} from "./tweens/rotate";
import {fluidDrop} from "./tweens/fluidDrop";
import {fade} from "./tweens/fade";
import {flip} from "./tweens/flip";
import {appearLeft} from "./tweens/appearLeft";

export class AnimatedText extends PIXI.extras.BitmapText{
    constructor(...param) {
        super(...param);

        PIXI.ticker.shared.add(this._onTick.bind(this))

        this._tickCallbacks = [];

        this._saveStates();

        this._registerTween('fall',fall)
        this._registerTween('flatt',flatt)
        this._registerTween('rotate',rotate)
        this._registerTween('fluidDrop',fluidDrop)
        this._registerTween('fade',fade)
        this._registerTween('flip',flip)
        this._registerTween('appearLeft',appearLeft)

        this.onMouseMove();

        this.addLetterAnimation();
        // this.addCharSprite();
    }


    entrance(){
        this._eachChar((ch)=>{ch.visible = false})
        const tweens = ['fall', 'flatt','fluidDrop','fade','rotate','flip','fall','appearLeft'];

        for (let i = 0; i < tweens.length; i++) {

            setTimeout(() => {
                this.children[i].visible = true;
                this[tweens[i]](i);
            },2000*i);
        }
    }



    onMouseMove(){
        this.interactive = true;
        const root = this;
        this.on('mousemove', (interactionData)=>{

            var interactionManager = app.renderer.plugins.interaction;

            this._eachChar((ch)=>{
                ch.isTapping = false;
            })
            if (interactionManager.hitTest(interactionData.data.global, root) === root){

                const p = root.toLocal(interactionData.data.global,app.stage)


                const elements = root.children.filter((ch)=>{

                    return p.x >= ch.x && p.x < ch.x + ch.width
                });


                elements.forEach((ch)=>{
                    ch.isTapping = true;
                  }
                )

            }

        })

    }

    copyText(){
        this._eachChar(((ch, i)=>{
            this.addCharSprite(i)
        }))
    }

    addLetterAnimation(){
        let sheet = resources.letter.spritesheet;
        const animation = new PIXI.extras.AnimatedSprite(sheet.animations['o']);
        this.addChild(animation)
        animation.play();

        //find O

        const index = this.text.indexOf('o');
        const char = this.children[index];
        animation.scale.set(char.scale.x, char.scale.y)
        animation.height = animation.height * (char.width / animation.width)
        animation.width = char.width;

        animation.position.copy(char.position);
        //correlate pos
        animation.x-=4;
        animation.y+=3;

        // correlate scale;
        const conf = 1.15;
        animation.scale.x *= conf;
        animation.scale.y *= conf;

        char.visible = false

        this._saveState(animation);
        this.children[index] = animation;
    }

    addCharSprite(index){

        const s = new PIXI.Sprite(this._getCharTexture(65));
        s.x = this.children[index].x;
        s.y = this.children[index].y - s.height * 0.2;
        const scale = this._font.size / data.size;
        s.scale.x = s.scale.y = scale;
        this.addChild(s);
    }

    _getCharTexture(charCode){
        const data = PIXI.BitmapText.fonts[this._font.name];
        const texture = data.chars[charCode].texture;

        return texture;
    }

    pulse(){
        const deltaY = 15;
        this._eachChar(ch=>{
            const duration = 0.3 + (Math.random() * 0.3);
            gsap.fromTo(ch, {y : ch.ngState.y - (Math.random() * deltaY)}, {y : ch.ngState.y + (Math.random() * deltaY), duration, yoyo : true, repeat: -1 })
        })
    }


    domino(){
        let cnt = 0;

        this._eachChar((ch, i)=>{
            console.log(i)
            // this._restoreState(ch);
            this.rotate(i, {angle : 40});
        })
        // for (let i = 0; i<this.children.length; i++){
        //     this.rotate(0)
        //     this.rotate(1)
            // this.rotate(2)
            // this.rotate(0)
        // }


    }

    circle(){
        this.resetTickAnimation();
        this.animationStartTime = + new Date();
        const len = this.children.length;
        const R = 50;


        this._tickCallbacks = [()=>{
            const delta = +new Date() - this.animationStartTime;
            this._eachChar((ch, i)=>{

                const angle = (360 / len) * i + delta * 0.2;
                ch.x = R * Math.cos(toRad(angle)) + 200;
                ch.y = R * Math.sin(toRad(angle));
            })
        }]
    }


    blowUp(){
        this.resetTickAnimation();
        this.animationStartTime = + new Date();
        const len = this.children.length;
        const R = 200;


        this._tickCallbacks = [()=>{
            const delta = +new Date() - this.animationStartTime;
            this._eachChar((ch, i)=>{

                if (ch.isTapping){
                    ch.dirY -= 0.6;

                    ch.dirY = Math.min(ch.dirY, 4)
                }

                if (ch.y > ch.ngState.y) {
                    ch.y = ch.ngState.y;
                    ch.dirY = 0;
                } else {
                    ch.dirY+=0.2;
                }

                if (!(ch.dirY < 0 && ch.y < ch.ngState.y - R)){
                    ch.y += ch.dirY;
                }
            })
        }]
    }

    resetTickAnimation(){
        this._tickCallbacks = [];

        this._eachChar((ch)=>{
            ch.x = ch.ngState.x;
            ch.y = ch.ngState.y;
            ch.rotation = ch.ngState.rotation;
            this._restoreState(ch)
        })
    }

    _registerTween(name, tween){

        this[name] = (charIndex, params = {})=>{
            const ch = this.children[charIndex]
            this._restoreState(ch);

            tween(ch, params);
        }
    }

    _onTick(delta){
        for (let i = 0; i < this._tickCallbacks.length; i++){
            this._tickCallbacks[i](delta);
        }
    }

    _saveStates(){
        this._eachChar((ch)=>{
           this._saveState(ch)

        })
    }

    _saveState(ch){
        ch.ngState = {
            x : ch.x,
            y : ch.y,
            rotation : ch.rotation,
            anchor : ch.anchor.clone(),
            scale : ch.scale.clone()
        };

        ch.dirY = 0;
    }

    _restoreState(ch){
        const {x, y, anchor, rotation, scale} = ch.ngState;
        ch.x = x;
        ch.y = y;
        ch.rotation = rotation;
        ch.anchor.copy(anchor);
        ch.scale.copy(scale);
        gsap.killTweensOf(ch);
    }

    _eachChar(cb = ()=>{}){
        this.children.forEach((ch, i)=>{
            cb(ch, i)
        })
    }

}

function toRad(deg) {
    const pi = Math.PI;
    return deg * (pi / 180)
}
