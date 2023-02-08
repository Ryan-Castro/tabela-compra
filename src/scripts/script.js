let objPerValue = {}
let objPerUnit = {}
let shopping = [{},{}]
let tProd = $("#tableProduct")
let tProdH = tProd.children[0]
let tProdB = tProd.children[1]
let tProdF = tProd.children[2]
let valueTot = 0  
let weightTot = 0 
let form = ""
let basePriceArrey = [
    {base:"preço300", min:300, before:"preçoBase", title:"Tabala R$ 300,00", color:"orange"}, 
    {base:"preço600", min:600, before:"preço300", title:"Tabala R$ 600,00", color:"rgb(46, 255, 46)"}, 
    {base:"preço1500", min:1500, before:"preço600", title:"Tabala R$ 1500,00", color:"cyan"}
]
let categoriesPerValue = [ 
    "Pomadas Modeladoras 150gr", 
    "Pomadas Modeladoras 80gr", 
    "Pomadas Modeladoras 25gr",
    "Gel",
    "Barba",
    "Linha MENTA e TEA TREE",
    "Progressivas",
    "Kit linha perfime SH, Cond, Balm e óleo",
    "Shampo Perfume",
    "Condicionador Perfume",
    "Balm Perfume",
    "óleo Perfume"
]
let categoriesPerUnit = [
    "Minoxidil",
    "Perfume Tradicional",
    "Perfime para barba com Minoxidil"
]
let tHeadPerValue = `
    <tr>
        <td colspan="6" class="center">
            <h1>Produtos Por preço</h1>
        </td>
    </tr>   
    <tr class="lable">
        <th>codigo</th>
        <th>Nome do produto</th>
        <th>Quantidade</th>
        <th class="price" colspan="2">V. unid</th>
        <th class="price">V. Total</th>
    </tr>`

let tHeadPerUnit = `
    <tr>
        <td colspan="6" class="center">
            <h1>Produtos Por Unidade</h1>
        </td>
    </tr> 
    <tr class="lable">
        <th>código</th>
        <th>Nome do produto</th>
        <th>Quantidade</th>
        <th>V. min</th>
        <th>V. unid</th>
        <th>V. Total</th>
    </tr>`

async function init(){
    await getItemsPerValue()
    await getItemsPerUnit()
    listing()
}

async function getItemsPerValue(){
    await db.collection("produtos").get().then((snapshot)=>{
        snapshot.forEach(async doc=>{
            objPerValue[doc.id] = doc.data()
        })
    })
} 
async function getItemsPerUnit(){
    await db.collection("perUnit").get().then((snapshot)=>{
        snapshot.forEach(async doc=>{
            objPerUnit[doc.id] = doc.data()
        })
    })
} 
function listing(){
    tProdB.innerHTML = tHeadPerValue
    categoriesPerValue.forEach((category)=>{
        tProdB.innerHTML += `   <tr>
                                    <td colspan="6" class="category">${category}</td>
                                </tr>`
        Object.keys(objPerValue).forEach((produto, i)=>{
            if(objPerValue[produto].category == category){
                tProdB.innerHTML += `<tr id="item-${produto}">
                                        <td>${objPerValue[produto].id}</td>
                                        <td>${objPerValue[produto].name}</td>
                                        <td class="tdInput"><input type="number" onInput="updateItemPerValue('${produto}')" min="0" value="${shopping[0][produto]?shopping[0][produto]:''}"/></td>
                                        <td class="price" colspan="2">${objPerValue[produto].preçoBase.toFixed(2)}</td>
                                        <td class="price"></td>
                                    </tr>`
            }
        })
    })
    tProdB.innerHTML += tHeadPerUnit
    categoriesPerUnit.forEach((category)=>{
        tProdB.innerHTML += `   <tr>
                                    <td colspan="6" class="category">${category}</td>
                                </tr>`
        Object.keys(objPerUnit).forEach((produto, i)=>{
           if(objPerUnit[produto].category == category){
            tProdB.innerHTML += `<tr id="item-${produto}">
                                    <td>${objPerUnit[produto].id}</td>
                                    <td>${objPerUnit[produto].name}</td>
                                    <td class="tdInput"><input type="number" onInput="updateItemPerUnit('${produto}')" min="${objPerUnit[produto].amount[0].min}" value="${shopping[1][produto]?shopping[1][produto]:''}"/></td>
                                    <td>${objPerUnit[produto].amount[0].min}</td>
                                    <td>${objPerUnit[produto].amount[0].price}</td>
                                    <td></td>
                                </tr>` }
        })

    })
}



