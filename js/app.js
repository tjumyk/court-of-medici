/* 
An HTML5 implementation of the card game: "Court of the Medici".

Author: tjumyk, https://github.com/tjumyk/court-of-medici
Using Kinetic Canvas Library, http://www.kineticjs.com/
*/
var game = {};

$(document).ready(function() {
    initConstants();
    $("#container")[0].oncontextmenu = function() {
        return false;
    };
    $("#container")[0].onmousedown = function() {
        return false;
    };
    var stage = new Kinetic.Stage({
        container: "container",
        width: game.width,
        height: game.height
    });
    game.stage = stage;
    loaddingStage(stage);
    loadImages(function() {
        initData();
        initStage(stage);
        $("body").animate({scrollTop: $("#setFullscreen").offset().top}, 1000);
        setFullScreen(stage);
    });
});

function setFullScreen(stage) {
    if (window.fullScreenApi.supportsFullScreen && window.fullScreenApi.prefix == "webkit") {
        log("Using HTML5 fullscreen API");
        $("#setFullscreen").removeClass("notdecided");
        $("#setFullscreen").click(function() {
            $("#container").requestFullScreen();
        });
        $("#container").fullscreenchange(function(e) {
            if (window.fullScreenApi.isFullScreen()) {
                $(this).addClass("fullscreen");
                stage.setSize(window.screen.width, window.screen.height);
                initStage(stage);
            } else {
                $(this).removeClass("fullscreen");
                stage.setSize(game.width, game.height);
                initStage(stage);
            }
        });
    } else {
        log("Pity! HTML5 fullscreen API not fully supported!");
        $("#setFullscreen").remove();
        $("header").addClass("nofullscreen");
    }
}

function log(msg) {
    var date = new Date();
    var line = "[" + date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds() + "] " + msg;
    if (window.console && window.console.debug)
        window.console.debug(line);
    else if (window.console && window.console.log)
        window.console.log(line);
    var debug = $("#debug");
    if (debug.length > 0) {
        debug.val(debug.val() + line + "\n");
        if (debug[0].scrollByLines)
            debug[0].scrollByLines(1);
    }
}

function error(msg) {
    alert(msg);
    var date = new Date();
    var line = "[" + date.getFullYear() + "/" + date.getMonth() + "/" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds() + "] " + msg;
    if (window.console && window.console.error)
        window.console.error(line);
    var debug = $("#debug");
    if (debug.length > 0) {
        debug.val(debug.val() + line + "\n");
        if (debug[0].scrollByLines)
            debug[0].scrollByLines(1);
    }
}

function initConstants() {
    log("Initializing Constants...");
    game.width = 1200;
    game.height = 600;
    game.image_url = "image/CotM_Box.jpg";
    game.houses = [];
    game.houses[0] = {
        name: "Della Rovere",
        color: "#2C2966",
        text_color: "yellow",
        image_url: "image/courtmedicicarddback.png",
        cards: [
            {value: 0,name: "Minister",image_url: "image/courtmedicicardd0.png"}, 
            {value: 1,name: "Lady-in-Waiting",image_url: "image/courtmedicicardd1.png"}, 
            {value: 2,name: "Chamberlain",image_url: "image/courtmedicicardd2.png"}, 
            {value: 3,name: "Sculptor",image_url: "image/courtmedicicardd3.png"}, 
            {value: 4,name: "Playwright",image_url: "image/courtmedicicardd4.png"}, 
            {value: 5,name: "Architect",image_url: "image/courtmedicicardd5.png"}, 
            {value: 6,name: "Banker",image_url: "image/courtmedicicardd6.png"}, 
            {value: 7,name: "Knight",image_url: "image/courtmedicicardd7.png"}, 
            {value: 8,name: "Lady",image_url: "image/courtmedicicardd8.png"}, 
            {value: 9,name: "Præfect",image_url: "image/courtmedicicardd9.png"}, 
            {value: 10,name: "Count",image_url: "image/courtmedicicardd10.png"}, 
            {value: 'x',name: "Jester",image_url: "image/courtmedicicarddx.png",x_value: 1}, 
            {value: 15,name: "Duke",image_url: "image/courtmedicicardd15.png"}
        ]
    };
    for (var i = 0; i < game.houses[0].cards.length; i++)
        game.houses[0].cards[i].house = game.houses[0];
    
    game.houses[1] = {
        name: "Gonzaga",
        color: "#911B1D",
        text_color: "white",
        image_url: "image/courtmedicicardgback.png",
        cards: [
            {value: 0,name: "Minister",image_url: "image/courtmedicicardg0.png"}, 
            {value: 1,name: "Lady-in-Waiting",image_url: "image/courtmedicicardg1.png"}, 
            {value: 2,name: "Friar",image_url: "image/courtmedicicardg2.png"}, 
            {value: 3,name: "Painter",image_url: "image/courtmedicicardg3.png"}, 
            {value: 4,name: "Poet",image_url: "image/courtmedicicardg4.png"}, 
            {value: 5,name: "Scholar",image_url: "image/courtmedicicardg5.png"}, 
            {value: 6,name: "Merchant",image_url: "image/courtmedicicardg6.png"}, 
            {value: 7,name: "Captain-General",image_url: "image/courtmedicicardg7.png"}, 
            {value: 8,name: "Lord",image_url: "image/courtmedicicardg8.png"}, 
            {value: 9,name: "Cardinal",image_url: "image/courtmedicicardg9.png"}, 
            {value: 10,name: "Countess",image_url: "image/courtmedicicardg10.png"}, 
            {value: 'x',name: "Jester",image_url: "image/courtmedicicardgx.png",x_value: 1}, 
            {value: 15,name: "Duke",image_url: "image/courtmedicicardg15.png"}
        ]
    };
    for (var i = 0; i < game.houses[1].cards.length; i++)
        game.houses[1].cards[i].house = game.houses[1];
}

