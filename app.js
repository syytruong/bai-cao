var cardsApi = 'https://deckofcardsapi.com/api/deck';

var app = new Vue({
    el: '#app',
    data: {
        roundNum: 0,
        gold: {
            you: 25000,
            player1: 25000,
            player2: 25000,
            player3: 25000,
        },
        roundStarted: false,
        roundOver: false,
        deck: {
            id: null,
            remain: null,
        },

        cards: {
            you: [],
            player1: [],
            player2: [],
            player3: [],
        }
    },

    methods: {

        startGame: function() {
            app.roundNum++;
            app.roundStarted = true;
            app.getDeck();
            app.gold.you -= 5000;
            app.gold.player1 -= 5000;
            app.gold.player2 -= 5000;
            app.gold.player3 -= 5000;
            console.log('Game started');
        },

        getDeck: function () {
            $.get(cardsApi + '/new/shuffle/?deck_count=1')
              .done(function(data) {
              app.deck.id = data.deck_id;
              app.deck.remaning = data.remaining;
            });
          },

        drawCards: function() {
            $.get(cardsApi + '/' + this.deck.id + '/draw/?count=3').done(function(data) {
                app.deck.remain = data.remain;
                app.cards.you = app.cards.you.concat(data.cards);
                console.log('Your cards: ');
                console.log(app.cards.you);
                console.log('Your point is: ' + app.cardSum(app.cards.you));
            });

            $.get(cardsApi + '/' + this.deck.id + '/draw/?count=3').done(function(data) {
                app.deck.remain = data.remain;
                app.cards.player1 = app.cards.player1.concat(data.cards);
                console.log(app.cards.player1);
                console.log('Player1 point is: ' + app.cardSum(app.cards.player1));
            });

            $.get(cardsApi + '/' + this.deck.id + '/draw/?count=3').done(function(data) {
                app.deck.remain = data.remain;
                app.cards.player2 = app.cards.player2.concat(data.cards);
                console.log(app.cards.player2);
                console.log('Player2 point is: ' + app.cardSum(app.cards.player2));
            });

            $.get(cardsApi + '/' + this.deck.id + '/draw/?count=3').done(function(data) {
                app.deck.remain = data.remain;
                app.cards.player3 = app.cards.player3.concat(data.cards);
                console.log(app.cards.player3);
                console.log('Player3 point is: ' + app.cardSum(app.cards.player3));
            });
        },

        cardValue: function(card) {
            switch(card.code.charAt(0)) {
                case 'A' : return 1;
                case '0':
                case 'J':
                case 'Q':
                case 'K':
                    return 10;
                default:
                    return parseInt(card.code.charAt(0));
            }
        },

        cardSum: function(cards) {
            var tempSum = cards.reduce(function(acc, card) {
                return acc + app.cardValue(card);
            }, 0);
            while (tempSum >= 10) {
                tempSum -= 10;
            }
            return tempSum;
        },

        endGame: function() {
            app.calculateEndGame();
        },
        calculateEndGame: function() {
            app.calculateWinner();
            app.roundOver = true;
        },

        calculateWinner: function() {
            var winner;

            if (app.allFaceCard(app.cards.you)){
                winner = 'You';
            }else if(app.allFaceCard(app.cards.player1)){
                winner = 'Player1';
            }else if(app.allFaceCard(app.cards.player2)){
                winner = 'Player2';
            }else if(app.allFaceCard(app.cards.player3)){
                winner = 'Player3';
            }

            if(app.cardSum(app.cards.you) > app.cardSum(app.cards.player1)) {
                if(app.cardSum(app.cards.you) > app.cardSum(app.cards.player2)){
                    if(app.cardSum(app.cards.you) > app.cardSum(app.cards.player3)){
                        winner = 'You';
                    }
                }
            }
            if(app.cardSum(app.cards.player1) > app.cardSum(app.cards.you)){
                if(app.cardSum(app.cards.player1) > app.cardSum(app.cards.player2)){
                    if(app.cardSum(app.cards.player1) > app.cardSum(app.cards.player3)){
                        winner = 'Player1';
                    }
                }
            }

            if(app.cardSum(app.cards.player2) > app.cardSum(app.cards.you)){
                if(app.cardSum(app.cards.player2) > app.cardSum(app.cards.player1)){
                    if(app.cardSum(app.cards.player2) > app.cardSum(app.cards.player3)){
                        winner = 'Player2';
                    }
                }
            }

            if(app.cardSum(app.cards.player3) > app.cardSum(app.cards.you)){
                if(app.cardSum(app.cards.player3) > app.cardSum(app.cards.player1)){
                    if(app.cardSum(app.cards.player3) > app.cardSum(app.cards.player2)){
                        winner = 'Player3';
                    }
                }
            }

            console.log(winner);
            app.setWinner(winner);

            console.log('Your gold is: ' + app.gold.you);
            console.log('Player1 gold is: ' + app.gold.player1);
            console.log('Player2 gold is: ' + app.gold.player2);
            console.log('Player3 gold is: ' + app.gold.player3);
        },

        setWinner: function(winner) {
            app.gold[winner.toLowerCase()] += 20000;
            app.lastWinner = winner;
        },

        allFaceCard: function(cards){
            var numFaceCard = 0;
            for(let i = 0; i < cards.length; i++){
                if(cards[i].code.charAt(0) == 'J' || cards[i].code.charAt(0) == 'Q' || cards[i].code.charAt(0) == 'K'){
                    numFaceCard++;
                }
            }
            if (numFaceCard = 3) {
                return true;
            }
        },

        shuffleCard: function() {
            $.get(cardsApi + '/' + this.deck.id + '/shuffle/');
        },

        resetGame: function() {
            app.gold.you -= 5000;
            app.gold.player1 -= 5000;
            app.gold.player2 -= 5000;
            app.gold.player3 -= 5000;
            app.deck.id = null;
            app.deck.remain = null;
            app.cards.you = [];
            app.cards.player1 = [];
            app.cards.player2 = [];
            app.cards.player3 = [];
            app.roundOver = false;
            app.lastWinner = null;
        },

        restartGame: function() {
            app.resetGame();
            app.getDeck();
            console.log('Game has restarted!');
        },

        // computed: {
        //     sortedScores: function() {
        //       var tempScores = [];
        
        //       for (var s in app.gold) {
        //         tempScores.push([s, app.gold[s]]);
        //       }
        
        //       tempScores.sort(function(a, b) {
        //         return a[1] - b[1];
        //       }).reverse();
        
        //       return tempScores;
        //     }
        //   },
        capitalize: function(text) {
              return text[0].toUpperCase() + text.slice(1);
        }

    }
})