function updateItemPerValue(id){
    shopping[0][id] = $(`#item-${id}`).children[2].children[0].value
    $("#phase").innerHTML = "Tabala R$ 140,00"
    calculate("preçoBase", "rgb(255, 255, 96)")
}
function updateItemPerUnit(id){
    shopping[1][id] = $(`#item-${id}`).children[2].children[0].value
    $("#phase").innerHTML = "Tabala R$ 140,00"
    calculate("preçoBase", "rgb(255, 255, 96)")
}

function calculate(basePrice, color){
    valueTot = Number(calculatePerValue(basePrice))     
    valueTot += Number(calculatePerUnit())    
    weightTot = Number(calculateWeight())
    Object.keys(objPerValue).forEach((produto, i)=>{
        if($(`#item-${produto}`))
        $(`#item-${produto}`).children[3].innerHTML = objPerValue[produto][basePrice].toFixed(2) 
    })
    $(`#soma`).innerHTML = `R$: ${valueTot.toFixed(2)}`
    $(`#weight`).innerHTML = `Kg: ${weightTot.toFixed(3)}`
    document.querySelectorAll(".price").forEach(element=>{
        element.style.backgroundColor = color
    })
    if(basePrice != "preço1500"){
        checkPriceBase(basePrice)
    }
}
function calculatePerValue(basePrice){
    let valueReturn = 0
    Object.keys(shopping[0]).forEach((id)=>{
        let value = objPerValue[id][basePrice] * shopping[0][id]
        valueReturn += Number(value)
        $(`#item-${id}`).children[4].innerHTML = value.toFixed(2) 
    })
    return valueReturn
}

function calculatePerUnit(){
    let valueReturn = 0
    Object.keys(shopping[1]).forEach((id)=>{
        let value = 0
        objPerUnit[id].amount.forEach(breakPoint=>{
            if(breakPoint.min<=shopping[1][id]){
                value = (breakPoint.price * shopping[1][id]).toFixed(2)
                if($(`#item-${id}`)){
                    $(`#item-${id}`).children[3].innerHTML = breakPoint.min
                    $(`#item-${id}`).children[4].innerHTML = breakPoint.price
                    $(`#item-${id}`).children[5].innerHTML = value
                }
            }
        })
        valueReturn += Number(value)
    })
    return valueReturn
}
function calculateWeight(){
    let valueReturn = 0
    Object.keys(shopping[0]).forEach((id)=>{
        let value = objPerValue[id]['weight'] * shopping[0][id]
        valueReturn += Number(value)
    })
    Object.keys(shopping[1]).forEach((id)=>{
        let value = objPerUnit[id]['weight'] * shopping[1][id]
        valueReturn += Number(value)
    })
    return valueReturn
}

function checkPriceBase(basePrice){
    basePriceArrey.forEach(baseObj=>{
        let valueCalc = 0
        Object.keys(shopping[0]).forEach((id)=>{
            let value = objPerValue[id][baseObj.base] * shopping[0][id]
            valueCalc += value
        })   
        Object.keys(shopping[1]).forEach((id)=>{
            let value = 0
            objPerUnit[id].amount.forEach(breakPoint=>{
                if(breakPoint.min<=shopping[1][id]){
                    value = (breakPoint.price * shopping[1][id]).toFixed(2)
                }
            })
            valueCalc += Number(value)
        })
        if(valueCalc >= baseObj.min && basePrice == baseObj.before){
            $("#phase").innerHTML = baseObj.title
            calculate(baseObj.base, baseObj.color)
        }
    })
}

