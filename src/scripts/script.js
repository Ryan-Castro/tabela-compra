let objPerValue = {}
let objPerUnit = {}
let shopping = [{},{},{}]
let tProd = $("#tableProduct")
let tProdH = tProd.children[0]
let tProdB = tProd.children[1]
let tProdF = tProd.children[2]
let valueTot = 0  
let weightTot = 0 
let form = ""
let bonus = ""
let transport = {mode:"", transportValue: "", totValue: "", box: ""}
let basePriceArrey = [
    {base:"preço300", min:300, before:"preçoBase", title:"Tabela R$ 300,00", color:"#2296D3"}, 
    {base:"preço600", min:600, before:"preço300", title:"Tabela R$ 600,00", color:"#3A917E"}, 
    {base:"preço1500", min:1500, before:"preço600", title:"Tabela R$ 1500,00", color:"#6155FF"}
]

let categoriesPerValue = [
    "Pomadas Modeladoras 150gr",
    "Pomadas Modeladoras 80gr",
    "Pomadas Modeladoras 25gr",
    "Gel",
    "Barba",
    "Linha MENTA e TEA TREE",
    "Progressivas",
    "Kit linha perfume SH, Cond, Balm e óleo",
    "Shampo Perfume",
    "Condicionador Perfume",
    "Balm Perfume 150Gr",
    "Balm Perfume 80Gr",
    "Óleo Perfume"
]

let categoriesPerUnit = [
    "Perfume Tradicional",
    "Perfume para barba com Minoxiplus"
]
let tHeadPerValue = `
    <tr>
        <td colspan="6" class="center">
            <h1>Produtos Por preço</h1>
        </td>
    </tr>   
    <tr class="lable">
        <th>código</th>
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
    if(localStorage.getItem("shopping")){
        $("#MSave").style.display = "flex"
    }
    listing()
}
function saveLocalStore(){
    $("#MSave").style.display = "none"
    shopping = JSON.parse(localStorage.getItem("shopping"))
    listing()
    calculate("preçoBase", "#CCBC2D")
}
function descartLocalStore(){
    $("#MSave").style.display = "none"
    localStorage.removeItem("shopping")
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
                                        <td class="tdInput"><input type="number" onInput="update('${produto}', 0)" min="0" value="${shopping[0][produto]?shopping[0][produto].unit:''}"/></td>
                                        <td class="price" colspan="2">${objPerValue[produto].preçoBase.toFixed(2).replace(".", ",")}</td>
                                        <td class="price"></td>
                                    </tr>`
            }
        })
    })
    tProdB.innerHTML += tHeadPerUnit
    tProdB.innerHTML += `   <tr>
                                <td colspan="6" class="category">Minoxiplus</td>
                            </tr>`
    Object.keys(objPerUnit).forEach((produto, i)=>{
        if(objPerUnit[produto].category == "Minoxiplus"){
        tProdB.innerHTML += `<tr id="item-${produto}">
                                <td>${objPerUnit[produto].id}</td>
                                <td>${objPerUnit[produto].name}</td>
                                <td class="tdInput"><input type="number" onInput="update('${produto}', 1)" min="${objPerUnit[produto].amount[0].min}" value="${shopping[1][produto]?shopping[1][produto].unit:''}"/></td>
                                <td>${objPerUnit[produto].amount[0].min}</td>
                                <td>${objPerUnit[produto].amount[0].price.toFixed(2).replace(".", ",")}</td>
                                <td></td>
                            </tr>` }
    })
    categoriesPerUnit.forEach((category)=>{
        tProdB.innerHTML += `   <tr>
                                    <td colspan="3" class="category">${category}</td>
                                    <td class="category">Quan.</td>
                                    <td colspan="2" class="category" id="amountPerfume">0</td>
                                </tr>`
        Object.keys(objPerUnit).forEach((produto, i)=>{
            if(objPerUnit[produto].category == category){
                tProdB.innerHTML += `<tr id="item-${produto}">
                                        <td>${objPerUnit[produto].id}</td>
                                        <td>${objPerUnit[produto].name}</td>
                                        <td class="tdInput"><input type="number" onInput="update('${produto}', 2)" min="${objPerUnit[produto].amount[0].min}" value="${shopping[2][produto]?shopping[2][produto].unit:''}"/></td>
                                        <td>${objPerUnit[produto].amount[0].min}</td>
                                        <td>${objPerUnit[produto].amount[0].price.toFixed(2).replace(".", ",")}</td>
                                        <td></td>
                                    </tr>` 
            }
        })
    })
}



