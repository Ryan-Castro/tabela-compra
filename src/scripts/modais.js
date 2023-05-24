function showModal(element){
    cancel()
    
    if($("#name").value == ""){
        alert("preencha seus dados")
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
        <li>Peso Total: ${Math.ceil(weightTot)} Kg</li>
        <li>Numero de caixas: ${Math.ceil(Math.ceil(weightTot) / 25)}</li>
        <li>Valor total do frete: R$ ${Math.ceil(Math.ceil(weightTot) / 25) * 30}</li>
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
            form += `*CPF*:%20${cpf}%0A*CEP*:%20${cep}%0A`
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
            form = `*CPF*:%20${confirmCpf}%0A*CEP*:%20${doc.data().cep}%0A`
            $("#confirmCpf").style.backgroundColor = "#83FF83"
            setTimeout(()=>{
                showModal("MComplete")
            }, 1000)
        } else {
            $("#confirmCpf").style.backgroundColor = "#F54E4C"
            setTimeout(()=>{
                alert("registro não encontrado, tente de novo o cep")
                showModal("MRegisterError")
            }, 1000)
        }
    })
}







