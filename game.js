//This code looks terrible, I do not have time to make nice classes, functions, event controllers, etc...
// I had less than 30 days to make this AND I still work full-time at a software company...
//Enjoy looking at the code!

let gameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.getContext("2d").font = this.fontSize+"px main";
        transition();
    },
    title: function() {
        this.currentFrame = getUrlParam('frame', 1);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        $('#preloader').hide();
        showStartScreen();
    },
    data: null,
    variables: null,
    objectives: null,
    variable_icons: null,
    fontSize: 22,
    currentFrame: 0,
    uuid: uuidv4()
}

//With the current settings and testing on a 55Inch tv (4k) (110% zoom), The max question length is 375, while the max option length is 140

function startGame(){
    gameArea.start();
    debuggerLog("The game has started!");
}

//Main drawing function
function createFrame(callback){

    let frame = gameArea.data.frames[gameArea.currentFrame];

    drawBackgrounds(frame['backgrounds'], function(){
        drawImages(frame['images'], function(){
            drawVariables(function (){
                drawQuestion(frame['question'], function(){
                    drawOptions(frame['options'], function(){

                        var time = 10;

                        if (frame['time'] != null) {
                            time = frame['time']
                        }

                        sendFrame(replaceAllStringVariables(frame['question']),frame['options'], time);

                        logFrameInfo();

                        callback(true);
                    });
                });
            });
        });
    });

}

function drawQuestion(question, callback) {

    question = replaceAllStringVariables(question);

    var ctx = gameArea.canvas.getContext("2d");
    var width = 600;
    var lineHeight = gameArea.fontSize;
    var lineCount = getLines(ctx,question,width).length;
    var height = lineCount * lineHeight;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0,(window.innerHeight / 2) + 50, window.innerWidth , window.innerHeight - (window.innerHeight / 2) );
    ctx.strokeStyle = "#2ecc71";
    ctx.rect((window.innerWidth / 2) - 310,(window.innerHeight / 2) + 70, width + 20, height + gameArea.fontSize + 10);
    ctx.stroke();
    ctx.fillStyle = "#FFFFFF";

    typeOut(question,(window.innerWidth / 2) - 300,(window.innerHeight / 2) + 100, gameArea.fontSize, width, "#FFFFFF" ,function(){
        callback(true);
    });
}

function drawOptions(optionsArray, callback) {
    var ctx = gameArea.canvas.getContext("2d")

    for (var optionKey in optionsArray){
        var value = optionsArray[optionKey];

        var x = 0;
        var y = 0;

        var message = optionKey + "  : " + value;

        switch (optionKey){
            case "A": { x = (window.innerWidth / 2) - 300; y = (window.innerHeight) - 250; break;}
            case "B": { x = (window.innerWidth / 2) + 40; y = (window.innerHeight) - 250; break;}
            case "C": { x = (window.innerWidth / 2) - 300; y = (window.innerHeight) - 150; break;}
            case "D": { x = (window.innerWidth / 2) + 40; y = (window.innerHeight) - 150 ; break;}
            case "all": {
                message = "Press any key to continue...";
                x = (window.innerWidth / 2) - (ctx.measureText(message).width / 2);
                y = (window.innerHeight) - 100 ;
                break;
            }
        }

        var optionLines = getLines(ctx,  message,300);

        for (var line in optionLines){
            fadeInText(ctx,optionLines[line],x,y + (line * gameArea.fontSize - 2), 255,255,255);
        }
    }

    setTimeout(function(){
        callback(true);
    },500);

}

