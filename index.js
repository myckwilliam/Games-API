const express = require('express')
const cors = require('cors')
const res = require('express/lib/response')
const app = express()

//Used to work with JSON
app.use(express.json())
//Used to allows authentication for all IPs
app.use(cors())

//False DataBase
const db = {
    games: [
        {
            id: 23,
            name: "Call of Duty MW",
            year: 2019,
            price: 60
        },
        {
            id: 42,
            name: "Assassin's Creed Brotherhood",
            year: 2009,
            price: 47
        },
        {
            id: 69,
            name: "League Of Legends",
            year: 2010,
            price: 0
        },
    ]
}

app.get('/games', (request, response) => {
    response.status(200).json(db.games)
})

app.get('/games/:id', (request, response) => {
    const id = parseInt(request.params.id);
    if(isNaN(request.params.id)){
        response.status(400).send('ID is not a number')
    }
    const game = db.games.find(game => game.id === id)

    if (game !== undefined) {
        response.status(200).json(game);
    }else {
        response.status(404).send('Game not found.')
    }

})

app.post('/games', (request, response) => {
    const {id, name, year, price} = request.body;
    const game = {
        id: id,
        name: name,
        year: year,
        price: price
    }
    db.games = [...db.games, game]
    response.status(200).json(game)

})



app.put('/games/:id', (request, response) => {
    const id = request.params.id;
    const {name, year, price} = request.body;

    if(isNaN(request.params.id)){
        response.status(400).send('ID is not a number')
    }

    const gameIndex = db.games.findIndex(game => game.id == id)
    
    if (gameIndex !== -1) {
        db.games[gameIndex] = {id: parseInt(id), name: name, year: year, price: price}
        response.status(200).json(db.games[gameIndex]);
    }else {
        response.status(404).send('Game not found.')
    }
})

app.delete('/games/:id', (request, response) => {
    const id = request.params.id;
    const {name, year, price} = request.body;

    if(isNaN(request.params.id)){
        response.status(400).send('ID is not a number')
    }

    const gameIndex = db.games.findIndex(game => game.id == id)
    
    if (gameIndex !== -1) {
        db.games.splice(gameIndex, 1)
        response.status(200).send('Game deleted!');
    }else {
        response.status(404).send('Game not found.')
    }
})



//PORT that the API is running
app.listen(45678, () => {
    console.log('Server Running!')
})