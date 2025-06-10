const express = require('express');
const app = express();
const port = 2004;

app.use(express.json());

let inventario = [

    { id: 1, name: "Handgun" , tipo: "Pistola" , dano:10, combinavel: "sim"},
    { id: 2, name: "Knife",  tipo:"lamina", dano:3, combinavel: "não" },
    { id: 3, name: "Erva Verde", tipo:"vida", recuperacao: 7, combinavel: "sim" },
    { id: 4, name: "Erva Vermelha", tipo:"vida", combinavel: "sim" },

];

let acessorio = [

    {id:1, name:"mira a lazer", habilidade:"pequeno aumento de precisão"},
    {id:2, name:"estoque TMP", habilidade:"grande aumento de precisão"}

]

function nivel3(item,) {
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



app.get('/maleta/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = inventario.findIndex(item => item.id === id);
    if (index !== -1) {
        res.status(200).json(inventario[index]);
    }
});


app.post('/maleta', (req, res) => {
    //os arrays tem uma propriedade chamada length... essa propriedade calcula o tamanho
    //do meu vetor e retorna ele em formato de inteiro...

    if (inventario.length >= 10) {

        res.status(400).json({ message: "inventario cheio" });

    } else {

        if (req.body.name === null || req.body.name === '') {
            res.status(400).json({ message: "É necessário informar a propriedade 'name'" });

        } else {
            
            
            const newItem = { id: inventario.length + 1, ...req.body }
            //push insere um novo item no vetor...
            inventario.push(newItem);
            res.status(201).json(newItem);
        }

    }
});



app.post('/maleta/combinar', (req, res) => {
    const indexVerde = inventario.findIndex(item => item && item.name === 'Erva Verde');
    const indexVermelha = inventario.findIndex(item => item && item.name === 'Erva Vermelha');

    //verifica se o index é menor que 0
    if (indexVerde >= 0 && indexVermelha >= 0) {
        const idVerde = inventario[indexVerde].id;
        const idVermelha = inventario[indexVermelha].id;
        const menorId = Math.min(idVerde, idVermelha);

        // Remove as ervas em ordem para não bagunçar índices
        if (indexVerde > indexVermelha) {
            inventario.splice(indexVerde, 1);
            inventario.splice(indexVermelha, 1);
        } else {
            inventario.splice(indexVermelha, 1);
            inventario.splice(indexVerde, 1);
        }

        // Procurar slot vazio
        const slotVazio = inventario.findIndex(item => item == null);

        if (slotVazio !== -1) {
            inventario[slotVazio] = { id: menorId, name: "Ervas Combinadas" };
        } else if (inventario.length < 10) {
            inventario.push({ id: menorId, name: "Ervas Combinadas" });
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