function drawImages(imagesArray, callback) {
    var ctx = gameArea.canvas.getContext("2d");
    var imgs = [];
    var imgIndex = 0;

    for (var image in imagesArray){
        var imageData = imagesArray[image];
        var width = imageData['width'];
        var height = imageData['height'];
        var x = imageData['x'];
        var y = imageData['y'];
        var rotation = imageData['rotation'];
        var mirrorX = imageData['mirrorX'];
        var mirrorY = imageData['mirrorY'];
        var url = imageData['url'];

        imgs[imgIndex] = new Image();
        // img.src = url;

        imgs[imgIndex].onload = function(){


            var thisX = x;
            var thisY = y;
            var thisWidth = width;
            var thisHeight = height;
            var thisRotation = rotation;
            var thisMirrorX = mirrorX;
            var thisMirrorY = mirrorY;


            return function(){
                ctx.save(); //SAVES ALL VALUES ON THE CANVAS TO THERE POSITION.

                var autoWidth = this.width;
                var autoHeight = this.height;

                if (thisWidth == 'auto') {
                    var setSide = thisWidth;
                    var oppositeSide = thisHeight;
                    var autoSetSide = autoWidth;
                    var autoOppositeSide = autoHeight;

                    if (setSide >= autoSetSide) {
                        //    Great than
                        var multiplier = oppositeSide / autoOppositeSide  ;
                        setSide = autoSetSide * multiplier;
                    } else {
                        //    Less than
                        var divisible = autoOppositeSide / oppositeSide;
                        setSide = autoSetSide / divisible;
                    }

                    thisWidth = setSide;

                } else if (thisHeight == 'auto') {
                    var setSide = thisHeight;
                    var oppositeSide = thisWidth;
                    var autoSetSide = autoHeight;
                    var autoOppositeSide = autoWidth;

                    if (setSide >= autoSetSide) {
                        //    Great than
                        var multiplier = oppositeSide / autoOppositeSide  ;
                        setSide = autoSetSide * multiplier;
                    } else {
                        //    Less than
                        var divisible = autoOppositeSide / oppositeSide;
                        setSide = autoSetSide / divisible;
                    }

                    thisHeight = setSide;

                }

                thisHeight = Math.floor(parseInt(thisHeight));
                thisWidth = Math.floor(parseInt(thisWidth));

                thisX = (window.innerWidth / 2) + thisX;
                thisY = (window.innerHeight / 2) + thisY - thisHeight;

                ctx.drawImage(this,thisX,thisY,thisWidth,thisHeight);

                ctx.restore(); //RESTORES ALL THE VALUES THAT WERE SAVED

            }

        }();
        url = url + '?cacheControlID='+gameArea.uuid;
        imgs[imgIndex].src = url;
        imgIndex += 1;
    }
    callback(true);
}

function drawBackgrounds(backgroundArray, callback){
    var ctx = gameArea.canvas.getContext("2d");
    for (var background in backgroundArray) {
        background = backgroundArray[background];
        let color = background['color'];
        let x = background['x'];
        let y = background['y'];
        var width = background['width'];
        var height = background['height'];

        if (width.includes("%")) {
            var percent = width.replace(/[^0-9.-]/g,'');
            var decimal = parseInt(percent) / 100;
            width = window.innerWidth * decimal;
        }

        if (height.includes("%")) {
            var percent = height.replace(/[^0-9.-]/g,'');
            var decimal = parseInt(percent) / 100;
            height = window.innerHeight * decimal;
        }

        if (x.includes("left")) {
            x = 0
        } else if (x.includes("center")) {
            x = window.innerWidth / 2;
        } else if (x.includes("right")) {
            x = window.innerWidth;
        }

        if (y.includes("top")) {
            y = 0;
        } else if (y.includes("center")) {
            y = (window.innerHeight / 2 + 50) - height;
        } else if (y.includes("bottom")) {
            y = window.innerHeight;
        }


        ctx.fillStyle = color;
        ctx.fillRect(parseInt(x),parseInt(y),width,height);

    }

    callback(true);
}