function loadImage(obj, callback) {
    if (obj.image_url && !obj.image_obj) {
        obj.image_obj = new Image();
        obj.image_obj.src = obj.image_url;
        obj.image_obj.onload = function() {
            log("Image loded：" + obj.image_url);
            callback();
        };
    }
}

function loadImages(callback) {
    loadImage(game, function() {
        var houseIndex = 0;
        var loadHouseImage = function() {
            if (houseIndex < game.houses.length) {
                var house = game.houses[houseIndex];
                var cardIndex = 0;
                var loadCardImage = function() {
                    if (cardIndex < house.cards.length)
                        loadImage(house.cards[cardIndex], function() {
                            cardIndex++;
                            loadCardImage();
                        });
                    else {
                        loadImage(house, function() {
                            houseIndex++;
                            loadHouseImage();
                        });
                    }
                }
                loadCardImage();
            } else {
                callback();
            }
        }
        loadHouseImage();
    });
}

function buildDrawDeck(house_index) {
    log("Building draw deck...");
    var indexes = [];
    var card_source = game.houses[house_index].cards;
    var cards = [];
    for (var i = 0; i < card_source.length - 1; i++) {
        cards[i * 2] = cards[i * 2 + 1] = card_source[i];
    }
    cards[card_source.length * 2 - 2] = card_source[card_source.length - 1];
    for (var i = 0; i < cards.length; i++) {
        indexes[i] = i;
    }
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < cards.length; j++) {
            var ind = Math.floor(Math.random() * cards.length);
            var temp = indexes[j];
            indexes[j] = indexes[ind];
            indexes[ind] = temp;
        }
    }
    var draw_deck = [];
    for (var i = 0; i < cards.length; i++) {
        draw_deck[i] = cards[indexes[i]];
    }
    return draw_deck;
}

