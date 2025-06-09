const express = require('express');
const app = express();
const port = 2004;

app.use(express.json());

let inventario = [

    { id: 1, name: "Handgun" },
    { id: 2, name: "Knife" },
    { id: 3, name: "Erva Verde" },
    { id: 4, name: "Erva Vermelha" },
  
];

app.get('/maleta', (req, res) => {

    res.status(200).json(inventario);

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