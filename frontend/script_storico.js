const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168"))
  ? "http://" + window.location.hostname + ":5000"
  : "https://gofit-backend-2t9y.onrender.com";

/**as usual if everything work save in cache for when u r offline and show to user
 * 
 * if something goes wrong with fetch get from cache and show
 */
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
        localStorage.setItem("storico_allenamenti",JSON.stringify(risultato.dati));
        creaStorico(risultato.dati);
    }
    else
        window.location.href="login.html";
}).catch(function(e){
    const datiSalvati=localStorage.getItem("storico_allenamenti");
    if(datiSalvati)
        creaStorico(JSON.parse(datiSalvati));
    else
        mostraToastPermanente("Sei offline e non ci sono dati salvati.");
});

function creaStorico(dati){
    const storico_div=document.getElementById("lista-storico");
    dati.forEach(element=>{
        const all=document.createElement("div");
        all.textContent=element["data"];
        all.classList.add("riga-elenco");
        all.style.cursor="pointer";
        all.addEventListener("click",()=>window.location.href="dettaglio_allenamento.html?allenamento_id="+element["id"]);
        storico_div.appendChild(all);
    });
}
function mostraToastPermanente(messaggio)
{
    const p=document.getElementById("gestione-errore");
    p.textContent=messaggio;
    p.style.display="flex";
}