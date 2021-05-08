// This function creates all the classes contaning the global variables
// It also initialises the grid loading process
function startSetup(){
    // All the modifiable variables go first
    var numberOfPlatforms = 5;

    // Grid Class
    const gridData = new Grid();

    // Remove the button
    var button = document.getElementsByClassName('start-button')[0];
    button.style.display = 'none';

    // Create all the platforms
    platforms = [];
    platformposition = createPlatforms(gridData, numberOfPlatforms, platforms);
    var platformData = new PlatformData(platforms, gridData, platformposition);
    platformData.alignPlatforms(gridData);

    // Create doodler
    const doodler = new Doodler(gridData, platformData);
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
    constructor(BottomGap, gridData){
        this.bottom = BottomGap;
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
    constructor(platforms, gridData, platformposition){
        this.platforms = platforms;
        this.platformGap = platformposition[0];
        this.initialPlatformBottomGap = platformposition[1];
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
}

// Class Doodler
class Doodler{
    constructor(gridData, platformData){
        const doodler = document.createElement('div');
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
    }
}