function searchItem(){
    tProdB.innerHTML = tHeadPerValue
    Object.keys(objPerValue).forEach(item=>{
        if(objPerValue[item].name.toLowerCase().includes($('#search').value.toLowerCase())){
            tProdB.innerHTML += `
                        <tr id="item-${item}">
                            <td>${objPerValue[item].id}</td>
                            <td>${objPerValue[item].name}</td>
                            <td class="tdInput"><input type="number" onInput="updateItemPerValue('${item}')" min="0" value="${shopping[0][item]?shopping[0][item]:''}"/></td>
                            <td class="price" colspan="2">${objPerValue[item].preçoBase.toFixed(2)}</td>
                            <td class="price"></td>
                        </tr>`
        }
    })
    tProdB.innerHTML += tHeadPerUnit
    Object.keys(objPerUnit).forEach(item=>{
        if(objPerUnit[item].name.toLowerCase().includes($('#search').value.toLowerCase())){
            tProdB.innerHTML += `<tr id="item-${item}">
                <td>${objPerUnit[item].id}</td>
                <td>${objPerUnit[item].name}</td>
                <td class="tdInput"><input type="number" onInput="updateItemPerUnit('${item}')" min="${objPerUnit[item].amount[0].min}" value="${shopping[1][item]?shopping[1][item]:''}"/></td>
                <td>${objPerUnit[item].amount[0].min}</td>
                <td>${objPerUnit[item].amount[0].price}</td>
                <td></td>
            </tr>` 
            }
        })
    if($('#search').value == ""){
        listing()
    }
    calculate("preçoBase", "rgb(255, 255, 96)")
}

function check(){
    let register = $("input[name='register']:checked").value
    let name = $("#name").value
    if(name == ""){
        alert("preencha seus dados")
        return
    } 
    if(valueTot < 140 ){
        alert("valor minimo de compre é 140R$")
        return
    }
    if(register == "não"){
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
    let address = $("#address").value
    let cpf = $("#cpf").value
    form = `*Numero*:%20${numero}%0A*Bairro*:%20${bairro}%0A*Cep*:%20${cep}%0A*Cidade*:%20${cidade}%0A*Estado*:%20${estado}%0A*Tel*:%20${tel}%0A*Email*:%20${email}%0A*Endereço*:%20${address}%0A*CPF/CNPJ*:%20${cpf}%0A`
    enviar()
}


function enviar(){
    let register = $("input[name='register']:checked").value
    let name = $("#name").value
    let shopp = ""
    let payment = $("#payment").options[$("#payment").selectedIndex].value
    Object.keys(shopping[0]).forEach((id)=>{
        if(shopping[0][id]>0)
        shopp += `*${objPerValue[id].name}*: ${shopping[0][id]} %0A`
    })
    Object.keys(shopping[1]).forEach((id)=>{
        if(shopping[1][id]>0)
        shopp += `*${objPerUnit[id].name}*: ${shopping[1][id]} %0A`
    })
    location.href = `
                    https://wa.me/5551998116453?text=*Novo%20Pedido*%0A------------------------------%0A%0A*Nome*:%20${name.replaceAll(" ", "%20")}%0A*J%C3%A1%20%C3%A9%20cadastrado*:%20${register}%0A${form}%0A------------------------------%0AProdutos:%0A%0A${shopp.replaceAll(" ", "%20")}%0A------------------------------%0A%0A*Valor%20Total%20Sem%20o%20Frete*:%20R$${valueTot.toString().replace(".", ",")}%0A*Peso%20Total*:%20${weightTot.toString().replace(".", ",")}Kg%0AForma%20de%20Pagamento:%20${payment}%0A
                        `
}

init()


