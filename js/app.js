// opening screen object
let openScreen = document.getElementById("opening-screen")

// cards array holds all cards
let card = document.getElementsByClassName("card");
let allCards = [...card];
let cards;

// deck of all cards in game
const deck = document.getElementById("card-deck");

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

 // close icon in modal
 let closeicon = document.querySelector(".close");

 // declare modal
 let modal = document.getElementById("popup1")

 // array for opened cards
var openedCards = [];

let layout;
var firstPlayerScore = 0;
var secondPlayerScore = 0;
var firstPlayerTotalScore = 0;
var secondPlayerTotalScore = 0;
var playersTurn = 0;
var player1turn = true;
var player2turn = false;
var turn = document.getElementById("whosTurn");
var firstPlayer;
var secondPlayer;
var matchCounter = 0;

// @description shuffles cards
// @param {array}
// @returns shuffledarray
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

// @description shuffles cards when page is refreshed / loads
document.body.onload = openingScreen();

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
    firstPlayer = document.getElementById("fplayer").value;
    secondPlayer = document.getElementById("lplayer").value;
    document.getElementById("opening-screenId").style.display = "none";
    document.getElementById("containerId").style.display = "flex";
    startDeck();
    turn.textContent = turn.textContent + firstPlayer;
    startGame(firstPlayer, secondPlayer);
}

// @description function to start a new play 
function startGame(name1, name2){
    document.getElementById("firstPlayerWins").textContent = name1+" total wins: "+firstPlayerTotalScore;
    document.getElementById("secondPlayerWins").textContent = name2+" total wins: "+secondPlayerTotalScore;
    document.getElementById("firstPlayer").textContent = name1+": "+firstPlayerScore;
    document.getElementById("secondPlayer").textContent = name2+": "+secondPlayerScore;
    // empty the openCards array
    openedCards = [];

    // shuffle deck
    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
}

// @description toggles open and show class to display cards
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};

// @description add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
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
            console.log(matchCounter);
            if(matchCounter == (cards.length)/2){
                congratulations();
            }
        } else {
            updateTurn();
            unmatched();
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
// @description when cards match
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}


// description when cards don't match
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


// @description disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


// @description enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}

// @description congratulations when all cards match, show modal and moves, time and rating
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

        //closeicon on modal
        matchCounter = 0;
        firstPlayerScore = 0;
        secondPlayerScore = 0;
        closeModal();
    };
}

// @description close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}

// @desciption for user to play Again 
function playAgain(){
    //var name1 = document.getElementById("fplayer").value;
    //var name2 = document.getElementById("lplayer").value;
    modal.classList.remove("show");
    startGame(firstPlayer, secondPlayer);
}

// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",congratulations);
};