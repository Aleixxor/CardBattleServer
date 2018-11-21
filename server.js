'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();

const INDEX = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;

// const server = require('http').createServer(app);

const server = app
  .use(express.static(path.join(INDEX)))
  .set('views', path.join(INDEX))
  .engine('html', require('ejs').renderFile)
  .set('view engine', 'html')
  .use('/', (req, res) => {
    res.render('index.html');
    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

  const io = socketIO(server);

  function createNewCardCollection(collectionID, typeOfTheCards, quantCards, collectionPossibleEffects) {
    const vm = this;
    vm.possibleEffects = collectionPossibleEffects;

    const collection = collectionID;
    const type = typeOfTheCards;
    const quantOfCards = quantCards;

    const game = "CardBattle";

    const cards = createCards(collection, type, quantOfCards);
    var dir = game + '/' + collection + '/0-'+quantOfCards;
    writeFile(dir, "cards.json", cards);

    function createCards(collection, type, quantOfCards) {
        console.log("----- function createCards() initiated -----");
        let cards = { cardList: [], allCardNames: [] };
        // let example = {
        //     "id": "COL001-001",
        //     "name": "Poção Ruim",
        //     "type": "item",
        //     "description": "Cura 10 de vida.",
        //     "rarity": 1,
        //     "effects": [
        //         {
        //             "heal": 10
        //         }
        //     ],
        //     "imageUrl": ""
        // };
        console.log("----- variables declared -----");
        for (let i = 1; i <= quantOfCards; i++) {
            let card = {};
            console.log("----- entered in the for(let i=1; i<="+quantOfCards+"; i++) -----");
            console.log("----- creating card #" + i + " -----");
            card.id = getCardID(collection, i);
            card.type = type;
            console.log("----- function getType() initiated -----");
            console.log("----- Type: " + type + " -----");
            let nameAndEffect = {};
            nameAndEffect = getNameAndEffect(card.type, cards.allCardNames);
            card.name = nameAndEffect.name;
            card.effects = nameAndEffect.effect;

            card.description = getCardDescription(card.effects);
            card.rarity = getCardRarity(card.effects);

            console.log(card);
            cards.cardList.push(card);
            console.log("-------------CARDLIST------------");
            console.log(cards.cardList);
            cards.allCardNames.push(card.name);
        }
        return cards;
    }

    function getNameAndEffect(type, allCardNames) {
        console.log("----- function getNameAndEffect() initiated -----");
        let nameAndEffect = {};
        do {
            var alreadyExist = false;
            nameAndEffect.name = getCardName(type);
            for (let i = 0; i < allCardNames.length; i++) {
                if (nameAndEffect.name.name == allCardNames[i]) {
                    alreadyExist = true;
                }
            }
        } while (alreadyExist);
        console.log("--------------------------------- EFFECT ID AQUI ----------------------------------")
        console.log(nameAndEffect.name.effectID);
        nameAndEffect.effect = getCardEffect(nameAndEffect.name.effectID);
        nameAndEffect.name = nameAndEffect.name.name;
        return nameAndEffect;
    }

    function getCardEffect(effectID) {
        console.log("----- function getCardEffect() initiated -----");
        //0: Heal
        //1: Damage
        //2: DefenseUp
        //3: DefenseDown
        //4: AttackUp
        //5: AttackDown
        let posEffects = vm.possibleEffects;
        console.log("initial posEffects")
        console.log(posEffects);
        let maxEffectQuant = posEffects.length - 1;
        let effects = {};
        let data;

        function addEffect(effects, _posEffects, effectID) {
            effects[_posEffects[effectID]] = randomNumberBetween(10, 101);
            _posEffects.splice(_posEffects[effectID], 1);

            return { effects: effects, possibleEffects: _posEffects };
        }

        do {
            if (effectID < posEffects.length) {
                data = addEffect(effects, posEffects, effectID);
                effects = data.effects;
                posEffects = data.possibleEffects;
            }

            effectID = randomNumberBetween(0, (maxEffectQuant * (Object.keys(effects).length) * 10));
        } while (effectID < posEffects.length);
        console.log("----- effects: -----");
        console.log(effects);
        posEffects = vm.possibleEffects;
        return effects;
    }

    function getCardName(type) {
        console.log("----- function getCardName() initiated -----");
        let name = "";
        let effectID = 0;
        let allItemTypes = ["attack", "defense", "hp"];
        if (type == 'item') {
            let itemType = randomNumberBetween(0, allItemTypes.length);

            let first = {
                attack: [
                    "Espada de ", "Lança de ", "Garras de ", "Chicote de ", "Corrente de ", "Bastão de "
                ],
                defense: [
                    "Escudo de ", "Armadura de ", "Elmo de ", "Colete de "
                ],
                hp: [
                    "Poção de ", "Tônico de ", "Orbe de ", "Pinga de ", "Milk Shake Lendário de "
                ]
            };
            let second = ["Lithi", "Inrin", "Rorad", "Franlak", "Farmus", "Thakhar", "Thôrhu", "Kisan", "Gasdu", "Mazbel", "Gado", "Mokon", "Thorro", "Geirbrand", "Grukgun", "Durmae", "Sorg'hrím", "Clorndur", "Drokur", "Din", "Genfar", "Dinri", "Toa", "Falsmae", "Rorai", "Dornmargrarg", "Clornmê", "Nos", "Rindan", "Fargud", "Ba", "Mikhaz", "Gilkhaz", "Thordo", "Tolgril", "Burtol", "Umnu", "Thicso", "Thithain", "Chripgran", "Dwado", "Avarg", "Gorbrand", "Avargtho", "Náinthu", "Lakdar", "Dogi", "Grímfran", "Belgas", "Dudo", "Thogrím", "Thecmarg", "Doim", "Dáinor", "Modin", "Tolchrip", "Simar", "Dwazag", "Aran", "Alex", "Aleixxor"];
            let object = first[allItemTypes[itemType]][randomNumberBetween(0, first[allItemTypes[itemType]].length)];
            let creator = second[randomNumberBetween(0, second.length)];
            name = object + creator;
            if (itemType == 0) {
                effectID = randomNumberBetween(0, 2);
                if (effectID == 0) {
                    effectID = 1;
                } else {
                    effectID = 4;
                }
            } else if (itemType == 1) {
                effectID = 2;
            } else if (itemType == 2) {
                effectID = 0;
            }
        } else if (type == 'attack') {
            let first = ["Cortada", "Explosão", "Porrada", "Apunhalada", "Chutada", "Lapada", "Estocada", "Estourada", "Erupção", "Ruptura", "Barreira", "Armadilha", "Corrente", "Sarrada"];
            let second = ["de Cupcakes", "Vulcânica", "de Unicórnios", "das Drags Danadas", "Violenta", "Rápida", "de Fogo", "de Chamas Infernais", "de Pipoca", "de Água", "de Pedra", "Relâmpago", "Aquática", "Obscura", "das Trevas", "Luminosa", "Brilhante", "de Luz", "de Vento", "Astral", "Mental", "de Golfinhos", "Lhamal", "Narval", "Cachalote", "Dino", "Dracônica", "Animal", "Selvagem", "Fedorenta", "Cheirosa", "de Borboletas", "Monarca", "Aracnídea", "Silvestre", "das Flores", "Noturna", "Diurna", "Outonal", "Primaveril", "dos Sonhos", "Lunar", "Solar", "das Fadas", "do Amor", "Estelar", "de Corações", "de Pelúcias", "de Ursinhos", "de Pandas", "de Bebês"];
            let ataques = first[randomNumberBetween(0, first.length)];
            let extensoes = second[randomNumberBetween(0, second.length)];
            name = ataques + " " + extensoes;

            effectID = 1;
        }
        let nameData = { name: name, effectID: effectID };
        console.log("----- name: " + name + " -----");
        console.log("----- effectID: " + effectID + " -----");
        return nameData;
    }

    function getCardRarity(effects) {
        console.log("----- function getCardRarity() initiated -----");
        let effectsArray = Object.keys(effects);
        let rarity = 0;
        effectsArray.forEach(effect => {
            rarity = rarity + effects[effect];
        });
        if (rarity <= 10) {
            rarity = 1;
        } else if ((rarity > 10) && (rarity <= 120)) {
            rarity = 2;
        } else if ((rarity > 120) && (rarity <= 240)) {
            rarity = 3;
        } else if ((rarity > 240) && (rarity <= 400)) {
            rarity = 4;
        } else if ((rarity > 400) && (rarity <= 500)) {
            rarity = 5;
        } else if ((rarity > 500) && (rarity < 600)) {
            rarity = 6;
        } else if (rarity >= 600) {
            rarity = 7;
        }
        console.log("----- rarity: " + rarity + " -----");
        return rarity;
    }

    function getCardDescription(effect) {
        console.log("----- function getCardDescription() initiated -----");
        console.log("card effects: ");
        console.log(effect);
        let description = "";
        if (effect.heal != undefined) {
            description = description + "Cura " + effect.heal + " de vida.\n";
        }
        if (effect.damage != undefined) {
            description = description + "Tira " + effect.damage + " de vida.\n";
        }
        if (effect.defenseUp != undefined) {
            description = description + "Aumenta " + effect.defenseUp + " de escudo.\n";
        }
        if (effect.defenseDown != undefined) {
            description = description + "Diminui " + effect.defenseDown + " de escudo.\n";
        }
        if (effect.attackUp != undefined) {
            description = description + "Aumenta " + effect.attackUp + " de ataque.\n";
        }
        if (effect.attackDown != undefined) {
            description = description + "Diminui " + effect.attackDown + " de ataque.\n";
        }
        console.log("----- description: " + description + " -----");
        return description;
    }

    function getCardID(collection, i) {
        console.log("----- function getCardID() initiated -----");
        let id;
        if (i < 10) {
            id = collection + "-00" + i;
        } else if (i < 100) {
            id = collection + "-0" + i;
        } else if (i == 100) {
            id = collection + "-" + i;
        }
        console.log("----- ID: " + id + " -----");
        return id;
    }
}

function readFile(directory, fileName){
    let jsonFileData;
    if (!fs.existsSync(directory)){
        jsonFileData = {errorCode: 404, errorMessage: "Error 404: DirectoryNotFound"};
    }else{
        let rawdata = fs.readFileSync(directory+'/'+fileName);  
        jsonFileData = JSON.parse(rawdata);  
        console.log(jsonFileData);
    }
    
    return jsonFileData;
}

function writeFile(directory, fileName, data){
    const _data = JSON.stringify(data);
    console.log(_data)
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
    fs.writeFileSync(directory+'/'+fileName, _data);
}

function randomNumberBetween(min_value, max_value) {
    let random_number = Math.random() * (max_value - min_value) + min_value;
    return Math.floor(random_number);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // Enquanto houverem elementos para misturar...
    while (0 !== currentIndex) {

        // Escolhe um dos elementos restantes aleatoriamente...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // E troca com o elemento atual.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


let messages = [];
var newUserMessage = "Um novo usuário entrou na sala!";
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    //Utilizando cifra de atbash

    socket.emit('previousMessages', messages);
    socket.broadcast.emit('newUser', newUserMessage);

    socket.on('tryLogin', data => {
        const directory = "CardBattle/Users/"+data.username;
        const fileName = "login.json";
        let user = readFile(directory, fileName);
        let message = "";
        if(user.errorCode != undefined){
            message = {isLogged: false, message: user.errorMessage};
        }else{
            if((user.username == data.username)&&(user.password == data.password)){
                message = {isLogged: true, message: "User logged with success!"};
            }else{
                message = {isLogged: false, message: "Wrong Username or Password!"};
            }
        }
        socket.emit('onLogin', message);
    })

    socket.on('tryRegister', data => {
        const directory = "CardBattle/Users/"+data.username;
        const fileName = "login.json";
        let user = readFile(directory, fileName);
        let message = "";
        if(user.errorCode == 404){
            message = {isRegistered: true, message: "User registered with success!"};
            writeFile(directory, fileName, data);
        }else{
            message = {isRegistered: false, message: "Username already exists!"};
        }
        socket.emit('onRegister', message);
    })

    socket.on('createNewCollection', data => {
        data.effectsPoss = ["heal", "damage", "defenseUp", "defenseDown", "attackUp", "attackDown"];
        if(data.collection != undefined && data.typesAndQuant != undefined && data.quant != undefined && data.effectsPoss != undefined){
            for(let count = 0; count < data.types.length; count++){
                createNewCardCollection(data.collection, data.types[i], data.quant[i], data.effectsPoss);
            }
        }
    })

    socket.on('sendMessage', data => {
        messages.push(data);
        console.log(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);