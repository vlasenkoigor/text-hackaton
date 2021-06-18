import  gsap from "gsap";
export function fall(ch, params) {
        const {tall = 30, duration = 1} = params
        const startY = ch.ngState.y;
        gsap.fromTo(ch, {y : startY - tall}, {y: startY,duration, ease : "bounce.out"})
}