function initData() {
    log("Initializing game data...");
    game.inner_circle = [];
    game.outter_circle = [];
    game.players = [];
    game.ended = false;
    game.winner_house = null;
    
    var order = [0, 0];
    if (Math.random() < 0.5)
        order[0] = 1;
    else
        order[1] = 1;
    
    for (var i = 0; i < 2; i++) {
        game.players[i] = {
            house: game.houses[order[i]],
            hand_deck: [],
            discarded_deck: [],
            draw_deck: buildDrawDeck(order[i]),
            max_play_value: 10000,
            draw_card: function() {
                var obj = this;
                var card = (function() {
                    if (obj.draw_deck.length <= 0) {
                        return null;
                    }
                    var card = obj.draw_deck.shift();
                    //Fill empty position in hand deck
                    for (var i = 0; i < obj.hand_deck.length; i++) {
                        if (obj.hand_deck[i] == null) {
                            obj.hand_deck[i] = card;
                            return card;
                        }
                    }
                    obj.hand_deck.push(card);
                    return card;
                })();

                //judge whether can play
                var can_play = false;
                for (var i = 0; i < this.hand_deck.length; i++) {
                    var card = this.hand_deck[i];
                    if (card == null)
                        continue;
                    var value = card.value;
                    if (isNaN(value)) {
                        value = card.x_value;
                    }
                    if (value <= this.max_play_value) {
                        can_play = true;
                        break;
                    }
                }
                if (!can_play) {
                    log("Player cannot play any cards, game terminated!");
                    end_game();
                    return;
                }
                
                if (card != null && this.draw_deck.length == 0) { //last card in draw deck
                    var value = card.value;
                    if (isNaN(value)) { //value == 'x'
                        card.x_value = 10; //default to 10, this is not strictly obey the original rules, just for easier programming.
                        value = card.x_value;
                    }
                    this.max_play_value = value;
                    log("Max play value is set to " + this.max_play_value);
                    render();
                }
            },
        }
    }

    //Set 8 cards for inner circle
    var player_0_start_value = 0;
    var player_1_start_value = 0;
    for (var i = 0; i < 8; i++) {
        var deck = [];
        game.inner_circle[i] = deck;
        if (i < 4) {
            var card = game.players[0].draw_deck.shift();
            if (!isNaN(card.value))
                player_0_start_value += card.value;
            else //value = 'x'
                player_0_start_value += 1;
            deck.push(card);
        } else {
            var card = game.players[1].draw_deck.shift();
            if (!isNaN(card.value))
                player_1_start_value += card.value;
            else //value = 'x'
                player_1_start_value += 1;
            deck.push(card);
        }
    }

    //deciding first player
    log("Player 0 Start Value: " + player_0_start_value);
    log("Player 1 Start Value: " + player_1_start_value);
    if (player_0_start_value < player_1_start_value) {
        game.currentPlayer = 1;
        log("Player 1 first!");
    } else if (player_0_start_value > player_1_start_value) {
        game.currentPlayer = 0;
        log("Player 0 first!");
    } else {
        if (Math.random() < 0.5) {
            game.currentPlayer = 0;
            log("Player 0 first!");
        } else {
            game.currentPlayer = 1;
            log("Player 1 first!");
        }
    }

    //Set hand deck
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 5; j++) {
            var card = game.players[i].draw_deck.shift();
            game.players[i].hand_deck[j] = card;
        }
    }
    
    game.action = "alliance";
}

function nextPlayer() {
    if (!judgeGameEnd()) {
        if (game.currentPlayer == 0) {
            game.currentPlayer = 1;
            log("Player 1's turn");
        } else {
            game.currentPlayer = 0;
            log("Player 0's turn");
        }
    } else {
        log("Not both of the two houses exist in the Inner Circle, game terminated!");
        end_game();
    }
}

function judgeGameEnd() {
    var house_0_inner = false;
    var house_1_inner = false;
    for (var i = 0; i < game.inner_circle.length; i++) {
        var deck = game.inner_circle[i];
        for (var j = 0; j < deck.length; j++) {
            if (deck[j].house.name == game.houses[0].name)
                house_0_inner = true;
            else
                house_1_inner = true;
            if (house_0_inner && house_1_inner) {
                return false;
            }
        }
    }
    return true;
}

function end_game() {
    log("Calculating Points");
    game.ended = true;
    
    var winner_house = null;
    var house_0_value = 0;
    var house_1_value = 0;
    var house_0_count = 0;
    var house_1_count = 0;
    for (var i = 0; i < game.inner_circle.length; i++) {
        var deck = game.inner_circle[i];
        for (var j = 0; j < deck.length; j++) {
            var card = deck[j];
            var value = card.value;
            if (isNaN(value)) // value == 'x'
                value = 1;
            if (card.house.name == game.houses[0].name) {
                house_0_value += value;
                house_0_count++;
            } else {
                house_1_value += value;
                house_1_count++;
            }
        }
    }
    for (var i = 0; i < game.outter_circle.length; i++) {
        var deck = game.outter_circle[i];
        for (var j = 0; j < deck.length; j++) {
            var card = deck[j];
            var value = card.value;
            if (isNaN(value)) // value == 'x'
                value = 1;
            if (card.house.name == game.houses[0].name) {
                house_0_value += value;
                house_0_count++;
            } else {
                house_1_value += value;
                house_1_count++;
            }
        }
    }
    
    if (house_0_value < house_1_value)
        winner_house = game.houses[1];
    else if (house_0_value > house_1_value)
        winner_house = game.houses[0];
    else {
        if (house_0_count < house_1_count)
            winner_house = game.houses[1];
        else if (house_0_count > house_1_count)
            winner_house = game.houses[0];
    }
    
    log("[Game Result] Player 0's total value: " + house_0_value);
    log("[Game Result] Player 1's total value: " + house_1_value);
    log("[Game Result] Player 0's total nobles: " + house_0_count);
    log("[Game Result] Player 1's total nobles: " + house_1_count);
    
    game.winner_house = winner_house;
    if (game.winner_house == null)
        log("[Game Result] It's a draw!");
    else
        log("[Game Result] Winner is House " + game.winner_house.name);
    
    render();
}

