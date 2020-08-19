/* Creamos un objeto MediaPlayer */
function MediaPlayer(config) {
  this.media = config.el;
  this.plugins = config.plugins || [];
  this._initPlugins();
}

/* Función que inicializa los plugins */
MediaPlayer.prototype._initPlugins = function() {
  /* Creamos un objeto que tiene la función play, pause y dos propiedades virtuales */
  const player = {
    play : () => this.play,
    pause : () => this.pause,
    media : this.media,

    /*Podemos crear una propiedad virtual con get*/
    get muted(){
      return this.media.muted;
    },

    /*Podemos crear una propiedad virtual con set*/
    set muted(value){
      this.media.muted = value;
    }
  }

  /*Se le aplicara una función a cada plugin. Lo que hacemos es ejecutar cada plugin.*/
  this.plugins.forEach(plugin => {    
    /* Tenemos que llamar un método específico
    En este caso a plugin le pasamos como parámetro el video = this.media */
    plugin.run(this.media);
  });
}

MediaPlayer.prototype.togglePlay = function () {
  if (this.media.paused){
    this.play();
  }else{
    this.pause();
  }
}

MediaPlayer.prototype.play = function () {
  this.media.play();
};

MediaPlayer.prototype.pause = function () {
  this.media.pause();
};

MediaPlayer.prototype.mute = function () {
  this.media.muted = true;    
};

MediaPlayer.prototype.unmute = function () {
  this.media.muted = false;
};

export default MediaPlayer;