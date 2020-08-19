/* Creemos una función vacía */
function AutoPlay(){}

/* Le agregamos al objeto Autoplay la función run a su prototype */
AutoPlay.prototype.run = function(player){
    if (!player.muted){
        player.muted = true;
    }
    player.play();
}

/* Declaramos que vamos a exportar la función AutoPlay */
export default AutoPlay;