function loaddingStage(stage) {
    log("Showing loading state...");
    var layer = new Kinetic.Layer();
    var text = new Kinetic.Text({
        x: stage.getWidth() / 2 - 200,
        y: stage.getHeight() / 2 - 30,
        width: 400,
        text: "Loading...",
        fontSize: 46,
        fontFamily: "Calibri",
        textFill: "whitesmoke",
        align: 'center',
        shadow: {
            offset: {
                x: 5,
                y: 5
            }
        }
    });
    layer.add(text);
    stage.add(layer);
}

function initStage(stage) {
    log("Initializing stage...");
    stage.clear();
    game.background = new Kinetic.Group();
    var bg_rect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: stage.getWidth(),
        height: stage.getHeight(),
        fill: {
            start: {
                x: stage.getWidth() / 2,
                y: stage.getHeight() / 2,
                radius: 0
            },
            end: {
                x: stage.getWidth() / 2,
                y: stage.getHeight() / 2,
                radius: stage.getHeight() / 2
            },
            colorStops: [0, '#9dcce1', 1, '#52a2c8']
        },
        strokeWidth: 0
    });
    var offset_y = stage.getHeight() / 4.4;
    var outter_rect = new Kinetic.Rect({
        x: 10,
        y: offset_y - 5,
        width: stage.getWidth() - 20,
        height: offset_y * 2.4,
        stroke: 'lightblue',
        strokeWidth: 5,
        shadow: {
            color: 'black',
            blur: 1,
            offset: [2, 2],
            alpha: 0.2
        },
        cornerRadius: 10,
    });
    var center_line = new Kinetic.Line({
        points: [50, offset_y * 2.2, stage.getWidth() - 50, offset_y * 2.2],
        stroke: "#9dcce1",
        strokeWidth: 3,
        lineJoin: "round",
        alpha: 0.6,
        shadow: {
            color: 'black',
            blur: 1,
            offset: [2, 2],
            alpha: 0.2
        }
    });
    var center_text = new Kinetic.Text({
        x: stage.getWidth() / 2 - 200 / 2,
        y: offset_y * 2.2 - 20,
        text: "Inner Circle\nOutter Circle",
        alpha: 0.8,
        fontSize: 18,
        fontFamily: 'Calibri',
        textFill: "#52a2c8",
        width: 200,
        align: 'center',
    });
    game.background.add(bg_rect);
    game.background.add(outter_rect);
    game.background.add(center_line);
    game.background.add(center_text);
    
    if (!game.stageInit) {
        render(true);
        game.stageInit = true;
    } else {
        render();
    }
}

