const express = require('express');
const app = express();
const port = 2004;

app.use(express.json());


//array onde guarda os itens da maleta
let inventario = [

    { id: 1, name: "Handgun", tipo: "Pistola", dano: 10, combinavel: "sim" },
    { id: 2, name: "Knife", tipo: "lamina", dano: 3, combinavel: "não" },
    { id: 3, name: "Erva Verde", tipo: "vida", recuperacao: 7, combinavel: "sim" },
    { id: 4, name: "Erva Vermelha", tipo: "vida", recuperao: 0, combinavel: "sim" },

];

// array onde guarda os acessórios do jogo
let acessorio = [

    { id: "a", name: "mira a lazer", habilidade: "pequeno aumento de precisão", coletado: "sim" },
    { id: "b", name: "estoque TMP", habilidade: "grande aumento de precisão", coletado: "sim" }

]

//função que converte o numero do ID para letra
function NumeroParaLetra(n) {
    return String.fromCharCode(97 + n);
}

//função para validar resultados de busca vazios
function ValidaVazio(valor) {
    return valor === null || valor === "" || valor === undefined;
}

//função que mapeia os métodos do código
function HATEOAS(item) {
    return {
        self: { href: `/maleta/${item.id}` },
        update: { href: `/maleta/${item.id}`, method: "PUT" },
        delete: { href: `/maleta/${item.id}`, method: "DELETE" },
        create: { href: `/maleta`, method: "POST" },
        all: { href: `/maleta`, method: "GET" }
    };
}

// get híbrido que mostra todos os itens disponiveis 
app.get('/maleta', (req, res) => {

    // adiciona links HATEOAS em cada item
    const response = inventario.map(item => ({
        ...item,
        link: HATEOAS(item),
    }));

    // adiciona links HATEOAS em cada item
    const response2 = acessorio.map(item2 => ({
        ...item2,
        link: HATEOAS(item2),
    }));

    // manda de volta os DOIS arrays em um único objeto
    res.status(200).json({
        inventario: response,
        acessorio: response2
    });
});

//get onde mostra quais acessórios foram adquiridos
app.get('/acessorios', (req, res) => {

    //variaveis de coleta de dados filtradas 
    const acessorios = acessorio.filter(item => item.coletado === 'sim');
    const ncoleta = acessorio.filter(item => item.coletado === 'sim').length;
    const total = acessorio.length;

    //valida se existe algum item
    if (total === 0 && ncoleta === 0) {
        return res.status(404).json({ message: "nenhum acessorio encontrado" });
    }

    res.status(200).json({ message: `Acessorios Adquiridos: ${ncoleta} de ${total}`, acessorios });

});

//get hibrido (acessorio/inventario) que seleciona o item pelo id especifico
app.get('/maleta/:id', (req, res) => {

    const id = parseInt(req.params.id);
    //não exige 'parseInt' por ser string
    const id2 = (req.params.id);
    const index = inventario.findIndex(item => item.id === id);
    const index2 = acessorio.findIndex(item => item.id === id2);

    //valida se existe pelo index do item
    if (index !== -1) {
        res.status(200).json(inventario[index]);
    } else if (index2 !== -1) {
        res.status(200).json(acessorio[index2]);
    } else {
        res.status(404).json({ message: "nao foi encontrado" })
    }

});

//post hibrido que permite criar o item com base nas suas propriedades
app.post('/maleta', (req, res) => {

    const name = req.body.name;
    //variavel para coletar a principal propriedade que diferencia os arrays
    const habilidade = req.body.habilidade;

    //valida para impedir que ultrapasse o limite de espaço do inventario
    if (inventario.length >= 10) {
        res.status(400).json({ message: "inventario cheio" });
        //obriga o uso da propriedade name    
    } else if (ValidaVazio(name)) {
        res.status(400).json({ message: "a propriedade 'name' é obrigatoria" });
    } else {

        //usa a propriedade 'habilidade'  para definir qual tipo de item sera criado
        if (habilidade == undefined) {

            const ItemType = req.body.tipo;

            //obriga o uso da  propriedade tipo
            if (ValidaVazio(ItemType)) {
                res.status(400).json({ message: "É necessário informar a propriedade 'tipo' ou 'habilidade'" });
                //com base no tipo do item define a proxima propriedade
            } else if (ItemType === 'vida') {

                //obriga o uso da  propriedade 'recuperacao' para items de cura
                if (ValidaVazio(req.body.recuperacao)) {
                    res.status(400).json({ message: "para itens de cura o valor da propriedade 'recuperacao' é obrigatorio" });
                } else {

                    //obriga o uso da propriedade 'combinavel'
                    if (ValidaVazio(req.body.combinavel)) {
                        res.status(400).json({ message: "é necessario informar a propriedade 'combinavel'" });
                    } else {

                        const newItem = { id: inventario.length + 1, ...req.body }
                        //push insere um novo item no vetor...
                        inventario.push(newItem);
                        res.status(201).json(newItem);

                    }

                }

            } else {

                //obriga o uso da propriedade 'dano' 
                if (ValidaVazio(req.body.dano)) {
                    res.status(400).json({ message: "para itens de ataque o valor da propriedade 'dano' é obrigatorio" });
                } else {

                    //obriga o uso da propriedade 'combinavel'
                    if (ValidaVazio(req.body.combinavel)) {
                        res.status(400).json({ message: "é necessario informar a propriedade 'combinavel'" });
                    } else {

                        const newItem = { id: inventario.length + 1, ...req.body }
                        //push insere um novo item no vetor...
                        inventario.push(newItem);
                        res.status(201).json(newItem);

                    }

                }

            }

        } else {

            //obriga o uso da propriedade 'habilidade'
            if (habilidade === "" || habilidade === null) {
                res.status(400).json({ message: "é necessario informar a propriedade 'habilidade' para os acessorios" });
            } else {

                //obriga o uso da propriedade 'coletado'
                if (ValidaVazio(req.body.coletado)) {
                    res.status(400).json({ message: "é necessario informar a propriedade 'coletado' para acessorios" })
                } else {

                    const newItem2 = { id: acessorio.id = NumeroParaLetra(acessorio.length), ...req.body }
                    //push insere um novo item no vetor...
                    acessorio.push(newItem2);
                    res.status(201).json(newItem2);

                }

            }

        }

    }

})


