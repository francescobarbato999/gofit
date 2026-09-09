const API_URL = (window.location.hostname === "localhost" || window.location.hostname.startsWith("192.168"))
  ? "http://" + window.location.hostname + ":5000"
  : "https://gofit-backend-2t9y.onrender.com";
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
        window.location.href="login.html";
});