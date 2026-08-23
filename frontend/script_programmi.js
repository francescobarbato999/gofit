"use strict";
fetch("http://127.0.0.1:5000/api/schede",{
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
                ex.textContent=element["nome"];
                ex.style.cursor="pointer";
                ex.addEventListener("click",()=>window.location.href="scheda_del_giorno.html?scheda_id="+element["id"]);
                schede_div.appendChild(ex);
            });
        }
        else
        {
            console.log("Errore");
        }
});