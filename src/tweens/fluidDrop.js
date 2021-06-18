import  gsap from "gsap";
export function fluidDrop(ch, params) {
    const {tall = 100, duration = 1} = params
    const startY = ch.ngState.y;
    ch.y = startY - tall;
    gsap.fromTo(ch.scale, {y : ch.scale.y}, {y: ch.scale.y*2, duration, ease : "linear"})
    // gsap.fromTo(ch, {y : startY - tall}, {y: startY,duration, ease : "bounce.out"})



    const tl = gsap.timeline();
    tl.to(ch.scale, {y: ch.scale.y*2, duration, ease : "linear"})
    tl.to(ch,  {y: startY, duration, ease : "bounce.out"}, '>-0.7')
    tl.to(ch.scale,  {y: ch.ngState.scale.y, duration : 1, ease : "elastic.out(1,0.3)"}, '>-2')

}