function update(id, numArrey){
    shopping[numArrey][id] = {unit: $(`#item-${id}`).children[2].children[0].value}
    localStorage.setItem("shopping", JSON.stringify(shopping))
    $("#phase").innerHTML = "Tabela R$ 140,00"
    calculate("preçoBase", "#CCBC2D")
}


function calculate(basePrice, color){
    valueTot = Number(calculatePerValue(basePrice))     
    valueTot += Number(calculatePerUnit())    
    valueTot += Number(calculatePerfume())    
    weightTot = Number(calculateWeight())
    Object.keys(objPerValue).forEach((produto, i)=>{
        if($(`#item-${produto}`))
        $(`#item-${produto}`).children[3].innerHTML = objPerValue[produto][basePrice].toFixed(2).replace(".", ",") 
    })
    $(`#soma`).innerHTML = `R$: ${valueTot.toFixed(2).replace(".", ",") }`
    $('#TDemand').innerHTML = `Total da sua compra sem o frete R$: ${valueTot.toFixed(2).replace(".", ",") }`
    $(`#weight`).innerHTML = `Kg: ${weightTot.toFixed(3).replace(".", ",") }`
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
        let value = objPerValue[id][basePrice] * shopping[0][id].unit
        shopping[0][id].price = value
        valueReturn += Number(value)
        $(`#item-${id}`).children[4].innerHTML = value.toFixed(2).replace(".", ",") 
    })
    return valueReturn
}

function calculatePerUnit(){
    let valueReturn = 0
    Object.keys(shopping[1]).forEach((id)=>{
        let value = 0
        objPerUnit[id].amount.forEach(breakPoint=>{
            if(breakPoint.min<=shopping[1][id].unit){
                value = (breakPoint.price * shopping[1][id].unit).toFixed(2)
                shopping[1][id].price = value
                if($(`#item-${id}`)){
                    $(`#item-${id}`).children[3].innerHTML = breakPoint.min
                    $(`#item-${id}`).children[4].innerHTML = breakPoint.price.toFixed(2).replace(".", ",") 
                    $(`#item-${id}`).children[5].innerHTML = Number(value).toFixed(2).replace(".", ",") 
                }
            }
        })
        valueReturn += Number(value)
    })
    return valueReturn
}

function calculatePerfume(){
    let valueReturn = 0
    let amountPerfume = 0
    Object.keys(shopping[2]).forEach((id)=>{
        amountPerfume += Number(shopping[2][id].unit)
    })
    Object.keys(shopping[2]).forEach((id)=>{
        let value = 0
        objPerUnit[id].amount.forEach(breakPoint=>{
            if(breakPoint.min<=amountPerfume){
                value = (breakPoint.price * shopping[2][id].unit).toFixed(2)
                shopping[2][id].price = value
                if($(`#item-${id}`)){
                    $(`#item-${id}`).children[3].innerHTML = breakPoint.min
                    $(`#item-${id}`).children[4].innerHTML = breakPoint.price.toFixed(2).replace(".", ",") 
                    $(`#item-${id}`).children[5].innerHTML = Number(value).toFixed(2).replace(".", ",") 
                }
            }
        })
        valueReturn += Number(value)
    })
    document.querySelectorAll("#amountPerfume").forEach(element=>{
        element.innerHTML= amountPerfume
    })
    return valueReturn
}
function calculateWeight(){
    let valueReturn = 0
    Object.keys(shopping[0]).forEach((id)=>{
        let value = objPerValue[id]['weight'] * shopping[0][id].unit
        valueReturn += Number(value)
    })
    Object.keys(shopping[1]).forEach((id)=>{
        let value = objPerUnit[id]['weight'] * shopping[1][id].unit
        valueReturn += Number(value)
    })
    Object.keys(shopping[2]).forEach((id)=>{
        let value = objPerUnit[id]['weight'] * shopping[2][id].unit
        valueReturn += Number(value)
    })
    return valueReturn
}

