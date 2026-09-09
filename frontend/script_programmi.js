const API_URL = (window.location.hostname === "localhost" || window.location.hostname.startsWith("192.168"))
  ? "http://" + window.location.hostname + ":5000"
  : "https://gofit-backend-2t9y.onrender.com";
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
        else
        {
            window.location.href="login.html";
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

const btnLogout=document.getElementById("btn-logout");
btnLogout.addEventListener("click",function(){
    fetch(API_URL+"/api/logout",{method:"POST",credentials:"include"})
    .then(()=>window.location.href="login.html");
});