let query = location.search.slice(4)
let produtos = {}
valorTotal = 0 
let base = "preçoBase"
let pesoTotal = 0

function init(){
    db.collection("produtos").get().then((snapshot)=>{
        snapshot.forEach(async doc=>{
            produtos[doc.id] = doc.data()
        })
    })
    db.collection("compras").doc(query).get().then((snapshot)=>{
        Object.keys(snapshot.data()).forEach(element => {
            calcular("preçoBase", snapshot.data())
            $("#produtos").innerHTML += `
                <tr>
                    <td>${produtos[element].nome}</td>
                    <td>${snapshot.data()[element]}</td>
                    <td>R$: ${produtos[element][base]}</td>
                    <td>${(snapshot.data()[element] * produtos[element][base]).toFixed(2)}</td>
                </tr>
            `
            calcularPeso(snapshot.data())
        })
        
        $("#totalPreço").innerHTML = "R$: " + (valorTotal + 130).toFixed(2)
        $("#totalPeso").innerHTML = (pesoTotal/1000).toFixed(3)
    })
}

init()

function calcular(preço, carrinho){
    valorTotal = 0
    Object.keys(carrinho).forEach((id)=>{
        let valor = produtos[id][preço] * carrinho[id]
        valorTotal += valor
    })
    if(valorTotal >= 300 && preço == "preçoBase"){
        $("#phase").innerHTML = "Tabala R$ 300,00"
        calcular("preço300", carrinho)
        base = "preço300"
    }
    if(valorTotal >= 600 && preço == "preço300"){
        $("#phase").innerHTML = "Tabala R$ 600,00"
        calcular("preço600", carrinho)
        base = "preço600"
    }
    if(valorTotal >= 1500 && preço == "preço600"){
        $("#phase").innerHTML = "Tabala R$ 1500,00"
        calcular("preço1500", carrinho)
        base = "preço1500"
    }
}
function calcularPeso(quantidade){
    pesoTotal = 0
    Object.keys(quantidade).forEach(element => {
        pesoTotal += produtos[element].peso * quantidade[element]
    })
}

function enviar(){
    location = `http://wa.me/5551998116453?text=acesse%20esse%20site%20para%20ver%20o%20pedido:$20https://ryan-castro.github.io/tabela-compra/src/pages/compra.html?id=${query}`
}