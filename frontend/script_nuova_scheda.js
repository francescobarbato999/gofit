const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168"))
  ? "http://" + window.location.hostname + ":5000"
  : "https://gofit-backend-2t9y.onrender.com";
let nuovaScheda={nome:"",esercizi_pianificati:[]};
let catalogo=[];
fetch(API_URL+"/api/esercizi",{credentials:"include"}).then(function(risposta){
    return risposta.json();
}).then(function(dati){
    catalogo=dati;
    console.log("hi");
}).catch(function(err){
    console.log(err);
});
const formNuovaScheda=document.createElement("div");
document.body.appendChild(formNuovaScheda);
formNuovaScheda.classList.add("card");
const inputScheda=document.createElement("input");
inputScheda.setAttribute("type","text");
inputScheda.setAttribute("placeholder","nome scheda");
inputScheda.classList.add("input-scheda");
formNuovaScheda.appendChild(inputScheda);
const divEsercizi=document.createElement("div");
formNuovaScheda.appendChild(divEsercizi);
const btnNuovoEsercizio=document.createElement("button");
btnNuovoEsercizio.classList.add("btn","btn-primario");
btnNuovoEsercizio.textContent="+Aggiungi esercizio";
formNuovaScheda.appendChild(btnNuovoEsercizio);
const salva=document.createElement("button");
salva.classList.add("btn","btn-conferma");
salva.textContent="+Salva";
formNuovaScheda.appendChild(salva);
const annulla=document.createElement("button");
annulla.classList.add("btn","btn-secondario");
annulla.textContent="-Annulla";
formNuovaScheda.appendChild(annulla);
btnNuovoEsercizio.addEventListener("click",function()
{
    btnNuovoEsercizio.disabled=true;
    salva.disabled=true;
    annulla.disabled=true;
    let repTemp=[];
    const divAggEser=document.createElement("div");
    divAggEser.classList.add("card");
    const selectEser=document.createElement("select");
    selectEser.classList.add("input-scheda");
    catalogo.forEach(function(esercizio){
        const opz=document.createElement("option");
        opz.value=esercizio.nome;
        opz.textContent=esercizio.nome;
        selectEser.appendChild(opz);
    });
    divAggEser.appendChild(selectEser);
    const inpNumRep=document.createElement("input");
    inpNumRep.classList.add("input-scheda");
    inpNumRep.setAttribute("type","number");
    inpNumRep.setAttribute("placeholder","numero ripetizioni");
    divAggEser.appendChild(inpNumRep);
    const listaRep=document.createElement("ul");
    divAggEser.appendChild(listaRep);
    const btnAggRep=document.createElement("button");
    btnAggRep.classList.add("btn","btn-primario");
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
    const annullaNuovoEse=document.createElement("button");
    annullaNuovoEse.classList.add("btn","btn-secondario");
    annullaNuovoEse.textContent="-Annulla esercizio";
    annullaNuovoEse.addEventListener("click",function(){
        divAggEser.remove();
        btnNuovoEsercizio.disabled=false;
        salva.disabled=false;
        annulla.disabled=false;
    });
    const salvaNuovoEse=document.createElement("button");
    salvaNuovoEse.classList.add("btn","btn-conferma");
    salvaNuovoEse.textContent="+Salva esercizio";
    const errNuovoEse=document.createElement("p");
    errNuovoEse.classList.add("errore");
    
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
    divAggEser.appendChild(btnAggRep);
    divAggEser.appendChild(salvaNuovoEse);
    divAggEser.appendChild(annullaNuovoEse);
    divAggEser.appendChild(errNuovoEse);
    divEsercizi.appendChild(divAggEser);
});
annulla.addEventListener("click",function(){
    window.location.href="programmi.html";
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
    fetch(API_URL+"/api/schede",{
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
            window.location.href="programmi.html";
        else
        {
            errNuovaScheda.textContent=risultato.dati.messaggio;
        }
    });
});