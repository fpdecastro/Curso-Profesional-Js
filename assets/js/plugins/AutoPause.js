class AutoPause {
    constructor(){
        this.threshold = 0.25;
        /* Utilizamos bind para que el this no haga referencia a handleInterseccion si no al this de la clase */
        this.handleInterseccion = this.handleInterseccion.bind(this);
        /* Utilizamos bind para que el this no haga referencia a handleVisibilityChange si no al this de la clase */
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }
    run(player){
        /* Instanciamos parámetro con this.player para que otras funciones tambien puedan usarlo*/
        this.player = player;
        /* POnemos un observador y definimos un límite para mirar, Cuando pase el threshold se ejecutará handleInterseccion */
        const observer = new IntersectionObserver(this.handleInterseccion, {
            threshold : this.threshold })
        observer.observe(player)

        /* Se ejecuta esta función en el Media player y ejecutará la función handleVisibilityChange cuando
        la visibilidad cambie
        */
        document.addEventListener('visibilitychange', this.handleVisibilityChange)

    };

    handleVisibilityChange(){
        // console.log(document.visibilityState)
        if(document.visibilityState === 'hidden'){
            this.player.pause();
        }else{
            this.player.play();
        }
    }

    handleInterseccion(entries){
        const entry = entries[0]
        console.log(entry.intersectionRatio)

        if (this.threshold <= entry.intersectionRatio){
            this.player.play()
        }else{
            this.player.pause()
        }

        // this.player.pause()
        // this.player.play()
    };
};
// function AutoPause(){}

// AutoPause.prototype.run = function (player){
//     const observer = new IntersectionObserver(this.handleInterseccion, {
//     threshold : 0.25 })
//     observer.observe(player.media)
// };
// AutoPause.prototype.handleInterseccion = function(entries){
//     const entry = entries[0]
//     console.log(entry)
// };


export default AutoPause;