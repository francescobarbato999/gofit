
const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168"))
  ? "http://" + window.location.hostname + ":5000"
  : "https://gofit-backend-2t9y.onrender.com";
// all API_URL need in every script need this ternary operator to check whether if u are on prod or on dev
let totaliOggi={calorie:0,proteine:0,carboidrati:0,grassi:0};

//this function just shows all user's macros, called on fetch
function mostraTotali(){
    document.getElementById("tot-calorie").textContent=totaliOggi.calorie.toFixed(1);
    document.getElementById("tot-proteine").textContent=totaliOggi.proteine.toFixed(1);
    document.getElementById("tot-carboidrati").textContent=totaliOggi.carboidrati.toFixed(1);
    document.getElementById("tot-grassi").textContent=totaliOggi.grassi.toFixed(1);
}

//fetch to get total macros conmsumed by user
fetch(API_URL+"/api/alimenti/oggi/totali",{credentials:"include"}).then(function(risposta){
    if(!risposta.ok)
        return;
    return risposta.json();
}).then(function(dati){
    if(!dati)
        return;
    totaliOggi=dati;
    mostraTotali();
}).catch(function(errore){
    console.log(errore);
})

/* 
this event listener REALLY needs a refactor. It search foods, select a food from a list and adds to user's total.
Bad code, at least 3 different func are needed there but im too lazy to refactor a working code.
if it ain't broke don't fix it! 
*/
const btnCercaCibo=document.getElementById("btn-cerca-cibo");
btnCercaCibo.addEventListener("click",function(){
    const inputCibo=document.getElementById("input-cibo");
    if(inputCibo.value===""||inputCibo.value===" ")
        return;
    fetch(API_URL+"/api/alimenti/nome?q="+encodeURIComponent(inputCibo.value.trim()),{credentials:"include"}).then(function(risposta){
        if(!risposta.ok)
        {
            alert("Errore nella ricerca cibo");
            return;
        }
        return risposta.json();
        }).then(function(risultato){
        if(!risultato)
            return;
        const divRes=document.getElementById("lista-risultato");
        divRes.innerHTML="";
        risultato.forEach(element => {
            const divSingoloCibo=document.createElement("div");
            divSingoloCibo.classList.add("card");
            divSingoloCibo.textContent=element["nome"]+" "+element["marca"];
            divSingoloCibo.style.cursor="pointer";
            divSingoloCibo.addEventListener("click",()=>{
                const formCibo=divSingoloCibo.querySelector(".dettaglio-cibo");
                if(!formCibo){
                    fetch(API_URL+"/api/alimenti/"+element["barcode"],{credentials:"include"}).then(function(risposta){
                        if(!risposta.ok)
                        {
                            alert("Errore nella ricerca cibo");
                            return;
                        }
                        return risposta.json();
                    }).then(function(risultato){
                        if(!risultato)
                            return;
                        const dettaglio=document.createElement("div");
                        dettaglio.classList.add("dettaglio-cibo");
                        dettaglio.addEventListener("click",function(event){
                            event.stopPropagation();
                        });
                        const macro=risultato["macro"];
                        const righe=[
                        "Calorie: "+macro["calorie"]+" kcal",
                        "Proteine: "+macro["proteine"]+" g",
                        "Carboidrati: "+macro["carboidrati"]+" g",
                        "Grassi: "+macro["grassi"]+" g",
                        "Fibre: "+(macro["fibre"]!==null?macro["fibre"]+" g":"n/d")
                        ];
                        righe.forEach((testo)=>{
                            const p=document.createElement("p");
                            p.textContent=testo;
                            dettaglio.appendChild(p);
                        });
                        const inputQuant=document.createElement("input");
                        inputQuant.type="number";
                        inputQuant.placeholder="QUantità (g)";
                        inputQuant.classList.add("input-scheda");

                        const btnAgg=document.createElement("button");
                        btnAgg.classList.add("btn","btn-conferma");
                        btnAgg.textContent="Aggiungi al diario";
                        btnAgg.addEventListener("click",function(){
                            const quant=parseFloat(inputQuant.value);
                            if(!quant||quant<=0)
                            {
                                alert("Inserisci una quantità valida");
                                return;
                            }
                            const macroCalc={
                                calorie:Number((macro["calorie"]*quant/100).toFixed(1)),
                                proteine:Number((macro["proteine"]*quant/100).toFixed(1)),
                                carboidrati:Number((macro["carboidrati"]*quant/100).toFixed(1)),
                                grassi:Number((macro["grassi"]*quant/100).toFixed(1)),
                                fibre:Number((macro["fibre"]*quant/100).toFixed(1)),
                            };
                            fetch(API_URL+"/api/alimenti/diario",{
                                method:"POST",
                                credentials:"include",
                                headers:{"Content-Type":"application/json"},
                                body:JSON.stringify({
                                    nome:risultato["nome"],
                                    marca:risultato["marca"],
                                    barcode:risultato["barcode"],
                                    quantita:quant,
                                    macro:macroCalc
                                })
                            }).then(function(risposta){
                                if(!risposta.ok){
                                    alert("Errore nel salvataggio");
                                    return;
                                }
                                alert("Aggiunto al diario!");
                                totaliOggi.calorie+=macroCalc.calorie;
                                totaliOggi.proteine+=macroCalc.proteine;
                                totaliOggi.carboidrati+=macroCalc.carboidrati;
                                totaliOggi.grassi+=macroCalc.grassi;
                                mostraTotali();
                            }).catch(function(errore){
                                alert("Errore nel salvataggio"+errore);
                            })
                        });
                        const btnAnnullaCibo=document.createElement("button");
                            btnAnnullaCibo.textContent="Annulla";
                            btnAnnullaCibo.classList.add("btn","btn-secondario");
                            btnAnnullaCibo.addEventListener("click",function(){
                                dettaglio.style.display="none";
                                inputQuant.value="";
                        });
                        dettaglio.appendChild(inputQuant);
                        dettaglio.appendChild(btnAgg);
                        dettaglio.appendChild(btnAnnullaCibo);
                        divSingoloCibo.appendChild(dettaglio);
                    }).catch(function(errore){
                        alert("Errore nella ricerca"+errore);
                    })
                }
                else
                {
                    formCibo.style.display=formCibo.style.display==="none"?"block":"none";
                }
            });
            divRes.appendChild(divSingoloCibo);
        });
    }).catch(function(errore){
        alert("Errore nella ricerca cibo "+errore);
    })    
});
