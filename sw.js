/* Cuando el navegador instale el ServiceWorker se ejecutará la función */
self.addEventListener('install', event =>{

    /* Lo primero que haremos es crear un Pre - Cache
    el método waitUntil es nativo de los Servers Workers
    como puede tardar en instalarse, recién se ejecuta la función cuando
    la instalación es completa
    */
    event.waitUntil(precache());
})

/* Ahora ejecutaremos una función cuando se haga una promesa en el programa */
self.addEventListener('fetch', event =>{
    
    /* Instanciamos una constante a la devolución del fetch */
    const request = event.request;
    
    /*Solo tendremos en cuenta a las peticiones 'GET', todas las peticiones
    distintas a get no las tendremos en cuenta */
    if(request.method !== 'GET'){
        return;
    }

    /* Buscar en cache. event tiene tambien nativo el método respondWith
    y por lo tanto responderemos con una respuesta cacheada*/
    event.respondWith(cacheResponse(request));

    /* Si queda desactualizado el cache el usuario puede ver copias de las páginas viejas */
    event.waitUntil(updateCache(request))
})

async function precache() {
    /* Tenemos que utilizar un método del DOM llamado caches lo que deberiamos
    hacer es abrir un cache en específico. Que no es otra cosa que una promesa */
    const cache = await caches.open('v1')

    /* Una vez que tenemos el cache queremos agregar unos recursos al cache */
    return cache.addAll([
        '/',
        '/index.html',
        '/assets/ejercicio.mp4',
        '/assets/css/index.css',
        '/assets/js/index.js',
        '/assets/js/mediaPlayer.js',
        '/assets/js/plugins/AutoPause.js',
        '/assets/js/plugins/AutoPlay.js',
    ]);
}

async function cacheResponse(request){
    /* Abrimos el cache */
    const cache = await caches.open('v1')
    
    /* Hacemos un fetch del request */
    const response = await fetch(request)

    /* Existe un metodo para agregar contenido al cache*/
    return cache.put(request, response)
}