function render(init) {
    log("Rendering...");
    var stage = game.stage;
    stage.clear();
    var layer = new Kinetic.Layer();
    stage.add(layer);
    layer.add(game.background);
    if (init) {
        layer.setAlpha(0);
        layer.transitionTo({
            duration: 1.5,
            easing: 'ease-in',
            alpha: 1.0
        });
    }
    //Deciding card size
    var card_h = stage.getHeight() / 4.4 / 1.1;
    var card_w = stage.getWidth() / 10 / 1.05;
    if (card_h / 7 * 5 < card_w)
        card_w = card_h / 7 * 5;
    else
        card_h = card_w / 5 * 7;

    //Deciding offsets
    var offset_y = stage.getHeight() / 4.4;
    var card_offset_x = stage.getWidth() / (Math.max(game.inner_circle.length, game.outter_circle.length) + 1);
    var card_offset_y = card_h * 0.15;
    var hand_card_offset_x = stage.getWidth() / 10;

    //Storing offsets
    game.offset_y = offset_y;
    game.card_w = card_w;
    game.card_h = card_h;
    game.card_offset_x = card_offset_x;
    game.card_offset_y = card_offset_y;
    
    var player_group_1 = new Kinetic.Group({
        x: hand_card_offset_x,
        y: 0 * offset_y
    });
    var inner_group = new Kinetic.Group({
        x: 0,
        y: 1 * offset_y
    });
    var outter_group = new Kinetic.Group({
        x: 0,
        y: 2.2 * offset_y
    });
    var player_group_0 = new Kinetic.Group({
        x: hand_card_offset_x,
        y: 3.4 * offset_y
    });
    
    var hand_group_0 = new Kinetic.Group({
        x: 0,
        y: 0
    });
    var hand_group_1 = new Kinetic.Group({
        x: 0,
        y: 0
    });
    
    player_group_0.add(hand_group_0);
    player_group_1.add(hand_group_1);
    
    layer.add(inner_group);
    layer.add(outter_group);
    layer.add(player_group_0);
    layer.add(player_group_1);
    
    game.inner_group = inner_group;
    game.outter_group = outter_group;
    game.hand_group_0 = hand_group_0;
    game.hand_group_1 = hand_group_1;
    
    for (var i = 0; i < game.inner_circle.length; i++) {
        var deck = game.inner_circle[i];
        var group = new Kinetic.Group({
            x: (i + 0.5) * card_offset_x,
            y: 0
        });
        inner_group.add(group);
        for (var j = 0; j < deck.length; j++) {
            var card = deck[j];
            group.add(buildCardImage(0, j * card_offset_y, card_w, card_h, card, false));
        }
    }
    for (var i = 0; i < game.outter_circle.length; i++) {
        var deck = game.outter_circle[i];
        var group = new Kinetic.Group({
            x: (i + 0.5) * card_offset_x,
            y: 0
        });
        outter_group.add(group);
        for (var j = 0; j < deck.length; j++) {
            var card = deck[j];
            group.add(buildCardImage(0, j * card_offset_y, card_w, card_h, card, false));
        }
    }
    
    for (var i = 0; i < game.players[0].hand_deck.length; i++) {
        var card = game.players[0].hand_deck[i];
        if (game.currentPlayer == 0 && !game.ended)
            hand_group_0.add(buildCardImage(i * hand_card_offset_x, 0, card_w, card_h, card, true, hand_card_action_detect, i));
        else
            hand_group_0.add(buildCardImage(i * hand_card_offset_x, 0, card_w, card_h, card, false));
    }
    for (var i = 0; i < game.players[1].hand_deck.length; i++) {
        var card = game.players[1].hand_deck[i];
        if (game.currentPlayer == 1 && !game.ended)
            hand_group_1.add(buildCardImage(i * hand_card_offset_x, 0, card_w, card_h, card, true, hand_card_action_detect, i));
        else
            hand_group_1.add(buildCardImage(i * hand_card_offset_x, 0, card_w, card_h, card, false));
    }
    
    var draw_deck_0 = new Kinetic.Group({
        x: 6 * hand_card_offset_x,
        y: 0
    });
    var draw_deck_1 = new Kinetic.Group({
        x: 6 * hand_card_offset_x,
        y: 0
    });
    
    game.draw_deck_0 = draw_deck_0;
    game.draw_deck_1 = draw_deck_1;
    
    player_group_0.add(draw_deck_0);
    player_group_1.add(draw_deck_1);
    if (game.players[0].draw_deck.length > 0) {
        draw_deck_0.add(buildCardImage(0, 0, card_w, card_h, game.players[0].house, false));
    }
    if (game.players[1].draw_deck.length > 0)
        draw_deck_1.add(buildCardImage(0, 0, card_w, card_h, game.players[1].house, false));
    
    var dis_0 = game.players[0].discarded_deck;
    if (dis_0.length > 0)
        player_group_0.add(buildCardImage(7 * hand_card_offset_x, 0, card_w, card_h, dis_0[dis_0.length - 1], false));
    var dis_1 = game.players[1].discarded_deck;
    if (dis_1.length > 0)
        player_group_1.add(buildCardImage(7 * hand_card_offset_x, 0, card_w, card_h, dis_1[dis_1.length - 1], false));
    
    if (game.action == "alliance") {
        player_group_0.add(buildActionButton("alliance", 5 * hand_card_offset_x, 20, true));
        player_group_1.add(buildActionButton("alliance", 5 * hand_card_offset_x, 20, true));
        player_group_0.add(buildActionButton("conspire", 5 * hand_card_offset_x, 60, false));
        player_group_1.add(buildActionButton("conspire", 5 * hand_card_offset_x, 60, false));
    } else {
        player_group_0.add(buildActionButton("alliance", 5 * hand_card_offset_x, 20, false));
        player_group_1.add(buildActionButton("alliance", 5 * hand_card_offset_x, 20, false));
        player_group_0.add(buildActionButton("conspire", 5 * hand_card_offset_x, 60, true));
        player_group_1.add(buildActionButton("conspire", 5 * hand_card_offset_x, 60, true));
    }

    //game.winner_house = null;
    if (game.ended) {
        var result_text = "It's a Draw...";
        var result_color = "#ddd";
        var result_text_color = '#555';
        if (game.winner_house != null) {
            result_text = "Winner is House " + game.winner_house.name + "!";
            result_color = game.winner_house.color;
            result_text_color = game.winner_house.text_color;
        }
        
        var winner_layer = new Kinetic.Layer({
            draggable: true
        });
        var text = new Kinetic.Text({
            x: stage.getWidth() / 2 - 200,
            y: stage.getHeight() / 2 - 30,
            text: result_text,
            stroke: result_text_color,
            strokeWidth: 5,
            fill: result_color,
            fontSize: 24,
            fontFamily: 'Calibri',
            textFill: result_text_color,
            width: 400,
            padding: 20,
            align: 'center',
            fontStyle: 'italic',
            shadow: {
                color: 'black',
                blur: 1,
                offset: [10, 10],
                alpha: 0.2
            },
            cornerRadius: 10,
        });
        text.on("click", function() {
            window.location.reload();
        });
        text.on("mouseover", function() {
            document.body.style.cursor = "pointer";
        });
        text.on("mouseout", function() {
            document.body.style.cursor = "default";
        });
        winner_layer.add(text);
        stage.add(winner_layer);
    }
    
    stage.draw();
}

