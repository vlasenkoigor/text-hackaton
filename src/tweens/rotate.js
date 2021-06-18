import  gsap from "gsap";
export function rotate(ch, params = {}) {
        const {duration = 1, angle = 360} = params


        ch.anchor.set(.5);
        ch.x += ch.width / 2;
        ch.y += ch.height / 2;


        gsap.fromTo(ch, {rotation : 0}, {rotation: toRad(angle),  duration, ease : "bounce.out", onComplete})

        // ch.rotation = toRad(angle)

        function onComplete() {

        }
}

function toRad(deg) {
        const pi = Math.PI;
        return deg * (pi / 180)
}