function checkPriceBase(basePrice){
    basePriceArrey.forEach(baseObj=>{
        let valueCalc = 0
        Object.keys(shopping[0]).forEach((id)=>{
            let value = objPerValue[id][baseObj.base] * shopping[0][id].unit
            valueCalc += value
        })   
        Object.keys(shopping[1]).forEach((id)=>{
            let value = 0
            objPerUnit[id].amount.forEach(breakPoint=>{
                if(breakPoint.min<=shopping[1][id].unit){
                    value = (breakPoint.price * shopping[1][id].unit).toFixed(2)
                }
            })
            valueCalc += Number(value)
        })
        let amountPerfume = 0
        Object.keys(shopping[2]).forEach((id)=>{
            amountPerfume += Number(shopping[2][id].unit)
        })
        Object.keys(shopping[2]).forEach((id)=>{
            let value = 0
            objPerUnit[id].amount.forEach(breakPoint=>{
                if(breakPoint.min<=amountPerfume){
                    value = (breakPoint.price * shopping[2][id].unit).toFixed(2)
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
                            <td class="tdInput"><input type="number" onInput="update('${item}', 0)" min="0" value="${shopping[0][item]?shopping[0][item].unit:''}"/></td>
                            <td class="price" colspan="2">${objPerValue[item].preçoBase.toFixed(2)}</td>
                            <td class="price"></td>
                        </tr>`
        }
    })
    tProdB.innerHTML += tHeadPerUnit
    
    Object.keys(objPerUnit).forEach(item=>{
        if(objPerUnit[item].name.toLowerCase().includes($('#search').value.toLowerCase())){
            if(objPerUnit[item].category == "Minoxiplus"){
                tProdB.innerHTML += `<tr id="item-${item}">
                                        <td>${objPerUnit[item].id}</td>
                                        <td>${objPerUnit[item].name}</td>
                                        <td class="tdInput"><input type="number" onInput="update('${item}', 1)" min="${objPerUnit[item].amount[0].min}" value="${shopping[1][item]?shopping[1][item].unit:''}"/></td>
                                        <td>${objPerUnit[item].amount[0].min}</td>
                                        <td>${objPerUnit[item].amount[0].price}</td>
                                        <td></td>
                                    </tr>` 
            }
        }
    })
    categoriesPerUnit.forEach((category)=>{
        Object.keys(objPerUnit).forEach((item, i)=>{
            if(objPerUnit[item].name.toLowerCase().includes($('#search').value.toLowerCase())){
                if(objPerUnit[item].category == category){
                    tProdB.innerHTML += `<tr id="item-${item}">
                                            <td>${objPerUnit[item].id}</td>
                                            <td>${objPerUnit[item].name}</td>
                                            <td class="tdInput"><input type="number" onInput="update('${item}', 2)" min="${objPerUnit[item].amount[0].min}" value="${shopping[2][item]?shopping[2][item].unit:''}"/></td>
                                            <td>${objPerUnit[item].amount[0].min}</td>
                                            <td>${objPerUnit[item].amount[0].price}</td>
                                            <td></td>
                                        </tr>` 
                }
            }
        })
    })
    if($('#search').value == ""){
        listing()
    }
    calculate("preçoBase", "rgb(255, 255, 96)")
}

function check(){
    let select = $("#shippingMode")
    let selected = select.options[select.selectedIndex].value
    switch (selected) {
        case "Calcular": 
            if(weightTot<30){
                showModal("MConfirmKangu"); 
            } else {
                showModal("MConfirmClient"); 
                alert("Peso maior de 30Kg, iremos fazer isso manualmente")
                transport.mode = "kangu"
                transport.transportValue  = "(vamos calcular)"
                transport.totValue = "(vamos calcular)"
            }
            break;
        case "Preferencia": 
            showModal("MPreferredShipping");
            transport.transportValue = "(vamos calcular)"
            transport.totValue  = "(vamos calcular)"
            bonus = "%0A*Bonificação*:%20(vamos combinar)"
            break;
        case "bras": 
            showBras();
            transport.mode = "Ônibus Bras"
            transport.transportValue = `R$ ${Math.ceil(weightTot / 25) * 30}`
            transport.totValue = `R$ ${Number(Math.ceil(weightTot / 25) * 30) + valueTot}`
            transport.box = `%0A*Número%20de%20caixas*:%20${Math.ceil(Math.ceil(weightTot) / 25)}`
            break;
        default:
            break;
    }
}

function enviar(){
    let name = $("#name").value
    let shopp = ""
    let payment = $("#payment").options[$("#payment").selectedIndex].value
    let data = new Date()
    let day = data.getDate().toString();
    let dayF = (day.length == 1) ? '0'+day : day;
    let month  = (data.getMonth()+1).toString();
    let monthF = (month.length == 1) ? '0'+month : month;
    let yearF = data.getFullYear();
    let obs = ""
    if($("#textOBS").value != ""){
        obs = `%0A*Observação*:%20${$("#textOBS").value}`
    }
    Object.keys(shopping[0]).forEach((id)=>{
        if(shopping[0][id].unit>0)
        shopp += `COD: (${objPerValue[id].id}) ${objPerValue[id].name} %0A     Valor Unid R$: *${Number(shopping[0][id].price/shopping[0][id].unit).toFixed(2)}* Quantidade: *${shopping[0][id].unit}*%0A     Tot: *R$ ${Number(shopping[0][id].price).toFixed(2).replace(".", ",")}*%0A`
    })
    Object.keys(shopping[1]).forEach((id)=>{
        if(shopping[1][id].unit>0)
        shopp += `COD:(${objPerUnit[id].id}) ${objPerUnit[id].name} %0A     Valorr Unid R$: *${Number(shopping[1][id].price/shopping[1][id].unit).toFixed(2)}* Quantidade: *${shopping[1][id].unit}*%0A     Tot: *R$ ${Number(shopping[1][id].price).toFixed(2).replace(".", ",")}*%0A`
    })
    Object.keys(shopping[2]).forEach((id)=>{
        if(shopping[2][id].unit>0)
        shopp += `COD:(${objPerUnit[id].id}) ${objPerUnit[id].name} %0A     Valorr Unid R$: *${Number(shopping[2][id].price/shopping[2][id].unit).toFixed(2)}* Quantidade: *${shopping[2][id].unit}*%0A     Tot: *R$ ${Number(shopping[2][id].price).toFixed(2).replace(".", ",")}*%0A`
    })
    location.href = `
                    https://wa.me/5511969784323?text=*Esse%20é%20meu%20pedido*%0A------------------------------%0A%0A*Data*:%20${dayF}%20/%20${monthF}%20/%20${yearF}%0A*Nome*:%20${name.replaceAll(" ", "%20")}%0A${form}%0A*Envio%20via*:%20${transport.mode}${transport.box}%0A*Valor%20do%20frete*:%20${transport.transportValue}${obs}%0A------------------------------%0AProdutos:%0A%0A${shopp.replaceAll(" ", "%20")}%0A------------------------------%0A%0APeso%20Total:%20*${weightTot.toFixed(2).toString().replace(".", ",")}Kg*%0AForma%20de%20Pagamento:%20*${payment}*%0AValor%20Total%20Sem%20o%20Frete:%20*R$${valueTot.toFixed(2).toString().replace(".", ",")}*%0AValor%20do%20frete%20:%20${transport.transportValue}%0ATotal%20:%20${transport.totValue}%0A${bonus}%0A
                        `
}

init()


