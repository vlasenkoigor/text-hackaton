import * as PIXI from 'pixi.js'
const W = 473, H = 709;
import {AnimatedText} from './AnimatedText'
import * as dat from 'dat.gui';
import {build} from "./controls";
import 'pixi-spine';


// Creating a GUI with options.
// var gui = new dat.GUI({name: 'My GUI'});

var spineLoaderOptions = { metadata: { spineAtlasSuffix: '.txt' } };

const app = new PIXI.Application({
    width : W, height : H, backgroundColor: 0x94e8ff, resolution: 1,
});

window.app = app;
document.body.appendChild(app.view);

const {stage, loader} = app;

loader.add('bitmap-export', 'assets/bitmap/bitmap-export.xml')
loader.add('letter', 'assets/letter.json')
loader.add('clouds', 'assets/clouds.json', spineLoaderOptions)
    .load((_,resources)=>{
        window.resources = resources;
        const title = new AnimatedText('neogames', {font: "35px bitmap-export"} );
        build(title);

        window.title = title;
        title.x = W / 2 - title.width / 2;
        title.y = H / 2;
        // title.y = 100;


        const animation  = new  PIXI.spine.Spine(resources.clouds.spineData);
        stage.addChild(animation);
        animation.state.setAnimationByName(0, 'idle', true);
        stage.addChild(title);


        app.ticker.add(()=>{
        });


        const wordsContainer = new PIXI.Container();
        wordsContainer.x = 30;
        wordsContainer.y = H - 300;

        title.setWordsContainer(wordsContainer);
        stage.addChild(wordsContainer);

        //1.5.21

    })