function buildActionButton(name, pos_x, pos_y, enable) {
    var btn = new Kinetic.Text({
        x: pos_x,
        y: pos_y,
        stroke: '#555',
        strokeWidth: 2,
        fill: enable ? (name == "alliance" ? 'lightblue' : '#e33') : 'grey',
        text: name,
        fontSize: 12,
        fontFamily: 'Calibri',
        textFill: enable ? (name == "alliance" ? '#555' : '#eee') : '#333',
        width: 80,
        padding: 5,
        align: 'center',
        fontStyle: 'italic',
        shadow: {
            color: 'black',
            blur: 1,
            offset: [5, 5],
            alpha: 0.2
        },
        cornerRadius: 5
    });
    
    (function() {
        var obj = btn;
        obj.on("mouseover", function() {
            document.body.style.cursor = "pointer";
        });
        obj.on("mouseout", function() {
            document.body.style.cursor = "default";
        });
        obj.on("click", function() {
            if (game.action != name) {
                log("Action changed to [" + name + "]");
                game.action = name;
                render();
            }
        });
    })();
    
    return btn;
}

function hand_card_action_detect(obj) {
    var pos = obj.getAbsolutePosition();
    //log("Drag Position:("+pos.x +","+ pos.y+")");

    //detect inner deck drop
    var inner_obj = game.inner_group.getChildren();
    for (var i = 0; i < inner_obj.length; i++) {
        var dect = inner_obj[i];
        if (rect_cover_detect(obj, dect, game.card_w, game.card_w, game.card_h, game.card_h + dect.getChildren().length * game.card_offset_y)) {
            log("Cover Detected with Inner " + i);
            obj.fade();
            var card = obj.attrs.source_obj;
            var card_index = obj.attrs.source_obj_index;
            var value = card.value;
            if (isNaN(value)) { //value == 'x'
                value = card.x_value;
            }
            log("[Action]" + game.action + ",[Card]" + card.name + "(" + value + ")" + ",[Deck]inner_circle[" + i + "]");
            do_action(card, game.inner_circle[i], game.inner_circle, i);
            game.players[game.currentPlayer].hand_deck[card_index] = null;
            var new_card = game.players[game.currentPlayer].draw_card();
            if (!game.ended) {
                nextPlayer();
                if (!game.ended)
                    render();
            }
            return;
        }
    }

    //detect outter deck drop
    var outter_obj = game.outter_group.getChildren();
    for (var i = 0; i < outter_obj.length; i++) {
        var dect = outter_obj[i];
        if (rect_cover_detect(obj, dect, game.card_w, game.card_w, game.card_h, game.card_h + dect.getChildren().length * game.card_offset_y)) {
            log("Cover Detected with Outter " + i);
            obj.fade();
            var card = obj.attrs.source_obj;
            var card_index = obj.attrs.source_obj_index;
            log("[Action]" + game.action + ",[Card]" + card.name + "(" + card.value + ")" + ",[Deck]outter_circle[" + i + "]");
            do_action(card, game.outter_circle[i], game.outter_circle, i);
            game.players[game.currentPlayer].hand_deck[card_index] = null;
            game.players[game.currentPlayer].draw_card();
            if (!game.ended) {
                nextPlayer();
                if (!game.ended)
                    render();
            }
            return;
        }
    }

    //detect outter area drop
    if (rect_cover_detect(obj, game.outter_group, game.card_w, game.stage.getWidth(), game.card_h, 1.2 * game.offset_y)) {
        log("Cover Detected with Outter Area");
        obj.fade();
        var card = obj.attrs.source_obj;
        var card_index = obj.attrs.source_obj_index;
        log("[Action]Send to court,[Card]" + card.name + "(" + card.value + ")" + ",[Deck]outter_circle[" + game.outter_circle.length + "]");
        var new_deck = [];
        new_deck.push(card);
        game.outter_circle.push(new_deck);
        game.players[game.currentPlayer].hand_deck[card_index] = null;
        game.players[game.currentPlayer].draw_card();
        if (!game.ended) {
            nextPlayer();
            if (!game.ended)
                render();
        }
        return;
    }

    //detect draw deck drop
    var draw_group = game.currentPlayer == 0 ? game.draw_deck_0 : game.draw_deck_1;
    if (draw_group.getChildren().length > 0) { //Remains some cards in draw deck, otherwise 'plan in future' is not allowed!
        if (rect_cover_detect(obj, draw_group, game.card_w, game.card_w, game.card_h, game.card_h)) {
            log("Cover Detected with draw deck");
            obj.fade();
            var card = obj.attrs.source_obj;
            var card_index = obj.attrs.source_obj_index;
            log("[Action]Plan for the future,[Card]" + card.name + "(" + card.value + ")" + ",[Deck]Draw deck");
            game.players[game.currentPlayer].draw_deck.push(card);
            game.players[game.currentPlayer].hand_deck[card_index] = null;
            game.players[game.currentPlayer].draw_card();
            if (!game.ended) {
                nextPlayer();
                if (!game.ended)
                    render();
            }
            return;
        }
    }
    
    obj.reset();
}

