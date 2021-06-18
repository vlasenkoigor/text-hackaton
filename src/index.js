import * as PIXI from 'pixi.js'
const W = 473, H = 709;
import {AnimatedText} from './AnimatedText'
import * as dat from 'dat.gui';
import {build} from "./controls";



// Creating a GUI with options.
var gui = new dat.GUI({name: 'My GUI'});


const app = new PIXI.Application({
    width : W, height : H, backgroundColor: 0xfffff, resolution: 1,
});

window.app = app;
document.body.appendChild(app.view);

const {stage, loader} = app;

loader.add('bitmap-export', 'assets/bitmap/bitmap-export.xml')
    .load(()=>{
        const title = new AnimatedText('neogames', {font: "35px bitmap-export"} );
        build(title);

        window.title = title;
        title.x = W / 2 - title.width / 2;
        title.y = H / 2;


        stage.addChild(title);

        // title.pulse();


        app.ticker.add(()=>{
        });


    })










