const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168"))
  ? "http://" + window.location.hostname + ":5000"
  : "https://gofit-backend-2t9y.onrender.com";
/**as usual if everything work save in cache for when u r offline and show to user
 * 
 * if something goes wrong with fetch get from cache and show
 */
fetch(API_URL+"/api/schede",{
    method:"GET",
    credentials:"include"
}).then(function(risposta)
{
    return risposta.json().then(function(dati){
            return {ok:risposta.ok,dati:dati};
        });
}).then(function(risultato)
{
    if(risultato.ok)
        {
            localStorage.setItem("schede_allenamento",JSON.stringify(risultato.dati));
            creaSchede(risultato.dati);
        }
        else
        {
            window.location.href="login.html";
        }
}).catch(function(e){
    const datiSalvati=localStorage.getItem("schede_allenamento");
    if(datiSalvati)
        creaSchede(JSON.parse(datiSalvati))
    else
        mostraToastPermanente("Sei offline e non ci sono dati salvati.");
});
/**
 * check if user has already started a workout and let him/her confirm if he wants to change his/her current
 * workout. 
 */
function selezioneScheda(schedaId){
    fetch(API_URL+"/api/allenamenti/scheda",{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({scheda_id:schedaId})
    }).then(function(risposta){
        return risposta.json().then(function(dati){
            return {ok:risposta.ok,dati:dati};
        });
    }).then(function(risultato){
        if(risultato.ok)
            window.location.href="scheda_del_giorno.html"
        else
        {
            const conferma=confirm("Hai già una scheda in corso. Vuoi sostituirla?");
            if(conferma==true)
            {
                fetch(API_URL+"/api/allenamenti/scheda",{
                    method:"POST",
                    credentials:"include",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({scheda_id:schedaId,forza:true})
                }).then(function(risposta){
                    return risposta.json().then(function(dati){
                            return {ok:risposta.ok,dati:dati};
                        });
                }).then(function(risultato){
                    if(risultato.ok)
                        window.location.href="scheda_del_giorno.html"
                    else
                        console.log("Generic error");//everytime i tried to change this something went wrong
                })
            }
        }
    })
}
//for every plan retrieved build its own div
function creaSchede(dati){
    const schede_div=document.getElementById("lista-schede");
    dati.forEach(element => {
        const riga=document.createElement("div");
        riga.classList.add("riga-ex");
        const ex=document.createElement("div");
        ex.classList.add("riga-elenco");
        ex.textContent=element["nome"];
        ex.style.cursor="pointer";
        ex.addEventListener("click",()=>selezioneScheda(element["id"]));
        const btnModifica=document.createElement("button");
        btnModifica.classList.add("btn","btn-primario");
        btnModifica.textContent="Modifica";
        btnModifica.addEventListener("click",()=>window.location.href="modifica_programma.html?scheda_id="+element["id"]);
        riga.appendChild(ex);
        riga.appendChild(btnModifica);
        schede_div.appendChild(riga)
    });
}
//build a new Scheda (plan) is now delegated to a different page
const btnNuovaScheda=document.getElementById("btn-nuova-scheda");
btnNuovaScheda.addEventListener("click",function(){
    window.location.href="creaProgramma.html"
});

const btnLogout=document.getElementById("btn-logout");
btnLogout.addEventListener("click",function(){
    fetch(API_URL+"/api/logout",{method:"POST",credentials:"include"})
    .then(()=>window.location.href="login.html");
});
function mostraToastPermanente(messaggio)
{
    const p=document.getElementById("gestione-errore");
    p.textContent=messaggio;
    p.style.display="flex";
}