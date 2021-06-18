import * as PIXI from "pixi.js";
import  gsap from "gsap";

import {fall} from "./tweens/fall";
import {flatt} from "./tweens/flatt";
import {rotate} from "./tweens/rotate";
import {fluidDrop} from "./tweens/fluidDrop";

export class AnimatedText extends PIXI.extras.BitmapText{
    constructor(...param) {
        super(...param);

        PIXI.ticker.shared.add(this._onTick.bind(this))

        this._tickCallbacks = [];

        this._saveState();

        this._registerTween('fall',fall)
        this._registerTween('flatt',flatt)
        this._registerTween('rotate',rotate)
        this._registerTween('fluidDrop',fluidDrop)

        this.onMouseMove();

        // this.addCharSprite();
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


                console.log(elements)
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
        this._eachChar((ch, i)=>{
            // this._restoreState(ch);
            setTimeout(()=>{
                this.rotate(i, {angle : 40})
            }, i*200)

        })

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
                ch.x = R * Math.cos(toRad(angle));
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
                    ch.dirY -= 0.5;

                    ch.dirY = Math.min(ch.dirY, 4)
                    console.log(ch.dirY)
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
            console.log(ch.ngState.x, ch.ngState.y)
        })
    }

    _registerTween(name, tween){

        this[name] = (charIndex, params = {})=>{
            this.resetTickAnimation();
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

    _saveState(){
        this._eachChar((ch)=>{
            ch.ngState = {
                x : ch.x,
                y : ch.y,
                rotation : ch.rotation,
                anchor : ch.anchor.clone(),
                scale : ch.scale.clone()
            };

            ch.dirY = 0;

            console.log(ch.ngState.x, ch.ngState.y)
        })
    }

    _restoreState(ch){
        const {x, y, anchor, rotation, scale} = ch.ngState;
        ch.x = x;
        ch.y = y;
        ch.rotation = rotation;
        ch.anchor.copy(anchor);
        ch.scale.copy(scale)
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
