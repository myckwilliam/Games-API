const express = require('express')
const cors = require('cors')
const jwt = require("jsonwebtoken")
const res = require('express/lib/response')
const req = require('express/lib/request')
const app = express()

const JWTSecret = "fddwenfwldcnsedefwejjjdfiefwefw"

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
    ],

    users: [
        {
            id: 1,
            name: "Ejs",
            email: "ejs@dwd.com",
            password: "ejs123"
        },
        {
            id: 20,
            name: "Java",
            email: "java@dwd.com",
            password: "java123"
        }
    ]
}

function auth(request, response, next){
    const authToken = request.headers['authorization']

    if(authToken != undefined){
        const bearer = authToken.split(' ')
        const token = bearer[1]

        jwt.verify(token, JWTSecret, (error, data)=> {
            if (error){
                response.status(401).json({error: "Invalid token."})
            }else{
                request.token = token;
                request.loggedUser = {id: data.id, email: data.email}

                next()
            }
        })
    }else{
        response.status(400).json({error: "Invalid token."})
    }
}

app.get('/games', auth, (request, response) => {
    response.status(200).json({user: request.loggedUser, games: db.games})
})

app.get('/games/:id', auth, (request, response) => {
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

app.post('/games', auth,  (request, response) => {
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



app.put('/games/:id', auth, (request, response) => {
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

app.delete('/games/:id', auth,  (request, response) => {
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


app.post('/auth', (request, response) => {
    const {email, password} = request.body;
    const user = db.users.find(user => user.email == email)
    if(user != undefined){
        if (user.password == password){
            jwt.sign({id: user.id, email: user.email}, JWTSecret, {expiresIn: "48h"}, (error, token)=> {
                if(error){
                    response.status(500).json({error: "Internal fail!"})
                }else {
                    response.status(200).json({token: token})
                }
            })

        }else {
            response.status(400).json({error: "Invalid Password."})
        }
    }else {
        response.status(404).json({error: "User not found."})
    }
})


//PORT that the API is running
app.listen(45678, () => {
    console.log('Server Running!')
})