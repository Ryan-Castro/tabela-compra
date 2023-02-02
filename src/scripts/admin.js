async function init(){
    $("main").innerHTML = ""
    await db.collection("produtos").get().then((snapshot)=>{
        snapshot.forEach(doc=>{
            $("main").innerHTML +=`
                <div class="card">
                    <h1>${doc.data().nome}</h1>
                    <div>
                        <ul>
                            <li>R$: ${doc.data().preçoBase.toFixed(2)}</li>
                            <li>R$: ${doc.data().preço300.toFixed(2)}</li>
                            <li>R$: ${doc.data().preço600.toFixed(2)}</li>
                            <li>R$: ${doc.data().preço1500.toFixed(2)}</li>
                        </ul>
                        <div class="inputs">
                            <input type="button" value="Alterar" onclick="set('${doc.id}')">
                            <input type="button" value="Apagar" onclick="consfirDelet('${doc.id}')">
                        </div>
                    </div>
                </div>
            `
        })

    })
}

function add(){
    $("#titleFunction").innerHTML = "Adicionar"
    $("#name").value = ""
    $("#weight").value = ""
    $("#pBase").value = ""
    $("#p300").value = ""
    $("#p600").value = ""
    $("#p1500").value = ""
    $("#productID").value = ""
    $("#modal").style.display = "flex"
}
async function set(id){
    $("#productID").value = id
    await db.collection("produtos").doc(id).get().then((snapshot)=>{
        $("#name").value = snapshot.data().nome
        $("#weight").value = snapshot.data().peso
        $("#pBase").value = snapshot.data().preçoBase
        $("#p300").value = snapshot.data().preço300
        $("#p600").value = snapshot.data().preço600
        $("#p1500").value = snapshot.data().preço1500
    })
    $("#titleFunction").innerHTML = "Alterar"
    $("#modal").style.display = "flex"
}

function send(){
    if($("#productID").value == ""){
        db.collection("produtos").add({
            nome: $("#name").value,
            peso: Number($("#weight").value),
            preçoBase: Number($("#pBase").value),
            preço300: Number($("#p300").value),
            preço600: Number($("#p600").value),
            preço1500: Number($("#p1500").value),
        }).then(()=>{
            location.reload()
        })
    } else {
        db.collection("produtos").doc($("#productID").value).set({
            nome: $("#name").value,
            peso: Number($("#weight").value),
            preçoBase: Number($("#pBase").value),
            preço300: Number($("#p300").value),
            preço600: Number($("#p600").value),
            preço1500: Number($("#p1500").value),
        }).then(()=>{
            location.reload()
        })
    }
}
function consfirDelet(id){
    $("#modalDelet").style.display = "flex"
    $("#deletId").value = id
}
function delet(){
    db.collection("produtos").doc($("#deletId").value).delete().then(()=>{
        location.reload()
    })
}
init()