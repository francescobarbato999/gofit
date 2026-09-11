const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168"))
  ? "http://" + window.location.hostname + ":5000"
  : "https://gofit-backend-2t9y.onrender.com";

fetch(API_URL+"/api/sessione",{credentials:"include"}).then(function(risposta){
    if(!risposta.ok)
        window.location.href="login.html";
});
const chatHistory=[];
const button=document.getElementById("ask-button");
button.addEventListener("click",function(){
    const question=document.getElementById("question-area");
    let value=question.value;
    question.value="";
    if(value.trim()==="")
        return;
    chatHistory.push({"role":"user","parts":[{"text":value}]});
    const chatMessage=document.createElement("p");
    chatMessage.textContent=value;
    const chatDiv=document.getElementById("chat-area");
    chatDiv.appendChild(chatMessage);
    fetch(API_URL+"/api/coach",{
        credentials:"include",
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({history:chatHistory})
    }).then(function(risposta){
        return risposta.json().then(function(dati){
            return {ok:risposta.ok,dati:dati}
        });
    }).then(function(risultato){
        if(risultato.ok)
        {
            chatHistory.push({"role":"model","parts":[{"text":risultato.dati.risposta}]});
            const answer=document.createElement("p");
            answer.textContent=risultato.dati.risposta;
            chatDiv.appendChild(answer);
        }
        else
            mostraToastPermanente("Errore Coach");
    }).catch(function(e){
        mostraToastPermanente("Errore Coach");
    })
})



function mostraToastPermanente(messaggio)
{
    const p=document.getElementById("gestione-errore");
    p.textContent=messaggio;
    p.style.display="flex";
}