function drawVariables(callback){
    //200 px width
    //30 px height

    var ctx = gameArea.canvas.getContext("2d");
    var variableIcons = gameArea.variable_icons;
    var imgs = [];
    var imgIndex = 0;
    for (var icon in variableIcons) {
        var variable = icon;
        var url = variableIcons[icon];

        imgs[imgIndex] = new Image();

        imgs[imgIndex].onload = function(variable){

            var thisVariable = variable;

            var variableValue = gameArea.variables[thisVariable];
            var objectiveValues = getObjectiveValues();

            if (objectiveValues == null) {
                return;
            }

            var variableGoal = objectiveValues[thisVariable];

            var variableTextWidth = ctx.measureText(variableValue).width;

            var thisWidth = 250;
            var thisHeight = 50;
            var thisX = (window.innerWidth - 20) - thisWidth;
            var thisY = (thisHeight + 10) * (imgIndex + 1) - 50;

            var imgWidth = 35;
            var imgHeight = 35;
            var imgX = thisX + 5;
            var imgY = thisY + 7.5;

            var barOuterWidth = 180;
            var barOuterHeight = 35;
            var barOutX = imgX + imgWidth + 5;
            var barOutY = thisY + 7.5;

            var goalPercentDecimal = (variableValue / variableGoal);
            var goalFillWidth = barOuterWidth * goalPercentDecimal;

            var textX = (barOutX + goalFillWidth) - (variableTextWidth + 2);

            if (textX <= barOutX){
                textX = barOutX;
            }

            return function(){

                if(!isNaN(variableGoal)){
                    ctx.fillStyle = "#2c3e50";
                    ctx.fillRect(thisX,thisY,thisWidth,thisHeight);
                    ctx.drawImage(this,imgX,imgY,imgWidth,imgHeight);
                    ctx.fillStyle = '#2ecc71';
                    ctx.fillRect(barOutX,barOutY,goalFillWidth,barOuterHeight);
                    ctx.rect(barOutX,barOutY,barOuterWidth,barOuterHeight);
                    ctx.stroke();
                    ctx.fillStyle = '#ecf0f1';
                    ctx.fillText(variableValue,textX,barOutY + 24);
                } else {
                    ctx.fillStyle = "#2c3e50";

                    var customWidth = imgWidth + variableTextWidth + 40;
                    var customX = (window.innerWidth - 20) - customWidth;

                    ctx.fillRect( customX,thisY,customWidth,thisHeight);
                    ctx.drawImage(this,customX + 5,imgY,imgWidth,imgHeight);
                    ctx.fillStyle = '#ecf0f1';
                    ctx.fillText(variableValue,customX + imgWidth + 20,barOutY + 24);
                }




            }

        }(variable);
        url = url+ '?cacheControlID='+gameArea.uuid;
        imgs[imgIndex].src = url;
        imgIndex += 1;

    }

    callback(true);
}

function handleReward(selectedOption){
    var frame = gameArea.data.frames[gameArea.currentFrame];
    var rewards = frame['reward'];
    if (rewards[selectedOption] != null) {
        var reward = rewards[selectedOption];
        for (var variable in reward) {

            var value = reward[variable];
            var beforeDebug = gameArea.variables[variable]

            if (!isNaN(reward[variable])) {
                gameArea.variables[variable] = gameArea.variables[variable] + value;
            } else {

                value = replaceAllStringVariables(value);

                if (value.match(/[a-z]/i)) {
                    gameArea.variables[variable] = value;
                } else {
                    gameArea.variables[variable] = gameArea.variables[variable] + eval(value);
                }

            }

            debuggerLog(variable + " = " + beforeDebug + " + " + value + " -> " + gameArea.variables[variable]);
        }
    }

    completedObjective(function(complete){
        if (complete) {
            debuggerLog("User has hit objective!" + complete);
        }
    });
}

function getObjectiveValues(){
    let objectives = gameArea.objectives;
    let variables = gameArea.variables;
    for (var objective in objectives) {
        objective = objectives[objective];
        if (objective['id'] == variables['id']) {
            return objective;
        }
    }
}

function completedObjective(callback){
    let objectives = gameArea.objectives;
    let variables = gameArea.variables;
    for (var objective in objectives) {
        objective = objectives[objective];
        for (var x = 0; x <= Object.keys(objective).length - 1; x++) {
            if (objective[Object.keys(objective)[x]] == variables[Object.keys(objective)[x]]){
                if(objective[Object.keys(objective)[x + 1]] == variables[Object.keys(objective)[x + 1]]){
                    callback(true);
                    break;
                } else {
                    callback(false);
                    break;
                }
            };
        }
    }
}

