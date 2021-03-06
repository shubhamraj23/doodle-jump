// This function starts the game and asks for the difficulty level
function chooseDifficulty(){
    // Remove the button
    var button = document.getElementsByClassName('start-button')[0];
    button.style.display = 'none';
    var scoreArea = document.getElementsByClassName('result')[0];
    scoreArea.style.display = 'none';

    // Show the difficulty
    var difficulty = document.getElementsByClassName('difficulty')[0];
    var text = document.getElementsByClassName('difficulty-text')[0];
    text.style.display = 'block';
    var textWidth = text.offsetWidth/2;
    text.style.left = "calc(50vw - " + textWidth + "px)"
    difficulty.style.display = "flex";
}

// This function creates all the classes contaning the global variables
// It also initialises the grid loading process
function startSetup(level){
    // Remove the existing items
    var difficulty = document.getElementsByClassName('difficulty')[0];
    var text = document.getElementsByClassName('difficulty-text')[0];
    text.style.display = 'none';
    difficulty.style.display = "none";

    // All the variables dependent on input go first
    if(level === 'easy'){
        if(screen.width >= screen.height){
            var numberOfPlatforms = 6;
        }
        else{
            var numberOfPlatforms = 8;
        }
        var platformMove = 2.3;
        var platformSpeed = 1;
    }
    else if (level === 'medium'){
        if(screen.width >= screen.height){
            var numberOfPlatforms = 5;
        }
        else{
            var numberOfPlatforms = 7;
        }
        var platformMove = 1.5;
        var platformSpeed = 1;
    }
    else{
        if(screen.width >= screen.height){
            var numberOfPlatforms = 4;
        }
        else{
            var numberOfPlatforms = 5;
        }
        var platformMove = 1;
        var platformSpeed = 1.5;
    }
    var accelerationUp = 4.8;
    var distanceUp = 2.4;
    var velocityUp = 4.8;
    window.clickCount = 0;
    window.score = 0;
    window.level = level;

    // Grid Class
    const gridData = new Grid();

    // Create all the platforms
    platforms = [];
    platformposition = createPlatforms(gridData, numberOfPlatforms, platforms);
    var platformData = new PlatformData(platforms, gridData, platformposition, platformMove, platformSpeed);
    platformData.alignPlatforms(gridData);

    // Create doodler
    const doodler = new Doodler(gridData, platformData, accelerationUp, distanceUp, velocityUp);

    // Make the doodler fall down
    doodler.initiateFall(platformData);

    // Start moving the platforms
    setInterval(function(){
        platformData.movePlatforms(doodler, gridData);
    }, 10);

    // Add the effect of keys
    document.addEventListener('keyup', function(event){
        doodler.control(event);
    });
    document.addEventListener('click', clickMove = function(event){
        doodler.click(event);
    });
    
    // Set the high score
    if(localStorage.getItem("easy") == null){
        localStorage.setItem("easy", 0);
    }
    if(localStorage.getItem("medium") == null){
        localStorage.setItem("medium", 0);
    }
    if(localStorage.getItem("hard") == null){
        localStorage.setItem("hard", 0);
    }
}


// All the helper functions go here

// This function creates and displays all the platforms
function createPlatforms(gridData, numberOfPlatforms, platforms){
    var platformGap = gridData.gridHeight / numberOfPlatforms;
    var initialPlatformBottomGap = 0.5*(gridData.gridHeight/numberOfPlatforms);
    for(var i=0; i<numberOfPlatforms; i++){
        var PlatformBottomGap = initialPlatformBottomGap + i*platformGap;
        var newPlatform = new Platform(PlatformBottomGap, gridData);
        platforms.push(newPlatform);
    }
    var platformposition = [platformGap, initialPlatformBottomGap];
    return platformposition;
}

function displayEnd(){
    var grid = document.getElementsByClassName('grid')[0];
    while (grid.firstChild){
        grid.removeChild(grid.firstChild);
    }

    // Show the button
    var button = document.getElementsByClassName('start-button')[0];
    var text = document.getElementById('button-text');
    text.innerHTML = 'Start Again';
    button.style.display = 'block';

    // Display Score
    var scoreArea = document.getElementsByClassName('result')[0];
    var level = document.getElementById('level');
    var score = document.getElementById('score');
    var highScoreEasy = document.getElementById('high-score-easy');
    var highScoreMedium = document.getElementById('high-score-medium');
    var highScoreHard = document.getElementById('high-score-hard');
    score.innerHTML = 'Score: ' + window.score;
    level.innerHTML = 'Level: ' + window.level.charAt(0).toUpperCase() + window.level.slice(1);
    if(window.score > localStorage.getItem(window.level)){
        localStorage.setItem(window.level, window.score);
    }
    highScoreEasy.innerHTML = 'Easy: ' + localStorage.getItem("easy");
    highScoreMedium.innerHTML = 'Medium: ' + localStorage.getItem("medium");
    highScoreHard.innerHTML = 'Hard: ' + localStorage.getItem("hard");
    scoreArea.style.display = "block";

    window.clickCount = 0;
    document.removeEventListener('click', clickMove);
}

