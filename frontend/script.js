"use strict";
const API_URL = "http://" + window.location.hostname + ":5000";
window.addEventListener("online",svuotaCoda);
function creaBloccoEsercizio(esercizio){
    const div=document.createElement("div");
    div.classList.add("esercizio");
    const h2=document.createElement("h2");
    h2.textContent=esercizio.nome;
    const pp=document.createElement("p");
    pp.textContent=esercizio.target_rep?"Obiettivo: "+esercizio.target_rep.join(", "):"Nessun obiettivo";
    const ul=document.createElement("ul");
    esercizio.serie.forEach(function(e){
        const nuovaRiga=document.createElement("li");
        nuovaRiga.classList.add("riga-serie");
        const spanSerie=document.createElement("span");
        const spanRep=document.createElement("span");
        spanSerie.textContent="Serie: "+e.numero;
        spanRep.textContent=e.rep+" rep, "+e.carico+" kg";
        nuovaRiga.appendChild(spanSerie);
        nuovaRiga.appendChild(spanRep);
        ul.appendChild(nuovaRiga);
    });
    const button=document.createElement("button");
    button.textContent="Aggiungi serie";
    button.classList.add("btn","btn-secondario");
    const form=document.createElement("div");
    form.classList.add("form-serie");
    const inp1=document.createElement("input");
    inp1.type = "number";
    inp1.placeholder = "Ripetizioni";
    const inp2=document.createElement("input");
    inp2.type = "number";
    inp2.placeholder = "Carico (kg)";
    const button2=document.createElement("button");
    button2.textContent="Conferma";
    button2.classList.add("btn","btn-conferma");
    const err=document.createElement("p");
    err.classList.add("errore");

    div.appendChild(h2);
    div.appendChild(pp)
    div.appendChild(ul);
    div.appendChild(button);
    div.appendChild(form);
    form.appendChild(inp1);
    form.appendChild(inp2);
    form.appendChild(button2);
    form.appendChild(err);

    return div;
}

function callListeners(){
    const pulsantiSerie=document.querySelectorAll(".btn-secondario");
    pulsantiSerie.forEach(function(pulsanteS){
        pulsanteS.addEventListener("click",function()
        {
            const blocco=pulsanteS.closest(".esercizio");
            const form_serie=blocco.querySelector(".form-serie");
            form_serie.style.display="flex";
        });
        });
    const pulsantiConferma=document.querySelectorAll(".btn-conferma");
    pulsantiConferma.forEach(function(pulsanteC)
    {
        pulsanteC.addEventListener("click",function(){
            let blocco=pulsanteC.closest(".esercizio");
            const form_serie=blocco.querySelector(".form-serie");
            let lista=blocco.querySelector("ul");
            if(lista===null)
            {
                lista=document.createElement("ul");
                const pc=blocco.querySelector(".btn-secondario")
                blocco.insertBefore(lista,pc);
                const p=blocco.querySelector(".no-serie");
                p.remove();
            }
            const numeroSerie=lista.querySelectorAll(".riga-serie").length+1;
            const inp=form_serie.querySelectorAll("input");
            const nuovaRiga=document.createElement("li");
            nuovaRiga.classList.add("riga-serie");
            const spanNumero=document.createElement("span");
            spanNumero.textContent="Serie: "+numeroSerie;
            const spanDati=document.createElement("span");
            const err=form_serie.querySelector(".errore");
            if(inp[0].value===""||inp[1].value===""||inp[0].value==="0")
            {
                
                err.textContent="Compila entrambi i campi";
                return;
            }
            err.textContent="";
            spanDati.textContent=inp[0].value+" rep, "+inp[1].value+" kg";
            nuovaRiga.appendChild(spanNumero);
            nuovaRiga.appendChild(spanDati);
            lista.appendChild(nuovaRiga);
            form_serie.style.display="none";
            const nomeEsercizio=blocco.querySelector("h2").textContent;
            fetch(API_URL+"/api/serie",{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    esercizio:nomeEsercizio,
                    rep: parseInt(inp[0].value),
                    carico: parseFloat(inp[1].value)
                }
                )
            }).then(function(risposta)
            {
                if(!risposta.ok)
                {
                    accodaAzione("POST","/api/serie",{esercizio:nomeEsercizio,rep: parseInt(inp[0].value),carico: parseFloat(inp[1].value)});
                }
            }).catch(function(error){
                /*let azioni_offline=[];
                azioni_offline=JSON.parse(localStorage.getItem("coda_azioni")||"[]");
                azioni_offline.push({method:"POST",url:"/api/serie",body:
                {esercizio:nomeEsercizio,rep: parseInt(inp[0].value),carico: parseFloat(inp[1].value)
                }});
                localStorage.setItem("coda_azioni",JSON.stringify(azioni_offline));*/
                accodaAzione("POST","/api/serie",{esercizio:nomeEsercizio,rep: parseInt(inp[0].value),carico: parseFloat(inp[1].value)});
                });
                
            });
    });
}


