import  gsap from "gsap";
export function fade(ch, params) {
    const {tall = 30, duration = 1} = params
    const startY = ch.ngState.y;
    gsap.fromTo(ch, {alpha : 1}, {alpha: 0,duration, ease : "rough.out", onComplete: args => {
        gsap.to(ch, {alpha : 1,duration, ease : "rough.in"});
        }})
}
