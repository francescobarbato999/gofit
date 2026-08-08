const pulsante=document.querySelector(".btn-primario");
pulsante.addEventListener("click",function()
{
    const esercizi=Array.from(document.querySelectorAll(".esercizio"));
    let indice_attivo=esercizi.findIndex(function(es)
    {
        return !es.classList.contains("esercizio-non-attivo");
    })
    esercizi[indice_attivo].classList.add("esercizio-non-attivo");
    indice_attivo=indice_attivo+1;
    esercizi[indice_attivo].classList.remove("esercizio-non-attivo");
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


