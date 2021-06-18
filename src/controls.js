/**
 *
 * @param textComponent {AnimatedText}
 */
export function build(textComponent) {
    const callbacks = {};
    const root = document.getElementById('controls');

    const select = document.createElement('select');
    root.appendChild(select);

    const animations = [
        ['domino', ()=>textComponent.domino()],
        ['pulse', ()=>textComponent.pulse()],
        ['circle', ()=>textComponent.circle()],
        ['blow up', ()=>textComponent.blowUp()],
        ['stopTickAnimations', ()=>textComponent.resetTickAnimation()]
    ]


    animations.forEach((e)=>{
        const [name, cb] = e;
        callbacks[name] = cb;
        addOption(name)
    })




    const button = document.createElement('button');
    button.textContent = 'play';
    button.addEventListener('click', ()=>{
        callbacks[select.value]();
    })

    root.appendChild(button);


    function addOption(value) {
        const option = document.createElement('option');
        option.value = value;
        option.text = value;
        select.appendChild(option)
    }




}
