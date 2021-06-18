import  gsap from "gsap";
export function flatt(ch, params = {}) {
    const {duration = 1} = params
    const startScaleY = ch.scale.y;

    ch.anchor.set(0,1);
    ch.y += ch.height;
    gsap.fromTo(ch.scale, {y : startScaleY}, {y: startScaleY * 0.5, duration, ease : "bounce.out"})
}
