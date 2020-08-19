// Importamos dos módulos el MediaPlayer y Autoplay
import MediaPlayer from './mediaPlayer.js'
import AutoPlay from './plugins/AutoPlay.js'
import AutoPause from './plugins/AutoPause.js'

/* guardamos en una variable la etiqueta video */
const  video = document.querySelector("video");


/* Creamos una clase player que es como la de MediaPlayer, le pasamos dos parámetros
(1) el media, en este caso 
(2) un objeto AutoPlay
y le paso como parámetro un objeto */
const player = new MediaPlayer({  el: video,
                                  plugins: [new AutoPlay(), new AutoPause()]
                                });


const playButton = document.querySelector('#playButton');
playButton.onclick = () => player.togglePlay();

const muteButton = document.querySelector('#muteButton');

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
}

muteButton.onclick = () => {
  if (player.media.muted) {
    player.unmute ();
    console.log('hola')
  } else {
    player.mute ();
  }
}

