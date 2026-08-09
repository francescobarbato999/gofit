fetch("http://127.0.0.1:5000/api/esercizi").then(function(risposta)
{
    return risposta.json();
}).then(function(dati)
{
    const contenitore=document.querySelector(".lista-esercizi");
    dati.forEach(function(esercizio,index){
        const blocco=creaBloccoEsercizio(esercizio,index);
        contenitore.appendChild(blocco);
        index++;
    })
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
        spanNumero.textContent="Serie "+numeroSerie;
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
    });
});
});

function creaBloccoEsercizio(esercizio,index){
const div=document.createElement("div");
div.classList.add("esercizio");
if(index!=0)
    div.classList.add("esercizio-non-attivo");
const h2=document.createElement("h2");
h2.textContent=esercizio.nome;
const ul=document.createElement("ul");
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
div.appendChild(ul);
div.appendChild(button);
div.appendChild(form);
form.appendChild(inp1);
form.appendChild(inp2);
form.appendChild(button2);
form.appendChild(err);

return div;
}

const pulsante=document.querySelector(".btn-primario");
pulsante.addEventListener("click",function()
{
    const esercizi=Array.from(document.querySelectorAll(".esercizio"));
    let indice_attivo=esercizi.findIndex(function(es)
    {
        return !es.classList.contains("esercizio-non-attivo");
    })
    if(indice_attivo+1<esercizi.length)
    {
        esercizi[indice_attivo].classList.add("esercizio-non-attivo");
        indice_attivo=indice_attivo+1;
        esercizi[indice_attivo].classList.remove("esercizio-non-attivo");
    }
    else
    {
        esercizi[indice_attivo].classList.add("esercizio-non-attivo");
        const mess=document.querySelector(".messaggio-fine");
        mess.style.display="flex";
    }
})



