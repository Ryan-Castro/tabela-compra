let produtos = [
    {
        nome: "Pomada Classic 150G",
        preçoBase: 6.55,
        preço300: 6.20,
        preço600: 5.70,
        preço1500: 5.50,
    },
    {
        nome: "Pomada Teia 150G",
        preçoBase: 6.55,
        preço300: 6.20,
        preço600: 5.70,
        preço1500: 5.50,
    },
    {
        nome: "Pomada Matte 150G",
        preçoBase: 6.85,
        preço300: 6.50,
        preço600: 6.05,
        preço1500: 5.69,
    },
    {
        nome: "Pomada Caramelo 150G",
        preçoBase: 6.55,
        preço300: 6.20,
        preço600: 5.70,
        preço1500: 5.50,
    }
]

let compras = {}

let tabela = document.querySelector("table")

produtos.forEach((produto, i)=>{
    tabela.children[1].innerHTML += `<tr id="item-${i}">
                                        <td>${i+1}</td>
                                        <td>${produto.nome}</td>
                                        <td><input type="number" onChange="update(${i})"/></td>
                                        <td>${produto.preçoBase.toFixed(2)}</td>
                                        <td></td>
                                        <td>${produto.preço300.toFixed(2)}</td>
                                        <td></td>
                                        <td>${produto.preço600.toFixed(2)}</td>
                                        <td></td>
                                        <td>${produto.preço1500.toFixed(2)}</td>
                                        <td></td>
                                    </tr>`
})

function update(i){
    compras[i] = compras[i]? document.querySelector(`#item-${i}`).children[2].children[0].value : 1
    calcular()
}

function calcular(){
    Object.keys(compras).forEach((id)=>{
        let valor = produtos[id].preçoBase * compras[id]
        document.querySelector(`#item-${id}`).children[4].innerHTML = valor
        document.querySelector(`#item-${id}`).children[6].innerHTML = ""
        document.querySelector(`#item-${id}`).children[8].innerHTML = ""
        document.querySelector(`#item-${id}`).children[10].innerHTML = ""
        if(valor >= 140){
            valor = produtos[id].preço300 * compras[id]
            document.querySelector(`#item-${id}`).children[4].innerHTML = ""
            document.querySelector(`#item-${id}`).children[6].innerHTML = valor
            document.querySelector(`#item-${id}`).children[8].innerHTML = ""
            document.querySelector(`#item-${id}`).children[10].innerHTML = ""
            if(valor >= 300){
                valor = produtos[id].preço600 * compras[id]
                document.querySelector(`#item-${id}`).children[4].innerHTML = ""
                document.querySelector(`#item-${id}`).children[6].innerHTML = ""
                document.querySelector(`#item-${id}`).children[8].innerHTML = valor
                document.querySelector(`#item-${id}`).children[10].innerHTML = ""
                if(valor >= 600){
                    valor = produtos[id].preço1500 * compras[id]
                    document.querySelector(`#item-${id}`).children[4].innerHTML = ""
                    document.querySelector(`#item-${id}`).children[6].innerHTML = ""
                    document.querySelector(`#item-${id}`).children[8].innerHTML = ""
                    document.querySelector(`#item-${id}`).children[10].innerHTML = valor
                }
            }
        }
    })
}

function gerar(){
    document.querySelector("#res").innerHTML = ""
    Object.keys(compras).forEach((id)=>{
        document.querySelector("#res").innerHTML += `ID:${id} - ${compras[id]}`
    })


}