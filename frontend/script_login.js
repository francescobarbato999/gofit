"use strict";
const switch_button=document.getElementById("switch");
switch_button.addEventListener("click",function()
{
    let label=document.getElementById("switch_label");
    if(label.textContent=="Non sei registrato?")
    {
        label.textContent="Già registrato?"
        const form_l=document.getElementById("form-login");
        form_l.style.display="none";
        const form_r=document.getElementById("form-registrazione");
        form_r.style.display="block";
    }
    else
    {
        label.textContent="Non sei registrato?"
        const form_l=document.getElementById("form-login");
        form_l.style.display="block";
        const form_r=document.getElementById("form-registrazione");
        form_r.style.display="none";
    }
})
const login_button=document.getElementById("btn-login");
login_button.addEventListener("click",function()
{
    const email_doc=document.getElementById("email-login").value;
    const pass_doc=document.getElementById("password-login").value;
    fetch("http://127.0.0.1:5000/api/login",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
        body:JSON.stringify({email:email_doc,password:pass_doc}),
        
    }).then(function(risposta){
        return risposta.json().then(function(dati){
            return {ok:risposta.ok,dati:dati};
        });
    }).then(function(risultato){
        if(risultato.ok)
        {
            window.location.href="scheda_del_giorno.html";
        }
        else
        {
            const err=document.querySelector("#form-login .err");
            err.textContent=risultato.dati.messaggio;
            err.style.display="block";
        }
    })
});

const reg_button=document.getElementById("btn-registrazione");
reg_button.addEventListener("click",function()
{
    const email_doc=document.getElementById("email-registrazione").value;
    const pass_doc=document.getElementById("password-registrazione").value;
    fetch("http://127.0.0.1:5000/api/registrazione",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:"include",
        body:JSON.stringify({email:email_doc,password:pass_doc}),
        
    }).then(function(risposta){
        return risposta.json().then(function(dati){
            return {ok:risposta.ok,dati:dati};
        });
    }).then(function(risultato){
        if(risultato.ok)
        {
            window.location.href="scheda_del_giorno.html";
        }
        else
        {
            const err=document.querySelector("#form-registrazione .err");
            err.textContent=risultato.dati.messaggio;
            err.style.display="block";
        }
    })
});