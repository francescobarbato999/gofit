"use strict";
const API_URL = "http://" + window.location.hostname + ":5000";
const params=new URLSearchParams(window.location.search);
const allenamentoID=params.get("allenamento_id");
fetch(API_URL+"/api/allenamenti/"+allenamentoID,{credentials:"include"}).then(function(risposta)
{
    return risposta.json().then(function(dati){
        return {ok:risposta.ok,dati:dati};
    });
}).then(function(risultato)
{
    if(risultato.ok)
    {
        const name=document.getElementById("program");
        name.textContent=risultato.dati["data"];
        const nota=document.getElementById("nota-allenamento");
        nota.textContent=risultato.dati["nota"];
        const contenitore=document.querySelector(".lista-esercizi");
        risultato.dati["esercizi_svolti"].forEach(function(esercizio){
            const blocco=creaBloccoStorico(esercizio);
            contenitore.appendChild(blocco);
        });
    }
    else
        console.log("error");

});
function creaBloccoStorico(esercizio) {
    const div = document.createElement("div");
    div.classList.add("esercizio");
    const h2 = document.createElement("h2");
    h2.textContent = esercizio.nome;
    div.appendChild(h2);

    const ul = document.createElement("ul");
    esercizio.serie.forEach(function(s) {
        const li = document.createElement("li");
        li.classList.add("riga-serie");
        const spanNumero = document.createElement("span");
        spanNumero.textContent = "Serie " + s.numero;
        const spanDati = document.createElement("span");
        spanDati.textContent = s.rep + " rep, " + s.carico + " kg";
        li.appendChild(spanNumero);
        li.appendChild(spanDati);
        ul.appendChild(li);
    });
    div.appendChild(ul);

    return div;
}