function hitEndGame(callback){

    clearScreen();

    var endMessage = gameArea.variables['endMessage'];

    debuggerLog("Death message: " + endMessage);

    var end = gameArea.data['end'];

    var ctx = gameArea.canvas.getContext("2d");

    var img = new Image();

    ctx.fillStyle = end['background'];

    ctx.fillRect(0,0, window.innerWidth, window.innerHeight);

    var width = end['width'];
    var height = end['height'];

    img.onload = function(){

        var thisWidth = width;
        var thisHeight = height;
        var thisX = (window.innerWidth / 2) - (thisWidth / 2);
        var thisY = ((window.innerHeight / 2) - (thisHeight / 2) - 300);

        return function(){
            ctx.drawImage(this,thisX,thisY,thisWidth,thisHeight);
        }

    }();

    img.src = end['url'];

    var text = end['text'];

    var x = text['x'];
    var y = text['y'];
    var size = text['size'];
    var width = text['width'];

    if (x.includes("center")) {
        x = (window.innerWidth / 2) - (width / 2);
    }

    if (ctx.measureText(endMessage).width <= (width - 50)){
        x = (window.innerWidth / 2) - (ctx.measureText(endMessage).width / 2);
    }

    if (y.includes("center")) {
        y = (window.innerHeight / 2);
    }

    typeOut(endMessage,x,y, size, width, text['color'],function(){
        debuggerLog("Game is completely over, The next key tap will reload the game.");

        gameArea.canvas.getContext("2d").font = "40px main";

        fadeInText(ctx,"Created by", (window.innerWidth / 2) - (ctx.measureText("Created by").width / 2),(window.innerHeight - 300),255,255,255);

        setTimeout(function(){
            gameArea.canvas.getContext("2d").font = "24px main";
            fadeInText(ctx,"Matthew Maggio (Software)", (window.innerWidth / 2) - (ctx.measureText("Matthew Maggio (Software)").width / 2),(window.innerHeight - 250),255,255,255);
            setTimeout(function(){
                fadeInText(ctx,"Austin Keller (Graphic Design)", (window.innerWidth / 2) - (ctx.measureText("Austin Keller (Graphic Design)").width / 2),(window.innerHeight - 215),255,255,255);
                setTimeout(function(){
                    fadeInText(ctx,"Michael McCanna (Storyline designer)", (window.innerWidth / 2) - (ctx.measureText("Michael McCanna (Storyline designer)").width / 2),(window.innerHeight - 180),255,255,255);
                    setTimeout(function(){
                        fadeInText(ctx,"Ryan Atkinson (Storyline designer)", (window.innerWidth / 2) - (ctx.measureText("Ryan Atkinson (Storyline designer)").width / 2),(window.innerHeight - 145),255,255,255);
                        setTimeout(function(){
                            fadeInText(ctx,"Ashton Wilkinson (Storyline designer)", (window.innerWidth / 2) - (ctx.measureText("Ashton Wilkinson (Storyline designer)").width / 2),(window.innerHeight - 110),255,255,255);
                            setTimeout(function(){
                                gameArea.canvas.getContext("2d").font = "40px main";

                                ctx.fillStyle = end['background'];
                                ctx.fillRect(0,(window.innerHeight - 350), window.innerWidth, 500);

                                setTimeout(function(){
                                    fadeInText(ctx,"Press any key to restart...", (window.innerWidth / 2) - (ctx.measureText("Press any key to restart...").width / 2),(window.innerHeight - 200),255,255,255);
                                    callback();
                                    window.addEventListener('keydown', handler);
                                },500);
                            }, 5000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);


        var handler = function (e) {
            window.removeEventListener('keydown', handler);

            gameArea.title();
        };

    });


}

function hitWinGame(callback){

    clearScreen();

    var endMessage = gameArea.variables['endMessage'];

    debuggerLog("Win message: " + endMessage);

    var win = gameArea.data['win'];

    var ctx = gameArea.canvas.getContext("2d");

    ctx.fillStyle = win['background'];

    ctx.fillRect(0,0, window.innerWidth, window.innerHeight);

    var img = new Image();

    var width = win['width'];
    var height = win['height'];

    img.onload = function(){

        var thisWidth = width;
        var thisHeight = height;
        var thisX = (window.innerWidth / 2) - (thisWidth / 2);
        var thisY = ((window.innerHeight / 2) - (thisHeight / 2) - 300);

        return function(){
            ctx.drawImage(this,thisX,thisY,thisWidth,thisHeight);
        }

    }();

    img.src = win['url'];

    var text = win['text'];

    var x = text['x'];
    var y = text['y'];
    var size = text['size'];
    var width = text['width'];

    if (x.includes("center")) {
        x = (window.innerWidth / 2) - (width / 2);
    }

    if (ctx.measureText(endMessage).width <= (width - 50)){
        x = (window.innerWidth / 2) - (ctx.measureText(endMessage).width / 2);
    }

    if (y.includes("center")) {
        y = (window.innerHeight / 2);
    }

    typeOut(endMessage,x,y, size, width, text['color'],function(){
        debuggerLog("Game is completely over, The next key tap will reload the game.");

        gameArea.canvas.getContext("2d").font = "40px main";

        fadeInText(ctx,"Created by...", (window.innerWidth / 2) - 230,(window.innerHeight - 300),0,0,0);

        setTimeout(function(){
            gameArea.canvas.getContext("2d").font = "24px main";
            fadeInText(ctx,"Matthew Maggio (Software)", (window.innerWidth / 2) - 230,(window.innerHeight - 250),0,0,0);
            setTimeout(function(){
                fadeInText(ctx,"Austin Keller (Graphic Design)", (window.innerWidth / 2) - 230,(window.innerHeight - 215),0,0,0);
                setTimeout(function(){
                    fadeInText(ctx,"Michael McCanna (Storyline designer)", (window.innerWidth / 2) - 230,(window.innerHeight - 180),0,0,0);
                    setTimeout(function(){
                        fadeInText(ctx,"Ryan Atkinson (Storyline designer)", (window.innerWidth / 2) - 230,(window.innerHeight - 145),0,0,0);
                        setTimeout(function(){
                            fadeInText(ctx,"Ashton Wilkinson (Storyline designer)", (window.innerWidth / 2) - 230,(window.innerHeight - 110),0,0,0);
                            callback();
                            window.addEventListener('keydown', handler);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);

        var handler = function (e) {
            window.removeEventListener('keydown', handler);

            gameArea.title();
        };

    });


    // ctx.fillText(endMessage,text['x'],text['y']);


}

function transition(){

    clearScreen();
    debuggerLog("Drawing Frame #" + gameArea.currentFrame);
    createFrame(function(){
        debuggerLog("Finished drawing Frame #" + gameArea.currentFrame);
        listenKeyDown();
    });
}

function clearScreen(){
    var ctx = gameArea.canvas.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, window.innerWidth , window.innerHeight );
    ctx.beginPath();
    ctx.moveTo(0,0)
    ctx.stroke();
}

//Events \/
$(window).on('load', function(){
    $.ajaxSetup({ cache: false });

    var debug = getUrlParam('debug', false)

    if(debug){
        $('#debug').show();
    }

    if (window.innerHeight <= 899 || window.innerWidth <= 899){
        debuggerLog("Screen height is too small! The user needs to zoom out!");
        alert("Your screen size is too small, If you are on a mobile device you need to view this on a computer. " +
            "If you are on a computer you need to zoom out. You can do this by doing (CMD & -) or (CTRL & -). Once you have zoomed out, Just reload the page! (900x900) Screen size min!");
    } else {
        preloadAllFrameData(function(){
            gameArea.title();
        });

    }


});

$(window).resize(function() {
    debuggerLog("Resizing the screen will effect the game, a reload may be required!");
});

function showStartScreen(){
    $.getJSON("options.json",{}, function( data ){

        gameArea.data = data;
        gameArea.variables = gameArea.data['variables'];
        gameArea.objectives = gameArea.data['objectives'];
        gameArea.variable_icons = gameArea.data['variable_icons'];
        debuggerLog("Loaded game data, The game is ready to start when the user presses any key!");

        var ctx = gameArea.canvas.getContext("2d");

        var img = new Image();

        var width = gameArea.data['start']['width'];
        var height = gameArea.data['start']['height'];

        img.onload = function(){

            var thisWidth = width;
            var thisHeight = height;
            var thisX = (window.innerWidth / 2) - (thisWidth / 2);
            var thisY = (window.innerHeight / 2) - (thisHeight / 2);

            return function(){
                ctx.drawImage(this,thisX,thisY,thisWidth,thisHeight);
            }

        }();

        img.src = gameArea.data['start']['url'] + '?cacheControlID='+gameArea.uuid;

        var handler = function (e) {
            startGame();
            window.removeEventListener('keydown', handler);
        };

        window.addEventListener('keydown', handler);
    });
}

function listenKeyDown() {

    var handler = function (e) {

        var frame = gameArea.data.frames[gameArea.currentFrame];
        var options = frame['options'];
        var path = frame['path'];
        var keyPressed = e.key.toUpperCase();
        var nextFrame = path[keyPressed];


        if (!varUndefined(options['all'])) {
            nextFrame = path['all'];
            keyPressed = 'all';
        }

        debuggerLog(keyPressed + " has been pressed!");

        if (!varUndefined(nextFrame)){

            window.removeEventListener('keydown', handler);
            handleReward(keyPressed);

            if (nextFrame == "end") {
                hitEndGame(function(){
                    debuggerLog('Game has hit the end.');
                });
                return;
            } else if (nextFrame == "win"){
                hitWinGame(function(){
                   debuggerLog('User has won game!');
                });
            }

            gameArea.currentFrame = nextFrame;
            transition();

        }
        return;
    };

    window.addEventListener('keydown', handler);

}




//Instead of using a controller, We should implement phone usage control. Where as many people can join and it tallies up the values.
// For example a QR code would show and users can scan the code, Once scanned a socket server connection will cause the players to be able to choose options A,B,C, or D.
//This option would be more difficult but it would allow more players, More publicity for the game, and would be cooler. This would require a countdown then. 30 seconds each frame.

//Helper functions \/

function typeOut(str, startX, startY, lineHeight, lineWidth, color, callback) {
    var ctx = gameArea.canvas.getContext("2d");
    var canvas = gameArea.canvas;

    var cursorX = startX || 0;
    var cursorY = startY || 0;
    var lineHeight = lineHeight || 32;
    var i = 0;
    $_inter = setInterval(function() {
        var rem = str.substr(i);
        var space = rem.indexOf(' ');
        space = (space === -1)?str.length:space;
        var wordwidth = ctx.measureText(rem.substring(0, space)).width;
        var w = ctx.measureText(str.charAt(i)).width;
        if(cursorX + wordwidth >= (window.innerWidth / 2) + (lineWidth / 2)) {
            cursorX = startX;
            cursorY += lineHeight;
        }
        ctx.fillStyle = color;
        ctx.fillText(str.charAt(i), cursorX, cursorY);
        i++;
        cursorX += w;
        if(i === str.length) {
            clearInterval($_inter);
            callback(true);
        }
    }, 20);

}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function fadeInText(ctx,text, x, y, R,G,B) {
    var alpha = 0.0,
    interval = setInterval(function () {
        ctx.fillStyle = "rgba("+R+", "+G+", "+B+", " + alpha + ")";
        ctx.fillText(text, x, y);
        alpha = alpha + 0.05; // increase opacity (fade in)
        if (alpha >= 0.39){
            clearInterval(interval);
        }
    }, 50);
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function replaceStringVariables(string) {
    if (string.includes("$")){
        var foundVar = string.split("$")[1].split(" ")[0];
        for (var variable in gameArea.variables) {
            if (variable == foundVar) {
                string = string.replace('$'+foundVar,gameArea.variables[foundVar]);
            }
        }
    }
    return string;
}

function replaceAllStringVariables(string) {
    var loopCount = string.replace(/[^$]/g, "$").length;
    for (var x = 1; x <= loopCount; x++){
        string = replaceStringVariables(string);
    }
    return string;
}

function varUndefined(value){
    return (typeof value === 'undefined');
}

function preloadAllFrameData(callback) {

    var ctx = document.createElement("canvas").getContext("2d");
    var imgs = [];
    var imgIndex = 0;

    $.getJSON("http://techwizmatt.info/projects/school/eng/game/frames/list.php",{}, function(imagesArray){

        var complete = 0;
        var count = Object.values(imagesArray).length - 1;

        for (var image in imagesArray){
            var width = 1000;
            var height = 1000;
            var x = 0
            var y = 0
            var url = imagesArray[image];

            imgs[imgIndex] = new Image();
            // img.src = url;

            imgs[imgIndex].onload = function(){

                var thisX = x;
                var thisY = y;
                var thisWidth = width;
                var thisHeight = height;

                return function(){
                    ctx.drawImage(this,thisX,thisY,thisWidth,thisHeight);
                    ctx.font = "100px main";
                    ctx.fillText("TEST",0,0);
                    complete++;

                    debuggerLog("Loaded: " + complete + "/" + count);

                    if (complete == count) {
                        debuggerLog('All images have been loaded');
                        callback(true);
                    }
                }

            }();

            url = url + '?cacheControlID='+gameArea.uuid;
            imgs[imgIndex].src = 'frames/' + url;

            imgIndex += 1;
        }

    });
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function logFrameInfo(){
    let frame = gameArea.data.frames[gameArea.currentFrame];

    var message =
        "<h3>FRAME INFO</h3>"
        +"- Frame number: " + gameArea.currentFrame
        + "\n <br> \n"
        + "- Path: " + objToString(frame['path'])
        + "\n <br><br> \n";

    debuggerLog(message);
}

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + ' -> ' + obj[p] + '\n';
        }
    }
    return str;
}

function listenForReload() {

    var handler = function (e) {

        var keyPressed = e.key.toUpperCase();
        //Reload the data...
        return;
    };

    window.addEventListener('keydown', handler);

}