let produtos = {}
let compras = {}
let tProd = $("#tableProduct")
let tProdH = tProd.children[0]
let tProdB = tProd.children[1]
let tProdF = tProd.children[2]
let valorTotal = 0  
let pesoTot = 0 
let formulario = ""



async function init(){
    await db.collection("produtos").get().then((snapshot)=>{
        snapshot.forEach(async doc=>{
            produtos[doc.id] = doc.data()
        })
        Object.keys(produtos).forEach((produto, i)=>{
            tProdB.innerHTML += `<tr id="item-${produto}">
                                    <td>${i+1}</td>
                                    <td>${produtos[produto].nome}</td>
                                    <td class="tdInput"><input type="number" onInput="update('${produto}', ${i})" min="0"/></td>
                                    <td>${produtos[produto].preçoBase.toFixed(2)}</td>
                                    <td></td>
                                </tr>`
        })
    })
}



function update(id, i){
    compras[id] = $(`#item-${id}`).children[2].children[0].value
    $("#phase").innerHTML = "Tabala R$ 140,00"
    calcular("preçoBase")
}

function calcular(preço){
    valorTotal = 0     
    pesoTot = 0 
    Object.keys(compras).forEach((id, i)=>{
        let valor = produtos[id][preço] * compras[id]
        let peso = produtos[id]["peso"] * compras[id]
        valorTotal += valor
        pesoTot += (peso/1000)
        $(`#item-${id}`).children[4].innerHTML = valor.toFixed(2) 
    })
    Object.keys(produtos).forEach((produto, i)=>{
        $(`#item-${produto}`).children[3].innerHTML = produtos[produto][preço].toFixed(2) 
    })
    $(`#soma`).innerHTML = `R$: ${valorTotal.toFixed(2)}`
    $(`#peso`).innerHTML = `Kg: ${pesoTot.toFixed(2)}`
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

function check(){
    let cadastro = $("input[name='register']:checked").value
    let name = $("#name").value
    let address = $("#address").value
    if(name == "" || address == ""){
        alert("preencha seus dados")
        return
    } 
    if(valorTotal < 140 ){
        alert("valor minimo de compre é 140R$")
        return
    }
    if(cadastro == "não"){
        $("#modal").style.display = "flex"
        return
    }

    enviar()

}

function createCadastro(){
    let numero  = $("#numero").value
    let bairro  = $("#bairro").value
    let cep = $("#cep").value
    let cidade  = $("#cidade").value
    let estado  = $("#estado").value
    let tel = $("#tel").value
    let email = $("#email").value
    formulario = `*Numero*:%20${numero}%0A*Bairro*:%20${bairro}%0A*Cep*:%20${cep}%0A*Cidade*:%20${cidade}%0A*Estado*:%20${estado}%0A*Tel*:%20${tel}%0A*Email*:%20${email}%0A`
    enviar(formulario)
}


function enviar(formulario){
    let cadastro = $("input[name='register']:checked").value
    let name = $("#name").value
    let address = $("#address").value
    let pedido = ""
    Object.keys(compras).forEach((id)=>{
        pedido += `*${produtos[id].nome}*: ${compras[id]} %0A`
    })
    location.href = `
                    https://wa.me/5551998116453?text=*Novo%20Pedido*%0A------------------------------%0A%0A*Nome*:%20${name.replaceAll(" ", "%20")}%0A*Endere%C3%A7o*:%20${address.replaceAll(" ", "%20")}%0A*J%C3%A1%20%C3%A9%20cadastrado*:%20${cadastro}%0A${formulario}%0A------------------------------%0AProdutos:%0A%0A${pedido.replaceAll(" ", "%20")}%0A------------------------------%0A%0A*Valor%20Total%20Sem%20o%20Frete*:%20R$${valorTotal.toString().replace(".", ",")}%0A*Peso%20Total*:%20${pesoTot.toString().replace(".", ",")}Kg%0AForma%20de%20Pagamento:%20PIX%0A
                        `
}

init()


