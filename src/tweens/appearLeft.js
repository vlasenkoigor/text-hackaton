import  gsap from "gsap";
export function appearLeft(ch, params) {
    const {duration = 1, angle = 720, enter = 200, easeing = "power3" } = params


    ch.anchor.set(.5);
    ch.x += ch.width / 2;
    ch.y += ch.height / 2;
    const endX = ch.x
    const startX = ch.x + enter;


    gsap.fromTo(ch, {rotation : 0, x: startX}, {rotation: toRad(angle), x:endX,  duration, ease : easeing, onComplete})

    function onComplete() {

    }
}

function toRad(deg) {
    const pi = Math.PI;
    return deg * (pi / 180)
}