// All the useful classes go here

// Grid Class
class Grid{
    constructor(){
        this.grid = document.getElementsByClassName('grid')[0];
        this.gridWidth = this.grid.offsetWidth;
        this.gridHeight = this.grid.offsetHeight;
    }
}

// Platform Class
class Platform{
    constructor(bottomGap, gridData){
        this.bottom = bottomGap;
        this.left = Math.random() * 315;
        this.visual = document.createElement('div');
        const visual = this.visual;
        visual.classList.add('platform');
        visual.style.left = this.left + 'px';
        visual.style.bottom = this.bottom + 'px';
        gridData.grid.appendChild(visual);
    }
}

// PlatformData Class containing all the info of all the classes
class PlatformData{
    constructor(platforms, gridData, platformposition, platformMove, platformSpeed){
        this.platforms = platforms;
        this.platformGap = platformposition[0];
        this.initialPlatformBottomGap = platformposition[1];
        this.platformMove = platformMove;
        this.platformSpeed = platformSpeed;
        var platform = document.getElementsByClassName('platform')[0];
        if(platform.offsetWidth >= gridData.gridWidth/8){
            this.platformWidth = platform.offsetWidth;
            this.platformHeight = platform.offsetHeight;
        }
        else{
            this.platformWidth = Math.ceil(gridData.gridWidth/40)*5;
            this.platformHeight = this.platformWidth*3/17;
        }
    }

    alignPlatforms(gridData){
        for(var i=0; i<this.platforms.length; i++){
            var platformVisual = this.platforms[i].visual;
            platformVisual.style.width = this.platformWidth + 'px';
            platformVisual.style.height = this.platformHeight + 'px';
            this.platforms[i].left = Math.random() * (gridData.gridWidth - this.platformWidth);
            platformVisual.style.left = this.platforms[i].left + 'px';
        }
    }

    movePlatforms(doodler, gridData){
        if(doodler.bottomGap >= this.platformMove*this.platformGap){
            this.platforms.forEach(platform => {
                platform.bottom -= this.platformSpeed*gridData.gridHeight/400;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if (platform.bottom <= 10){
                    let firstPlatform = this.platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    this.platforms.shift();
                    window.score += 1;

                    var bottomGap = this.platforms[this.platforms.length -1].bottom + this.platformGap;
                    let newPlatform = new Platform(bottomGap, gridData)
                    this.platforms.push(newPlatform);
                    this.alignNewPlatform(this.platforms[this.platforms.length - 1], gridData);
                }
            });
        }
    }

    alignNewPlatform(platform, gridData){
        var platformVisual = platform.visual;
        platformVisual.style.width = this.platformWidth + 'px';
        platformVisual.style.height = this.platformHeight + 'px';
        platform.left = Math.random() * (gridData.gridWidth - this.platformWidth);
        platformVisual.style.left = platform.left + 'px';
    }
}

// Class Doodler
class Doodler{
    constructor(gridData, platformData, accelerationUp, distanceUp, velocityUp){
        this.doodler = document.createElement('div');
        const doodler = this.doodler;
        gridData.grid.appendChild(doodler);
        doodler.classList.add('doodler');
        this.width = platformData.platformWidth/2;
        this.height = this.width;
        while(this.height > platformData.platformGap){
            this.height /= 2;
            this.width = this.height;
        }
        this.bottomGap = platformData.initialPlatformBottomGap + (platformData.platformGap - this.height)/2;
        this.leftGap = platformData.platforms[0].left + (platformData.platformWidth - this.width)/2;
        doodler.style.bottom = this.bottomGap + 'px';
        doodler.style.width = this.width + 'px';
        doodler.style.height = this.height + 'px';
        doodler.style.left =  this.leftGap + 'px';
        this.upTimer = null;
        this.downTimer = null;
        this.leftTimer = null;
        this.rightTimer = null;
        this.gridWidth = gridData.gridWidth;
        this.gridHeight = gridData.gridHeight;
        this.movingUp = false;
        this.movingDown = false;
        this.movingRight = false;
        this.movingLeft = false;
        this.accelerationUp = accelerationUp*platformData.platformGap;
        this.distanceUp = distanceUp*platformData.platformGap;
        this.velocityUp = velocityUp*platformData.platformGap;
    }

