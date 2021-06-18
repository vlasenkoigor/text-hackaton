import  gsap from "gsap";
export function fluidDrop(ch, params) {
    const {tall = 100, duration = 1} = params
    const startY = ch.ngState.y;
    ch.y = startY - tall;


    const tl = gsap.timeline();
    tl.to(ch.scale, {y: ch.scale.y*3, duration, ease : "linear"})
    tl.to(ch,  {y: startY, duration, ease : "bounce.out"})
    tl.to(ch.scale,  {y: ch.ngState.scale.y, duration : duration * 1.5 , ease : "elastic.out(1,0.3)"}, '>-1')

}
