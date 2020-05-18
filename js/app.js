let openScreen = document.getElementById("opening-screen")
let card = document.getElementsByClassName("card");
let matchedCard = document.getElementsByClassName("match");
let closeicon = document.querySelector(".close");
let modal = document.getElementById("popup1")
let allCards = [...card];
let cards, layout;

var openedCards = [];
var firstPlayerScore = 0;
var secondPlayerScore = 0;
var firstPlayerTotalScore = 0;
var secondPlayerTotalScore = 0;
var matchCounter = 0;
var playersTurn = 0;
var player1turn = true;
var player2turn = false;
var firstPlayer, secondPlayer;
var turn = document.getElementById("whosTurn");

const deck = document.getElementById("card-deck");

document.body.onload = openingScreen();

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

function openingScreen(){
    startDeck();
    openScreen;
}

function startDeck(){
    layout = document.getElementById("game-select").value;
    if(layout == 12){
        cards = allCards.slice(0,12);
    }
    else{
        cards = allCards;
    }
}

function sumbitGame(){
    let promise = new Promise(function(ok, notOk){
        firstPlayer = document.getElementById("fplayer").value;
        secondPlayer = document.getElementById("lplayer").value;
        if((firstPlayer&&secondPlayer) !== ""){
            ok();
        }
        else{
            notOk();
        }
    });
    promise.then(function(){
        document.getElementById("opening-screenId").style.display = "none";
        document.getElementById("containerId").style.display = "flex";
        startDeck();
        turn.textContent = turn.textContent + firstPlayer;
        startGame(firstPlayer, secondPlayer);
    }).catch(function(){
        alert("Please fill all the fields");
    });
}

function startGame(name1, name2){
    document.getElementById("firstPlayerWins").textContent = name1+" total wins: "+firstPlayerTotalScore;
    document.getElementById("secondPlayerWins").textContent = name2+" total wins: "+secondPlayerTotalScore;
    document.getElementById("firstPlayer").textContent = name1+": "+firstPlayerScore;
    document.getElementById("secondPlayer").textContent = name2+": "+secondPlayerScore;
    
    openedCards = [];
    cards = shuffle(cards);

    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
}

var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};

function cardOpen() {
    openedCards.push(this);

    let cardId1 = openedCards[0].id;
    let cardId2 = openedCards[openedCards.length-1].id;
    document.getElementById('card'+cardId1).style.visibility='visible';
    document.getElementById('card'+cardId2).style.visibility='visible';
    
    var len = openedCards.length;
    if(len === 2){
        if(openedCards[0].type === openedCards[1].type){
            if(playersTurn%2 == 0){
                firstPlayerScore++;
                document.getElementById("firstPlayer").textContent = firstPlayer +": "+firstPlayerScore;   
            }
            else{
                secondPlayerScore++;
                document.getElementById("secondPlayer").textContent = secondPlayer +": "+secondPlayerScore; 
            }
            matched();
            matchCounter++;
            
            if(matchCounter == (cards.length)/2){
                congratulations();
            }
        } else {
            updateTurn();
            unmatched();
                setTimeout(() => {
                    document.getElementById('card'+cardId1).style.visibility='hidden';
                    document.getElementById('card'+cardId2).style.visibility='hidden';
    
                },1000)
        }
    }
};

function updateTurn(){
    if(playersTurn%2 == 0){
        player1turn = false;
        player2turn = true;
        turn.textContent = "Players Turn: "+secondPlayer; 
    }
    else{
        player1turn = true;
        player2turn = false;
        turn.textContent = "Players Turn: "+firstPlayer;  
    }
    playersTurn++;
}

function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}

function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        openedCards = [];
    },1100);
}

function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}

function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}

function congratulations(){
    if(matchCounter == (cards.length)/2){
        if(firstPlayerScore > secondPlayerScore){
            document.getElementById("winner-name").innerHTML = firstPlayer +" Congratulations you're the winner 🎉🎉";
            firstPlayerTotalScore++;
        }
        else if(firstPlayerScore < secondPlayerScore){
            document.getElementById("winner-name").innerHTML = secondPlayer +" Congratulations you're the winner 🎉🎉";
            secondPlayerTotalScore++;
        }
        else{
            document.getElementById("winner-name").innerHTML = "No one wins";
        }
        modal.classList.add("show");

        matchCounter = 0;
        firstPlayerScore = 0;
        secondPlayerScore = 0;
        closeModal();
    };
}

function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        saveToLocalStorage();
        startGame();
    });
}

function returnToOpenScreen(){
    turn.textContent = "Players Turn: ";
    firstPlayerTotalScore = 0;
    secondPlayerTotalScore = 0;
    for(i=0; i < cards.length; i++){
        document.getElementById('card'+cards[i].id).style.visibility='hidden';
    }

    document.getElementById("fplayer").value = "";
    document.getElementById("lplayer").value = "";
    document.getElementById("containerId").style.display = "none";
    document.getElementById("opening-screenId").style.display = "inherit";
    document.getElementById("opening-screenId").style.flexDirection = "colomn";
    openingScreen();
}

function playAgain(){
    firstPlayerScore = 0;
    secondPlayerScore = 0;
    matchCounter = 0;
    modal.classList.remove("show");
    for(var i = 0; i < cards.length; i++){
        document.getElementById('card'+i).style.visibility='hidden';
    }
    saveToLocalStorage();
    startGame(firstPlayer, secondPlayer);
}

function saveToLocalStorage(){
    var itemToWrite = {"first-player":firstPlayer, "second-player":secondPlayer,
    "player1-wins": firstPlayerTotalScore, "player2-wins": secondPlayerTotalScore, "deck-size":cards.length};
    localStorage.setItem("game-details", JSON.stringify(itemToWrite));
}

for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",congratulations);
};