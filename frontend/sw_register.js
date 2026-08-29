if("serviceWorker" in navigator){
    navigator.serviceWorker.register("/sw.js").
    then(()=>console.log("Service worker registrato")).
    catch((err)=>console.log("Errore SW: ",err));
}