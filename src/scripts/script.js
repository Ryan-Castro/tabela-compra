let produtos = {}
let compras = {}
let table = $("table")
let tableHeader = table.children[0]
let tableBody   = table.children[1]
let tableFooter = table.children[2]  



async function init(){
    await db.collection("produtos").get().then((snapshot)=>{
        snapshot.forEach(async doc=>{
            produtos[doc.id] = doc.data()
        })
        Object.keys(produtos).forEach((produto, i)=>{
            tableBody.innerHTML += `<tr id="item-${produto}">
                                        <td>${i+1}</td>
                                        <td>${produtos[produto].nome}</td>
                                        <td><input type="number" onInput="update('${produto}', ${i})"/></td>
                                        <td>${produtos[produto].preçoBase.toFixed(2)}</td>
                                        <td></td>
                                    </tr>`
        })
    })
}



tableFooter.innerHTML += `  <tr>
                                <td colspan="4">Total</td>
                                <td id="soma">R$: 0</td>
                            </tr>`



function update(id, i){
    compras[id] = $(`#item-${id}`).children[2].children[0].value
    $("#phase").innerHTML = "Tabala R$ 140,00"
    calcular("preçoBase")
}

function calcular(preço){
    valorTotal = 0   
    Object.keys(compras).forEach((id, i)=>{
        let valor = produtos[id][preço] * compras[id]
        valorTotal += valor
        $(`#item-${id}`).children[4].innerHTML = valor.toFixed(2) 
    })
  /*   for(let c = 0; c < tableBody.children.length; c++){
        $(`#item-${c}`).children[3].innerHTML = produtos[c][preço].toFixed(2)
    } */
    $(`#soma`).innerHTML = valorTotal.toFixed(2)
    if(valorTotal >= 300 && preço == "preçoBase"){
        $("#phase").innerHTML = "Tabala R$ 300,00"
        calcular("preço300")
    }
    if(valorTotal >= 600 && preço == "preço300"){
        $("#phase").innerHTML = "Tabala R$ 600,00"
        calcular("preço600")
    }
    if(valorTotal >= 1500 && preço == "preço600"){
        $("#phase").innerHTML = "Tabala R$ 1500,00"
        calcular("preço1500")
    }
}


function gerar(){
    console.log("sendo gerado o pedido")
    db.collection("compras").add(compras).then((doc)=>{
        $("#res").innerHTML = "seu pedido foi bem sucedido"
        setTimeout(()=>{
            location = `/src/pages/compra.html?id=${doc.id}`
        },3000)
    })
}

init()