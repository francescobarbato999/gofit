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

const btnNuovaScheda=document.getElementById("btn-nuova-scheda");
btnNuovaScheda.addEventListener("click",function(){
    console.log("click");
    let nuovaScheda={nome:"",esercizi_pianificati:[]};
    let catalogo=[];
    fetch("http://127.0.0.1:5000/api/esercizi",{credentials:"include"}).then(function(risposta){
        return risposta.json();
    }).then(function(dati){
        catalogo=dati;
    });
    btnNuovaScheda.disabled=true;
    const formNuovaScheda=document.createElement("div");
    btnNuovaScheda.parentNode.insertBefore(formNuovaScheda,btnNuovaScheda);
    const inputScheda=document.createElement("input");
    inputScheda.setAttribute("type","text");
    inputScheda.setAttribute("placeholder","nome scheda");
    formNuovaScheda.appendChild(inputScheda);
    const divEsercizi=document.createElement("div");
    formNuovaScheda.appendChild(divEsercizi);
    const btnNuovoEsercizio=document.createElement("button");
    btnNuovoEsercizio.textContent="+Aggiungi esercizio";
    formNuovaScheda.appendChild(btnNuovoEsercizio);
    const salva=document.createElement("button");
    salva.textContent="+Salva";
    formNuovaScheda.appendChild(salva);
    const annulla=document.createElement("button");
    annulla.textContent="-Annulla";
    formNuovaScheda.appendChild(annulla);
    btnNuovoEsercizio.addEventListener("click",function()
    {
        btnNuovoEsercizio.disabled=true;
        salva.disabled=true;
        annulla.disabled=true;
        let repTemp=[];
        const divAggEser=document.createElement("div");
        const selectEser=document.createElement("select");
        catalogo.forEach(function(esercizio){
            const opz=document.createElement("option");
            opz.value=esercizio.nome;
            opz.textContent=esercizio.nome;
            selectEser.appendChild(opz);
        });
        divAggEser.appendChild(selectEser);
        const inpNumRep=document.createElement("input");
        inpNumRep.setAttribute("type","number");
        inpNumRep.setAttribute("placeholder","numero ripetizioni");
        divAggEser.appendChild(inpNumRep);
        const listaRep=document.createElement("ul");
        divAggEser.appendChild(listaRep);
        const btnAggRep=document.createElement("button");
        btnAggRep.textContent="+Aggiungi rep";
        btnAggRep.addEventListener("click",function(){
            let repVal=inpNumRep.value;
            if(repVal<=0)
                return;
            const nowLi=document.createElement("li");
            nowLi.textContent=Number(repVal);
            listaRep.appendChild(nowLi);
            repTemp.push(Number(repVal));
            inpNumRep.value=0;
        });
        divAggEser.appendChild(btnAggRep);
        const annullaNuovoEse=document.createElement("button");
        annullaNuovoEse.textContent="Annulla esercizio";
        annullaNuovoEse.addEventListener("click",function(){
            divAggEser.remove();
            btnNuovoEsercizio.disabled=false;
            salva.disabled=false;
            annulla.disabled=false;
        });
        divAggEser.appendChild(annullaNuovoEse);
        const salvaNuovoEse=document.createElement("button");
        salvaNuovoEse.textContent="Salva esercizio";
        const errNuovoEse=document.createElement("p");
        errNuovoEse.classList.add("errore");
        divAggEser.appendChild(errNuovoEse);
        salvaNuovoEse.addEventListener("click",function(){
            if(selectEser.value=="" || repTemp.length===0)
            {
                errNuovoEse.textContent="Inserisci un nome o almeno una serie";
                return;
            }
            errNuovoEse.textContent="";
            const indice=nuovaScheda.esercizi_pianificati.length;
            nuovaScheda.esercizi_pianificati.push({
                nome:selectEser.value,
                target_rep:repTemp
            });
            const riepilogo=document.createElement("div");
            riepilogo.dataset.indice=indice;
            riepilogo.classList.add("esercizio-riepilogo");
            const h3=document.createElement("h3");
            h3.textContent=selectEser.value;
            const pRep=document.createElement("p");
            pRep.textContent="Obiettivo: "+repTemp.join(", ")+" rep";
            riepilogo.appendChild(h3);
            riepilogo.appendChild(pRep);
            divEsercizi.appendChild(riepilogo);
            divAggEser.remove();
            btnNuovoEsercizio.disabled=false;
            salva.disabled=false;
            annulla.disabled=false;
        });
        divAggEser.appendChild(salvaNuovoEse);
        divEsercizi.appendChild(divAggEser);
    });
    annulla.addEventListener("click",function(){
        btnNuovaScheda.disabled=false;
        formNuovaScheda.remove();
    });
    const errNuovaScheda=document.createElement("p");
    errNuovaScheda.classList.add("errore");
    formNuovaScheda.appendChild(errNuovaScheda);
    salva.addEventListener("click",function(){
        if(inputScheda.value===""|| nuovaScheda.esercizi_pianificati.length===0)
        {
            errNuovaScheda.textContent="Nome scheda o numero esercizi non valido";
            return;
        }
        errNuovaScheda.textContent="";
        nuovaScheda.nome=inputScheda.value;
        fetch("http://127.0.0.1:5000/api/schede",{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(nuovaScheda)
        }
        ).then(function(risposta){
            return risposta.json().then(function(dati){
                return {ok:risposta.ok,dati:dati};
            });
        }).then(function(risultato){
            if(risultato.ok)
                window.location.reload();
            else
            {
                errNuovaScheda.textContent=risultato.dati.messaggio;
            }
        });
    });
});