    initiateFall(platformData){
        if (this.movingUp == true){
            this.movingUp = false;
            clearInterval(this.upTimer);
        }
        this.movingDown = true;
        window.valueUp = 0;
        this.downTimer = setInterval(() => {
            if(window.valueUp >= 300*platformData.platformGap/this.accelerationUp){
                var distanceDown = 0.03*platformData.platformGap
            }
            else{
                var distanceDown = this.accelerationUp*0.0001*(window.valueUp - 0.5);
            }
            this.bottomGap -= distanceDown;
            this.doodler.style.bottom = this.bottomGap + 'px';
            window.valueUp += 1;

            platformData.platforms.forEach(platform => {
                if(
                    (this.bottomGap >= platform.bottom) &&
                    (this.bottomGap <= platform.bottom + platformData.platformHeight) &&
                    (this.leftGap + 0.8*this.width >= platform.left) &&
                    (this.leftGap <= platform.left + platformData.platformWidth)
                ){
                    this.initiateJump(platformData, this.bottomGap);
                }
            });

            if(this.bottomGap <= 0){
                this.gameOver();
            }
        }, 10);
    }

    initiateJump(platformData, startBottom){
        if (this.movingDown == true){
            this.movingDown = false;
            clearInterval(this.downTimer);
        }
        this.movingUp = true;
        window.valueUp = 0;
        this.upTimer = setInterval(() => {
            var moveValue = 0.01*this.velocityUp - this.accelerationUp*0.0001*(window.valueUp - 0.5);
            this.bottomGap += moveValue;
            this.doodler.style.bottom = this.bottomGap + 'px';
            window.valueUp += 1

            if (
                (this.bottomGap - startBottom >= this.distanceUp) ||
                (this.bottomGap + this.height >= this.gridHeight)
            ){
                this.initiateFall(platformData);
            }
        }, 10);
    }

    control(event){
        if(event.key === "ArrowLeft"){
            this.moveLeft();
        }
        else if (event.key === "ArrowRight"){
            this.moveRight();
        }
        else if (event.key === "ArrowUp"){
            this.moveStraight();
        }
    }

    click(event){
        if(window.clickCount == 0){
            window.clickCount += 1;
            return;
        }
        var body = document.getElementsByTagName('body')[0];
        var bodyWidth = body.offsetWidth;
        var clickLocation = event.clientX - 8;
        if(clickLocation < bodyWidth/2){
            this.moveLeft();
        }
        else if (clickLocation > bodyWidth/2){
            this.moveRight();
        }
        else{
            this.moveStraight();
        }
    }

    moveLeft(){
        if (this.movingRight == true){
            this.movingRight = false;
            clearInterval(this.rightTimer);
        }
        else if (this.movingLeft == true){
            return;
        }
        this.movingLeft = true;
        this.leftTimer = setInterval(() => {
            if(this.leftGap >= 0){
                this.leftGap -= this.gridWidth/200;
                this.doodler.style.left = this.leftGap + 'px';
            }
            else{
                this.moveRight();
            }
        }, 10);
    }

    moveRight(){
        if (this.movingLeft == true){
            this.movingLeft = false;
            clearInterval(this.leftTimer);
        }
        else if (this.movingRight == true){
            return;
        }
        this.movingRight = true;
        this.rightTimer = setInterval(() => {
            if(this.leftGap +  this.width <= this.gridWidth){
                this.leftGap += this.gridWidth/200;
                this.doodler.style.left = this.leftGap + 'px';
            }
            else{
                this.moveLeft();
            }
        }, 10);
    }

    moveStraight(){
        this.movingLeft = false;
        this.movingRight = false;
        clearInterval(this.leftTimer);
        clearInterval(this.rightTimer);
    }

    gameOver(){
        clearInterval(this.upTimer);
        clearInterval(this.downTimer);
        clearInterval(this.leftTimer);
        clearInterval(this.rightTimer);
        window.clickCount = 0;
        displayEnd();
    }
}