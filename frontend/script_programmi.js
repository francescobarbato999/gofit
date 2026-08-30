"use strict";
const API_URL = "http://" + window.location.hostname + ":5000";
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
            const schede_div=document.getElementById("lista-schede");
            risultato.dati.forEach(element => {
                const ex=document.createElement("div");
                ex.classList.add("riga-elenco");
                ex.textContent=element["nome"];
                ex.style.cursor="pointer";
                ex.addEventListener("click",()=>selezioneScheda(element["id"]));
                schede_div.appendChild(ex);
            });
        }
        else
        {
            console.log("Errore");
        }
});

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
                        console.log("Generic error");
                })
            }
        }
    })
}

const btnNuovaScheda=document.getElementById("btn-nuova-scheda");
btnNuovaScheda.addEventListener("click",function(){
    window.location.href="creaProgramma.html"
});