fetch(API_URL+"/api/allenamenti/oggi/completo",{credentials:"include"}).then(function(risposta)
{
    if(!risposta.ok)
    {
        window.location.href="login.html";
        return;
    }
    return risposta.json();
}).then(function(dati)
{
    localStorage.setItem("allenamento_oggi",JSON.stringify(dati));
    creaPag(dati);   
    svuotaCoda();
}).catch(function(errore){
    const datiSalvati=localStorage.getItem("allenamento_oggi");
    if(datiSalvati)
        creaPag(JSON.parse(datiSalvati));
});

function creaPag(dati){
    const name=document.getElementById("program");
    name.textContent=dati["nome"];
    const contenitore=document.querySelector(".lista-esercizi");
    dati["esercizi"].forEach(function(esercizio){
        const blocco=creaBloccoEsercizio(esercizio);
        contenitore.appendChild(blocco);
    });
    callListeners();
}

fetch(API_URL+"/api/allenamenti/oggi",{credentials:"include"}).then(function(risposta){
    return risposta.json();
}).then(function(dati){
    
    const notaInp=document.getElementById("nota-input");
    notaInp.value=dati["nota"];
});
const pulsante=document.getElementById("fine");
pulsante.addEventListener("click",function()
{
    document.getElementById("messaggio-fine").style.display="flex";
    setTimeout(()=>window.location.href="programmi.html",3000);
    
})

const btnSalvaNota=document.getElementById("btn-salva-nota");
btnSalvaNota.addEventListener("click",function(){
    const notaInput=document.getElementById("nota-input");
    fetch(API_URL+"/api/allenamenti/nota",
        {method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({nota:notaInput.value})
    }
    ).then(function(risposta){
        if(!risposta.ok)
        {
            accodaAzione("POST","/api/allenamenti/nota",{nota:notaInput.value});
        }
    }).catch(function(errore){
        accodaAzione("POST","/api/allenamenti/nota",{nota:notaInput.value});
    });
});

const btnAggEser=document.getElementById("btn-agg-eser");
btnAggEser.addEventListener("click",function(){
    btnAggEser.disabled=true;
    fetch(API_URL+"/api/esercizi",{credentials:"include"}).then(function(risposta){
        return risposta.json();
    }).then(function(dati){
        const divAggEser=document.createElement("div");
        divAggEser.classList.add("card");
        let catalogo=dati;
        const sel=document.createElement("select");
        sel.classList.add("input-scheda");
        catalogo.forEach(function(esercizio){
            const opz=document.createElement("option");
            opz.value=esercizio.nome;
            opz.textContent=esercizio.nome;
            sel.appendChild(opz);
        });
        divAggEser.appendChild(sel);
        const btnConf=document.createElement("button");
        btnConf.textContent="Conferma";
        btnConf.classList.add("btn","btn-conferma");
        btnConf.addEventListener("click",function(){
            fetch(API_URL+"/api/allenamenti/esercizio",{
                method:"POST",
                credentials:"include",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({esercizio:sel.value})
            }).then(function(risposta){
                if(!risposta.ok)
                    accodaAzione("POST","/api/allenamenti/esercizio",{esercizio:sel.value});
                window.location.reload();
            }).catch(function(errore){
                accodaAzione("POST","/api/allenamenti/esercizio",{esercizio:sel.value});
                window.location.reload();
            });
        });
        divAggEser.appendChild(btnConf);
        btnAggEser.parentNode.insertBefore(divAggEser,btnAggEser.nextSibling);
        btnAggEser.disabled=false;
    });
    
});

async function svuotaCoda() {
    let azioni_offline=[];
    azioni_offline=JSON.parse(localStorage.getItem("coda_azioni")||"[]");
    for(let i=0;i<azioni_offline.length;i++)
    {
        const action=azioni_offline[i];
        try{
            const risposta=await fetch(API_URL+action.url,{
            credentials:"include",
            method:action.method,
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify(action.body)
            });
            if(!risposta.ok){
                localStorage.setItem("coda_azioni",JSON.stringify(azioni_offline.slice(i)));
                return;
            }
        }
        catch(errore){
            localStorage.setItem("coda_azioni",JSON.stringify(azioni_offline.slice(i)));
            return;
        }
    }
    localStorage.setItem("coda_azioni",JSON.stringify([]));
}

function accodaAzione(method,url,body){
    let azioni_offline;
    azioni_offline=JSON.parse(localStorage.getItem("coda_azioni")||"[]");
    azioni_offline.push({method:method,url:url,body:body});
    localStorage.setItem("coda_azioni",JSON.stringify(azioni_offline));
}