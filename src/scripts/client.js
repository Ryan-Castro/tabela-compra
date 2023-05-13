function init(){
    db.collection("client").get().then((snapshot)=>{
        snapshot.forEach(doc => {
            $("main").innerHTML += `
            <div class="card">
                <h1>${doc.data().name} - ${doc.id}</h1>
                <div>
                    <input type="button" value="Analizar" onclick="showEdit('${doc.id}')">
                    <input type="button" value="Deletar" onclick="consfirDelet('${doc.id}')">
                </div>
            </div>
            `
        });
    })
}
init()
function showAdd(){
    $("#name").value = ""
    $("#numero").value = ""
    $("#bairro").value = ""
    $("#cep").value = ""
    $("#cidade").value = ""
    $("#estado").value = ""
    $("#tel").value = ""
    $("#email").value = ""
    $("#address").value = ""
    $("#cpf").value = ""
    $("#modal").style.display = "flex"
}
async function showEdit(id){
    await db.collection("client").doc(id).get().then((doc)=>{
        $("#name").value = doc.data().name
        $("#numero").value = doc.data().numero
        $("#bairro").value = doc.data().bairro
        $("#cep").value = doc.data().cep
        $("#cidade").value = doc.data().cidade
        $("#estado").value = doc.data().estado
        $("#tel").value = doc.data().tel
        $("#email").value = doc.data().email
        $("#address").value = doc.data().address
        $("#cpf").value = doc.data().cpf
        $("#modal").style.display = "flex"
    })
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
    $("#modal").style.display = "none"
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
    }).then(()=>{location.reload()})
}
function consfirDelet(id){
    $("#modalDelet").style.display = "flex"
    $("#deletId").value = id
}
function delet(){
    db.collection("client").doc($("#deletId").value).delete().then(()=>{
        location.reload()
    })
}