function discard_card(card) {
    if (card.house.name == game.players[0].house.name)
        game.players[0].discarded_deck.push(card);
    else
        game.players[1].discarded_deck.push(card);
}

function do_action(card, deck, container, index) {
    if (game.action == "alliance") {
        deck.push(card);
        if (card.value == 0) {
            if (deck.length >= 3) { //Special effect of Minister(0)
                log("Special effect of Minister(0) Activated!");
                for (var i = 0; i < deck.length - 1; i++)
                    discard_card(deck[i]);
                container[index] = [card];
            }
        } else if (card.value == 1) { //Special effect of Lady-in-waiting(1)
            log("Special effect of Lady-in-waiting(1) Activated!");
            container[index] = null;
            for (var i = index; i < container.length - 1; i++)
                container[i] = container[i + 1];
            container.pop();
            for (var i = 0; i < deck.length; i++)
                container.push([deck[i]]);
        }
    } else if (game.action == "conspire") {
        deck.push(card);
        var target_value = calculate_value(deck);
        log("Target Value = " + target_value);
        //Scan Inner Circle
        for (var i = 0; i < game.inner_circle.length; i++) {
            var d = game.inner_circle[i];
            if (d == deck)
                continue;
            var value = calculate_value(d);
            log("Current Value = " + value);
            if (value == target_value) { //discard this deck
                for (var j = 0; j < d.length; j++) {
                    var card = d[j];
                    discard_card(card);
                }
                for (var j = i; j < game.inner_circle.length - 1; j++)
                    game.inner_circle[j] = game.inner_circle[j + 1];
                game.inner_circle.pop();
            }
        }
        //Scan Outter Circle
        for (var i = 0; i < game.outter_circle.length; i++) {
            var d = game.outter_circle[i];
            if (d == deck)
                continue;
            var value = calculate_value(d);
            log("Current Value = " + value);
            if (value == target_value) { //discard this deck
                for (var j = 0; j < d.length; j++) {
                    var card = d[j];
                    discard_card(card);
                }
                for (var j = i; j < game.outter_circle.length - 1; j++)
                    game.outter_circle[j] = game.outter_circle[j + 1];
                game.outter_circle.pop();
            }
        }
    }
}

function calculate_value(deck) {
    var total = 0;
    for (var i = 0; i < deck.length; i++) {
        var value = deck[i].value;
        if (!isNaN(value)) {
            total += value;
        } else //value == 'x'
            total += deck[i].x_value;
    }
    return total;
}

function rect_cover_detect(obj1, obj2, w1, w2, h1, h2) {
    var pos1 = obj1.getAbsolutePosition();
    var pos2 = obj2.getAbsolutePosition();
    
    if (pos1 && pos2 && w1 && w2 && h1 && h2) {
        if (pos1.x > pos2.x + w2 - w1 / 2 
        || pos1.y > pos2.y + h2 - h1 / 2 
        || pos1.x + w1 / 2 < pos2.x 
        || pos1.y + h1 / 2 < pos2.y)
            return false;
        else
            return true;
    }
    return false;
}

