function showModal(element){
    cancel()
    
    if($("#name").value == ""){
        alert("preencha seu nome completo")
        return
    } 
    if(valueTot < 140 ){
        alert("valor minimo de compre é 140R$")
        return
    }
    $("#" + element).style.display = "flex"
}

function resetSaveAndReload(){
    cancel()
    shopping = [{},{},{}]
    descartLocalStore()
    calculate("preçoBase", "#CCBC2D")
    $("#phase").innerHTML = "Tabela R$ 140,00"
}

function showBras(){
    cancel()
    $("#listBras").innerHTML = `
        <li>Peso Total: ${weightTot} Kg</li>
        <li>Numero de caixas: ${Math.ceil(weightTot / 25)}</li>
        <li>Valor total do frete: R$ ${Math.ceil(weightTot / 25) * 30}</li>
    `
    $("#MConfirmBras").style.display = "flex"
}

function confirmPref(){
    if($("#preferredShipping").value){
        transport.mode = $("#preferredShipping").value
    } else {
        alert("preencha qual o sua transportadora de preferencia")
        return
    }
    showModal("MConfirmClient")
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
    if(numero == "" && bairro == "" && cep == "" && cidade == "" && estado == "" && tel == "" && email == "" && address == "" && cpf){
        alert("preencha todas as informações")
        return
    }
    db.collection("client").doc(cpf).get().then((doc)=>{
        if(doc.exists){
            alert("você já tem seu registro ")
            $("#modal").style.display = "none"
        } else {
            db.collection("client").doc(cpf).set({
                name: $("#name").value,
                numero,
                bairro,
                cep,
                cidade,
                estado,
                tel,
                email,
                address,
                cpf
            })
            form += `*CPF*:%20${cpf}%0A*CEP*:%20${cep}`
            showModal("MComplete")
        }
    })
}

function confirmCpf(){
    let confirmCpf = $("#confirmCpf").value
    if(confirmCpf == ""){
        alert("Preencha com o seu Cpf")
        return
    }
    db.collection("client").doc(confirmCpf).get().then((doc)=>{
        if(doc.exists){
            form = `*CPF*:%20${confirmCpf}%0A*CEP*:%20${doc.data().cep}`
            $("#confirmCpf").style.backgroundColor = "#83FF83"
            setTimeout(()=>{
                showModal("MComplete")
            }, 1000)
        } else {
            $("#confirmCpf").style.backgroundColor = "#F54E4C"
            setTimeout(()=>{
                alert("registro não encontrado, tente de novo pelo CNPJ ou CPF")
                showModal("MRegisterError")
            }, 1000)
        }
    })
}

function calcKangu(){
    if($("#kanguCep").value = ""){
        alert("Escreva seu cep para calcularmos")
        return
    }
    fetch(`http://valentecosmeticos.com/api/?cepDestino=${$("#kanguCep").value}&peso=${weightTot}&valor=${valueTot}`).then(res=>res.json()).then((json)=>{
        json.forEach(element => {
            $("#optionsKangu").innerHTML += `<div onclick="handleKangu('${element.transp_nome}', '${element.vlrFrete}')"><h3>${element.transp_nome}</h3><span>R$: ${element.vlrFrete}</span></div>`
        });
        showModal("MSelectKangu")
    })
}

function handleKangu(name, value){
    transport.mode = name
    transport.transportValue  = value
    transport.totValue = (valueTot + value)
    cancel()
    showBonus()
}

function showBonus(){
    showModal("MBonus")
    if(transport.transportValue >= 35 && transport.transportValue <= 65){
        $("#optionsBonus").innerHTML = `
        <input type="button" value="1 Minoxiplus 15% 120ML" onclick="saveBonus('1%20Minoxiplus%2015%%20120ML')"/>
        <input type="button" value="1 Minoxiplus 15% 60ML" onclick="saveBonus('1%20Minoxiplus%2015%%2060ML')"/>
        <input type="button" value="1 Minoxiplus 8% 60ML" onclick="saveBonus('1%20Minoxiplus%208%%2060ML')"/>
        <input type="button" value="1 Pomada em pó" onclick="saveBonus('1%20Pomada%20em%20pó')"/>
        `
    }
    if(transport.transportValue > 65 && transport.transportValue <= 100){
        $("#optionsBonus").innerHTML = `
        <input type="button" value="2 Minoxiplus 15% 120ML" onclick="saveBonus('2%20Minoxiplus%2015%%20120ML')"/>
        <input type="button" value="2 Minoxiplus 15% 60ML" onclick="saveBonus('2%20Minoxiplus%2015%%2060ML')"/>
        <input type="button" value="2 Minoxiplus 8% 60ML" onclick="saveBonus('2%20Minoxiplus%208%%2060ML')"/>
        <input type="button" value="2 Pomada em pó" onclick="saveBonus('2%20Pomada%20em%20pó')"/>
        `
    }
    if(transport.transportValue > 100 && transport.transportValue <= 180){
        $("#optionsBonus").innerHTML = `
        <input type="button" value="3 Minoxiplus 15% 120ML" onclick="saveBonus('3%20Minoxiplus%2015%%20120ML')"/>
        <input type="button" value="3 Minoxiplus 15% 60ML" onclick="saveBonus('3%20Minoxiplus%2015%%2060ML')"/>
        <input type="button" value="3 Minoxiplus 8% 60ML" onclick="saveBonus('3%20Minoxiplus%208%%2060ML')"/>
        <input type="button" value="3 Pomada em pó" onclick="saveBonus('3%20Pomada%20em%20pó')"/>
        `
    }
}

function saveBonus(text){
    bonus = `%0A*Bonificação*:%20${text}`
    showModal("MConfirmClient")
}