//post que combina 2 items especificos do inventario
app.post('/maleta/combinar', (req, res) => {
    
    //coleta o index com base no nome do item
    const indexVerde = inventario.findIndex(item => item.name === 'Erva Verde');
    const indexVermelha = inventario.findIndex(item => item.name === 'Erva Vermelha');

    //valida se ambos os items existem
    if (indexVerde >= 0 && indexVermelha >= 0) {

        //garante que os items serao removidos na ordem certa
        if (indexVerde > indexVermelha) {
            //exclui ambos os items
            inventario.splice(indexVerde, 1);
            inventario.splice(indexVermelha, 1);
        } else {
            //exclui ambos os items
            inventario.splice(indexVermelha, 1);
            inventario.splice(indexVerde, 1);
        }

        //garante que nao vai excerder a capacidade do inventario 
        if (inventario.length < 10) {
            //adiciona o novo item no array (combinação dos items excluidos)
            inventario.push({ id: inventario.length + 1, name: "Ervas Combinadas", tipo: "vida", recuperacao: 20, combinavel: "não" });
        } else {
            res.status(400).json({ message: "Maleta cheia!" });
        }

        res.status(200).json({ message: "Ervas combinadas com sucesso!", inventario });
    } else {
        res.status(400).json({ message: "Você não tem as duas ervas para combinar!" });
    }
});

app.put('/maleta/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const find = inventario.findIndex(maleta => maleta.id === id);
    if (find !== -1) {

        inventario[find] = { id, ...req.body }
        res.status(404).json({ message: "Você não tem esse item." });
 
    }else{
        if (ValidaVazio(req.body.name)) {
            return res.status(400).json({ message: "a propriedade 'name' é obrigatoria" });
        }else{
            //valida se a propriedade tipo foi informada
            if (ValidaVazio(req.body.tipo)) {
                return res.status(400).json({ message: "é necessario informar a propriedade 'tipo' para os itens de ataque" });
            } else {

                //valida se a propriedade dano foi informada
                if (ValidaVazio(req.body.dano)) {
                    return res.status(400).json({ message: "é necessario informar a propriedade 'dano' para os itens de ataque" });
                }

            }

            inventario[find] = { id, ...req.body };
            return res.status(200).json(inventario[find]);
        }
    }

});

   

app.put('/acessorios/:id', (req, res) => {

    const id = (req.params.id);
    const find = acessorio.findIndex(item => item.id === id);
    if (find !== -1) {

        inventario[find] = { id, ...req.body }
        return res.status(404).json({ message: "Você não tem esse item." });
 
    } else{
        if (ValidaVazio(req.body.name)) {
            return res.status(400).json({ message: "a propriedade 'name' é obrigatoria" });
        } else {

            //valida se a propriedade habilidade foi informada
            if (ValidaVazio(req.body.habilidade)) {
                return res.status(400).json({ message: "é necessario informar a propriedade 'habilidade' para os itens de ataque" });
            } else {

                //valida se a propriedade coletado foi informada
                if (ValidaVazio(req.body.coletado)) {
                    return res.status(400).json({ message: "é necessario informar a propriedade 'coletado' para os itens de ataque" });
                }

            }

            acessorio[find] = { id, ...req.body };
            return res.status(200).json(acessorio[find]);
        }
    }

});


app.delete('/maleta/:id', (req, res) => {

    const id = (req.params.id);
    const find = inventario.findIndex(maleta => maleta.id === id);

    if (find !== -1) {

        inventario.splice(find, 1);
        res.status(200).json({ mensage: "item descartado" });

    } else {

        res.status(404).json({ mensage: "voce nao tem esse item" });

    }

});

app.delete('/acessorios/:id', (req, res) => {

    const id = (req.params.id);
    const find = acessorio.findIndex(item => item.id === id);

    if (find !== -1) {

        acessorio.splice(find, 1);
        res.status(200).json({ mensage: "item descartado" });

    } else {

        res.status(404).json({ mensage: "voce nao tem esse item" });

    }

});


app.listen(port, () => {

    console.log(`A maleta foi aberta em http://localhost:${port}`);

})