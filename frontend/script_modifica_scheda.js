const params = new URLSearchParams(window.location.search);
const schedaId = params.get("scheda_id");
const API_URL = (window.location.hostname === "localhost" || window.location.hostname.startsWith("192.168"))
  ? "http://" + window.location.hostname + ":5000"
  : "https://gofit-backend-2t9y.onrender.com";
fetch(API_URL+"/api/schede/"+schedaId,{credentials:"include"}).then(function(risposta){
    return risposta.json().then(function(dati){
        return {ok:risposta.ok,dati:dati};
    });
}).then(function(risultato){
    if(risultato.ok){
        let scheda=risultato.dati;
        //console.log(scheda);
        const h1=document.getElementById("nome-scheda");
        h1.textContent=scheda["nome"];
        const btnIndietro=document.createElement("button");
        btnIndietro.classList.add("btn");
        btnIndietro.textContent="Indietro";
        btnIndietro.addEventListener("click",function(){
            window.location.href="programmi.html";
        });
        document.body.appendChild(btnIndietro)
        document.body.appendChild(btnEliminaScheda);
        const contenitore=document.querySelector(".lista-esercizi");
        scheda.esercizi_pianificati.forEach(function(e){
            console.log(e);
            const div=document.createElement("div");
            div.classList.add("esercizio");
            const h2=document.createElement("h2");
            h2.textContent=e.nome;
            const pp=document.createElement("p");
            pp.textContent=e.target_rep?"Obiettivo: "+e.target_rep.join(", "):"Nessun obiettivo";
            const btnEliminaEsercizio=document.createElement("button");
            btnEliminaEsercizio.classList.add("btn","btn-primario");
            btnEliminaEsercizio.textContent="-Elimina esercizio";
            btnEliminaEsercizio.addEventListener("click",function(){
                fetch(API_URL+"/api/schede/"+schedaId+"/remove",
                {
                    credentials:"include",
                    method:"DELETE",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({nome:e.nome})
                }).then(function(risposta){
                    return risposta.json().then(function(dati){
                        return {ok:risposta.ok,dati:dati};
                    });
                }).then(function(risultato){
                    if(risultato.ok)
                    {
                        div.remove();
                    }
                    else console.log(risultato.dati);
                });
            });
            div.appendChild(h2);
            div.appendChild(pp);
            div.appendChild(btnEliminaEsercizio);
            contenitore.appendChild(div);
        });
    }
    else
    {
        console.log("err");
    }
})
const btnEliminaScheda=document.getElementById("elimina-scheda");
btnEliminaScheda.addEventListener("click",function(){
    fetch(API_URL+"/api/schede/"+schedaId,
        {method:"DELETE",credentials:"include"}).then(function(risposta){
            return risposta.json().then(function(dati){
                return {ok:risposta.ok,dati:dati};
            });
        }).then(function(risultato){
            if(risultato.ok){
                window.location.href="programmi.html";
            }
        });
});