function buildCardImage(x_pos, y_pos, w, h, obj, drag, dragendCallback, obj_index) {
    if (!obj || !obj.image_obj)
        return new Kinetic.Group();
    var image_obj = obj.image_obj
    var new_obj = new Kinetic.Image({
        x: x_pos,
        y: y_pos,
        start_x: x_pos,
        start_y: y_pos,
        image: image_obj,
        width: w,
        height: h,
        draggable: drag,
        shadow: {
            color: 'black',
            blur: 5,
            offset: [5, 5],
            alpha: 0.6
        },
        startScale: 1.0,
        source_obj: obj,
        source_obj_index: obj_index
    });
    if (drag) {
        (function() {
            var img = new_obj;
            var trans = null;
            img.reset = function() {
                if (trans) {
                    trans.stop();
                }
                trans = img.transitionTo({
                    duration: 0.3,
                    easing: 'ease-out',
                    shadow: {
                        offset: {
                            x: 5,
                            y: 5
                        }
                    },
                    x: img.attrs.start_x,
                    y: img.attrs.start_y,
                    scale: {
                        x: img.attrs.startScale,
                        y: img.attrs.startScale
                    }
                });
            }
            img.fade = function() {
                if (trans) {
                    trans.stop();
                }
                trans = img.transitionTo({
                    duration: 0.3,
                    easing: 'ease-out',
                    shadow: {
                        offset: {
                            x: 5,
                            y: 5
                        }
                    },
                    scale: {
                        x: img.attrs.startScale,
                        y: img.attrs.startScale
                    },
                    alpha: 0
                });
            }
            img.on('dragstart', function() {
                if (trans) {
                    trans.stop();
                }
                var s_obj = img.attrs.source_obj;
                if (s_obj && s_obj.value) {
                    var value = isNaN(s_obj.value) ? s_obj.x_value : s_obj.value;
                    if (value > game.players[game.currentPlayer].max_play_value) {
                        document.body.style.cursor = "not-allowed";
                    }
                }
                img.moveToTop();
                var parent = img.getParent();
                if (parent) {
                    parent.moveToTop();
                    var parent = parent.getParent();
                    if (parent) {
                        parent.moveToTop();
                    }
                }
                img.setAttrs({
                    shadow: {
                        offset: {
                            x: 10,
                            y: 10
                        }
                    },
                    scale: {
                        x: img.attrs.startScale * 1.05,
                        y: img.attrs.startScale * 1.05
                    }
                });
            });
            
            img.on('dragend', function() {
                if (dragendCallback) {
                    var s_obj = img.attrs.source_obj;
                    if (s_obj && s_obj.value) {
                        var value = isNaN(s_obj.value) ? s_obj.x_value : s_obj.value;
                        if (value <= game.players[game.currentPlayer].max_play_value) {
                            dragendCallback(new_obj);
                            return;
                        } else { //Bigger than max_play_value, forbidden!
                            img.reset();
                            return;
                        }
                    } else {
                        dragendCallback(new_obj);
                        return;
                    }
                }
                
                trans = img.transitionTo({
                    duration: 0.5,
                    easing: 'elastic-ease-out',
                    shadow: {
                        offset: {
                            x: 5,
                            y: 5
                        }
                    },
                    scale: {
                        x: img.attrs.startScale,
                        y: img.attrs.startScale
                    }
                })
            });
            img.on("mouseover", function() {
                document.body.style.cursor = "pointer";
            });
            img.on("mouseout", function() {
                document.body.style.cursor = "default";
            });
        })();
    }
    
    if (obj.x_value) {
        (function() {
            var img = new_obj;
            var target = obj;
            img.on("dblclick", function() {
                var value = prompt("Please enter new value for X", target.x_value);
                if (value != null && value != "") {
                    if (isNaN(value))
                        alert("Input Invalid! Only Number Acctepable!");
                    else {
                        var val = parseInt(value);
                        if (val >= 1 && val <= 10) {
                            log("X value updated to " + val);
                            target.x_value = val;
                            render();
                        } else
                            alert("Input Invalid! Acceptable Range:[1-10]!");
                    }
                }
            });
            img.on("mouseover", function() {
                document.body.style.cursor = "help";
            });
            img.on("mouseout", function() {
                document.body.style.cursor = "default";
            });
        })();
    }
    return new_obj;
}
