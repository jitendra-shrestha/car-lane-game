
function Player() {
    
    this.width = 50;
    this.height = 100;
    this.index = 1;
    this.lanes = 3;
    this.top = 0;
    this.y = 500;
    this.positions = [25, 125, 225];

    this.init = function() {
        this.car = document.createElement('div');
        this.car.style.position = 'absolute';
        this.car.style.width = this.width + 'px';
        this.car.style.height = this.height + 'px';
        this.car.style.backgroundImage = 'url("./images/car1.png")';
        this.car.style.backgroundSize = 'contain';
        this.car.style.backgroundRepeat = 'no-repeat';
    
        this.car.style.left = this.positions[1] + 'px';
        this.x = this.positions[1];
        this.index = 1;
        
        this.car.style.top = this.y + 'px';
        
    }

    this.draw = function(part) {
        part.appendChild(this.car);
    }


    this.toLeft = function() {
        if(this.index <= 0){
            
        }
        else{
            this.index--;
        }
        this.x = this.positions[this.index];
        this.car.style.left = this.positions[this.index] + 'px';
    }

    this.toRight = function() {
        if(this.index >= this.lanes-1){
           
        }
        else{
            this.index++;
           
        }
        this.x = this.positions[this.index];
        this.car.style.left = this.positions[this.index] + 'px';
    }


}


function Enemy() {
    this.width = 50;
    this.height = 100;
    this.index = 1;
    this.lanes = 3;
    this.y = 0;
    this.positions = [25, 125, 225];

    this.init = function(ind, y) {
        this.y = y || 0
        this.car = document.createElement('div');
        this.car.style.position = 'absolute';
        this.car.style.width = this.width + 'px';
        this.car.style.height = this.height + 'px';
        this.car.style.backgroundImage = `url("./images/car0.png")`;
        this.car.style.backgroundSize = 'contain';
        this.car.style.backgroundRepeat = 'no-repeat'; 
        this.car.style.left = this.positions[ind] + 'px';
        this.x = this.x = this.positions[ind];
        this.car.style.top = this.y + 'px';
        
    }

    this.draw = function(part) {
        part.appendChild(this.car);
    }

    this.update = function() {
        this.car.style.top = this.y + 'px';
    }

    this.destroy = function() {
        this.car.parentElement.removeChild(this.car);
    }

    this.getRandomValue = function(max,min){
        let val = Math.random() * (max - min) + min;
        return Math.round(val);
    }

}




