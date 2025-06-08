const express = require('express');
const app = express();
const port  = 2004;

app.use(express.json());

let inventario = [
    
    {id:1, name: "handgun"},
    {id:2, name: "knife"},

];

app.get('/maleta',(req, res) => {

    res.status(200).json(inventario);

})


app.put('/maleta/:id', (req,res) =>  {

    const id = parseInt(req.params.id);
    const find = inventario.findIndex(maleta => maleta.id === id );
    if(find !== -1) {

        inventario[find] = {id, ...req.body}
        res.status(200).json(inventario[find]);

    } else {

        res.status(404).json({message:"voce nao tem esse item"});
        
    }

});

app.delete('/maleta/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const find = inventario.findIndex(maleta => maleta.id === id);

    if(find !== -1) {

        inventario.splice(find, 1);
        res.status(200).json({mensage: "item descartado"});

    }  else {

        res.status(404).json({mensage: "voce nao tem esse item"});

    }

});


app.listen(port, () => {

    console.log(`A maleta foi aberta em http://localhost:${port}`);

})