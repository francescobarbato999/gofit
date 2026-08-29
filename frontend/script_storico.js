"use strict";
const API_URL="http://192.168.1.38:5000";
fetch(API_URL+"/api/allenamenti",{method:"GET",credentials:"include"}).then(function(risposta)
{
    return risposta.json().then(function(dati)
    {
       return {ok:risposta.ok,dati:dati};
    });
}).then(function(risultato)
{
    if(risultato.ok)
    {
        const storico_div=document.getElementById("lista-storico");
        risultato.dati.forEach(element=>{
            const all=document.createElement("div");
            all.textContent=element["data"];
            all.classList.add("riga-elenco");
            all.style.cursor="pointer";
            all.addEventListener("click",()=>window.location.href="dettaglio_allenamento.html?allenamento_id="+element["id"]);
            storico_div.appendChild(all);
        });
    }
    else
        console.log("ERRORE");
});