function Game() {
    this.score = 0;
    this.enemies = [];
    this.width = 300;
    this.height = 630;
    var that = this;
    this.backgroundy = 0;
    this.restart = false;
    this.init = function(partId) {
        this.part = document.getElementById(partId);
        this.part.style.width = this.width + 'px';
        this.part.style.height = this.height + 'px';
        this.part.style.backgroundColor = 'red';
        this.part.style.backgroundImage = 'url("./images/road.png")';
        this.part.style.backgroundPositionY = this.backgroundy + 'px';
        this.player = new Player();
        this.player.init();
        this.player.draw(this.part);
        if(!this.restart) {
            this.addListeners();
        }
        
        let temp = [-50,-300,-600];

        for(var i =0; i<3; i++){
            let enemy = new Enemy();
            enemy.init(this.getRandomValue(2,0) , temp[i]);
            enemy.draw(this.part);
            this.enemies.push(enemy);

        }
        this.createScore();

        
        this.createStartScreen();
        
        
    }

    this.createEnemy = function() {
        
        let enemy = new Enemy();
        enemy.init(this.getRandomValue(2,0), -110);
        enemy.draw(this.part);
        this.enemies.push(enemy);        
    }

    this.createScore = function() {
        this.scoreText = document.createElement('p');
        this.scoreBody = "Your Score: ";
        this.scoreText.innerHTML = this.scoreBody;
        this.scoreText.style.position = 'absolute';
        this.scoreText.style.top = '5px';
        this.scoreText.style.right = '5px';
        this.scoreText.style.color = 'white';
        this.scoreText.style.textShadow = "2px 2px 5px black";
        this.part.appendChild(this.scoreText);
    }

    this.addListeners = function() {
        document.addEventListener('keydown', function(e) {
            switch(e.key){
                case 'ArrowLeft':
                    that.player.toLeft();
                    break;
                case 'ArrowRight':
                    that.player.toRight();
                    break;
                default:
                    break;
            }
            
        });
    }
    this.update = function() {
        this.speed = 1;
        this.gameLoop = setInterval(() => {
            that.backgroundy += 2 + this.speed;
            that.part.style.backgroundPositionY=  that.backgroundy+ 'px';
            for(var i=0; i<this.enemies.length; i++) {
                this.enemies[i].y += 1+ this.speed;
                this.enemies[i].update();
                
                this.detectBallCollision(this.enemies[i]);
                this.detectBorderCollision(this.enemies[i], i);
            }
            
            this.speed+= 0.001;
            
        }, 16);
        
    }


    this.getRandomValue = function(max,min){
        let val = Math.random() * (max - min) + min;
        return Math.round(val);
    }

    this.detectBallCollision = function(enemy){
        if (this.player.x <= enemy.x+ enemy.width &&
            this.player.x + this.player.width >= enemy.x &&
            this.player.y <= enemy.y + enemy.height &&
            this.player.y + this.player.height >= enemy.y) {

            clearInterval(that.gameLoop);
            this.createGameOverScreen();
            this.showGameOverScreen();
        }
    }

    this.detectBorderCollision = function(enemy) {
          
        if(enemy.y >= this.height){
            
            this.enemies.shift();
            enemy.destroy();
            this.score++;
            this.scoreText.innerHTML = this.scoreBody + this.score;
            this.createEnemy();
        }
    }

    this.createStartScreen = function() {
        this.startScreen = document.createElement('div');
        this.startScreen.style.width = this.width+'px';
        this.startScreen.style.height = this.height+'px';
        this.startScreen.style.textAlign = 'center';
        this.startScreen.style.verticalAlign = 'center';
        this.startScreen.style.backgroundColor = '#327da8';
        this.startScreen.style.position = 'absolute';
        this.startScreen.style.paddingTop = 250 + 'px';
        this.startScreen.style.zIndex = '1';
        this.startScreen.innerHTML = 'Click Enter to Start'+ '<br>' + 'Use Left arrow for left'+ '<br>' + 'Use Right arrow for right';
       
        this.part.appendChild(this.startScreen);
        document.addEventListener('keydown', function(e){
            if(e.key==='Enter'){
                that.startScreen.style.display = 'none';
                that.update();
            }
        });
    }

    this.createGameOverScreen = function() {
        this.screen = document.createElement('div');
        this.screen.style.width = this.width+'px';
        this.screen.style.height = this.height+'px';
        this.screen.style.background = '#7a1037';
        this.screen.style.display = 'none';
        this.screen.style.textAlign = 'center';
        this.screen.style.verticalAlign = 'center';
        this.screen.style.position = 'absolute';
        this.screen.style.lineHeight = this.height + 'px';
        this.screen.style.zIndex = '1';
        this.screen.innerHTML = 'Game Over';
       

        var playAgainBtn = document.createElement('span');
        playAgainBtn.backgroundColor = 'transparent';
        playAgainBtn.innerHTML = "Play Again?";
        playAgainBtn.style.border = "none";
        playAgainBtn.style.cursor="pointer";
        playAgainBtn.style.paddingLeft = 20 +'px';
        
        this.screen.appendChild(playAgainBtn);
        document.addEventListener('keydown', function(e){
            if(e.key==='Enter'){
                that.hideGameOverScreen();
                that.resetGame();
                location.reload()  
            }
            
        });
        this.part.appendChild(this.screen);
    }
    this.showGameOverScreen = function() {
        this.screen.style.display = 'block';
    }
    this.hideGameOverScreen = function() {
        that.screen.style.display = 'none';
    }

    this.resetGame = function() {
        
        while(this.enemies.length!=0){
            this.enemies.pop();
        }
        speed= 1 ;
        that.player = null;
        this.part.innerHTML = '';
        this.part = null;
        this.score = 0;
        this.restart = true;
        
       
        this.init('part-1');
    }



}


var g = new Game();
g.init('part-1');