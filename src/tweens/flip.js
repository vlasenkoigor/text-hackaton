import  gsap from "gsap";
export function flip(ch, params) {
    const { duration = 1} = params


    ch.anchor.set(0,1);
    ch.y += ch.height;

    const scaleY = ch.scale.y;
    gsap.fromTo(ch.scale,  {y : scaleY * -1},{y: scaleY,duration, ease : "bounce.out"});
}

