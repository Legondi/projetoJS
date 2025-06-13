const express = require('express');
const app = express();
const port = 2004;

app.use(express.json());

let inventario = [

    { id: 1, name: "Handgun", tipo: "Pistola", dano: 10, combinavel: "sim" },
    { id: 2, name: "Knife", tipo: "lamina", dano: 3, combinavel: "não" },
    { id: 3, name: "Erva Verde", tipo: "vida", recuperacao: 7, combinavel: "sim" },
    { id: 4, name: "Erva Vermelha", tipo: "vida", recuperao: 0, combinavel: "sim" },

];

let acessorio = [

    { id: "a", name: "mira a lazer", habilidade: "pequeno aumento de precisão",coletado: "sim" },
    { id: "b", name: "estoque TMP", habilidade: "grande aumento de precisão" , coletado: "sim"}

]

function NumeroParaLetra(n) {
    return String.fromCharCode(97 + n);
}

function nivel3(item) {
    return {
        self: { href: `/maleta/${item.id}` },
        update: { href: `/maleta/${item.id}`, method: "PUT" },
        delete: { href: `/maleta/${item.id}`, method: "DELETE" },
        create: { href: `/maleta`, method: "POST" },
        all: { href: `/maleta`, method: "GET" }
    };
}


app.get('/maleta', (req, res) => {
    // adiciona links HATEOAS em cada item
    const response = inventario.map(item => ({
        ...item,
        link: nivel3(item),
    }));

    const response2 = acessorio.map(item2 => ({
        ...item2,
        link: nivel3(item2),
    }));

    // manda de volta os DOIS arrays em um único objeto
    res.status(200).json({
        inventario: response,
        acessorio: response2
    });
});

app.get('/acessorios',(req, res) =>{
    

    const coleta = acessorio.findIndex(item => item.coletado === 'sim');
    res.json(acessorio[coleta]);
    

});

app.get('/maleta/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const id2 = (req.params.id)
    const index = inventario.findIndex(item => item.id === id);
    const index2 = acessorio.findIndex(item => item.id === id2)
    if (index !== -1) {
        res.status(200).json(inventario[index]);
    } else if (index2 !== "") {

        res.status(200).json(acessorio[index2]);

    } else {

        res.status(404).json({ message: "nao foi encontrado" })

    }

});


app.post('/maleta', (req, res) => {

    const name = req.body.name;
    const habilidade = req.body.habilidade;


    if (inventario.length >= 10) {

        res.status(400).json({ message: "inventario cheio" });

    } else if (name === null || name === "" || name === undefined) {

        res.status(400).json({ message: "a propriedade 'name' é obrigatoria" });

    } else {

        if (habilidade == undefined) {



            const ItemType = req.body.tipo;

            if (req.body.tipo === null || req.body.tipo === "" || req.body.tipo === undefined) {

                res.status(400).json({ message: "É necessário informar a propriedade 'tipo' ou 'habilidade'" });

            } else if (ItemType === 'vida') {

                if (req.body.recuperacao === null || req.body.recuperacao === "" || req.body.recuperacao === undefined) {

                    res.status(400).json({ message: "para itens de cura o valor da propriedade 'recuperacao' é obrigatorio" });

                } else {

                    if (req.body.combinavel === null || req.body.combinavel === "" || req.body.combinavel === undefined) {

                        res.status(400).json({ message: "é necessario informar a propriedade 'combinavel'" });

                    } else {

                        const newItem = { id: inventario.length + 1, ...req.body }
                        //push insere um novo item no vetor...
                        inventario.push(newItem);
                        res.status(201).json(newItem);

                    }

                }

            } else {

                if (req.body.dano === null || req.body.dano === "" || req.body.dano === undefined) {

                    res.status(400).json({ message: "para itens de ataque o valor da propriedade 'dano' é obrigatorio" });

                } else {

                    if (req.body.combinavel === null || req.body.combinavel === "" || req.body.combinavel === undefined) {

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

            if (habilidade === "" || habilidade === null) {

                res.status(400).json({ message: "é necessario informar a propriedade 'habilidade' para os acessorios" });

            } else {

                const newItem2 = { id: acessorio.id = NumeroParaLetra(acessorio.length), ...req.body }
                acessorio.push(newItem2);
                res.status(201).json(newItem2);

            }

        }

    }

});



app.post('/maleta/combinar', (req, res) => {
    const indexVerde = inventario.findIndex(item => item.name === 'Erva Verde');
    const indexVermelha = inventario.findIndex(item => item.name === 'Erva Vermelha');

    if (indexVerde >= 0 && indexVermelha >= 0) {

        if (indexVerde > indexVermelha) {
            inventario.splice(indexVerde, 1);
            inventario.splice(indexVermelha, 1);
        } else {
            inventario.splice(indexVermelha, 1);
            inventario.splice(indexVerde, 1);
        }

        if (inventario.length < 10) {
            inventario.push({ id: inventario.length + 1, name: "Ervas Combinadas", tipo: "vida", recuperacao: 20, combinavel: "não" });
        } else {
            return res.status(400).json({ message: "Maleta cheia!" });
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
        res.status(200).json(inventario[find]);

    } else {

        res.status(404).json({ message: "voce nao tem esse item" });

    }

});


app.delete('/maleta/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const find = inventario.findIndex(maleta => maleta.id === id);

    if (find !== -1) {

        inventario.splice(find, 1);
        res.status(200).json({ mensage: "item descartado" });

    } else {

        res.status(404).json({ mensage: "voce nao tem esse item" });

    }

});


app.listen(port, () => {

    console.log(`A maleta foi aberta em http://localhost:${port}`);

})