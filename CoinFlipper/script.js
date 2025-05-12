
function createStars() {
    const container = document.getElementById('gameArea');
    for(let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = star.style.height = 
            Math.random() * 3 + 1 + 'px';
        star.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(star);
    }
}
createStars();

let score = 0;
let clickPower = 1;
let autoClickers = 0;
let gameSpeed = 1.0;
let upgrades = {
    clickPower: { cost: 10 },
    autoClicker: { cost: 50 },
    slowTime: { cost: 200 }
};

const coinImg = new Image();
coinImg.src = 'coin.gif';


function createCoin() {
    const container = document.createElement('div');
    container.className = 'coin-container';
    
    const coin = document.createElement('img');
    coin.className = 'coin';
    coin.src = coinImg.src;

    container.style.width = '80px';
    container.style.height = '80px';
    coin.style.width = '50px';
    coin.style.height = '50px';
    coin.style.left = '15px';
    coin.style.top = '15px';

    container.style.left = Math.random() * (window.innerWidth - 80) + 'px';
    container.style.top = '-80px';

    container.addEventListener('click', function() {
        score += clickPower;
        this.style.opacity = '0';
        this.style.transform = 'scale(1.5)';
        updateUI();
        setTimeout(() => this.remove(), 300);
    });

    container.addEventListener('mouseover', function() {
        coin.style.transform = 'scale(1.2)';
    });
    
    container.addEventListener('mouseout', function() {
        coin.style.transform = 'scale(1)';
    });

    container.appendChild(coin);
    document.getElementById('gameArea').appendChild(container);
    animateCoin(container);
}

function animateCoin(container) {
    let position = -80;
    const speed = 2 + Math.random() * 3;
    
    function move() {
        position += speed;
        container.style.top = position + 'px';
        if(position < window.innerHeight) {
            requestAnimationFrame(move);
        } else {
            container.remove();
        }
    }
    move();
}

function buyUpgrade(type) {
    const cost = upgrades[type].cost;
    if(score >= cost) {
        score -= cost;
        switch(type) {
            case 'clickPower':
                clickPower++;
                upgrades.clickPower.cost *= 1.5;
                break;
            case 'autoClicker':
                autoClickers++;
                upgrades.autoClicker.cost *= 1.8;
                break;
            case 'slowTime':
                gameSpeed = 0.5;
                setTimeout(() => gameSpeed = 1.0, 10000);
                upgrades.slowTime.cost *= 2;
                break;
        }
        updateUI();
    }
}

function updateUI() {
    document.getElementById('score').textContent = Math.floor(score);
    document.getElementById('cps').textContent = autoClickers;
    document.getElementById('clickCost').textContent = Math.floor(upgrades.clickPower.cost);
    document.getElementById('autoCost').textContent = Math.floor(upgrades.autoClicker.cost);
    document.getElementById('slowCost').textContent = Math.floor(upgrades.slowTime.cost);
}

setInterval(() => {
    score += autoClickers;
    updateUI();
}, 1000);

setInterval(() => {
    if(gameSpeed === 1.0) createCoin();
}, 1000 / gameSpeed);

setInterval(createCoin, 500);

document.addEventListener('keydown', (e) => {
    if(e.code === 'Space') {
        e.preventDefault();
        clickNearestCoin();
    }
});

function clickNearestCoin() {
    const coins = Array.from(document.getElementsByClassName('coin-container'));
    if(coins.length === 0) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    let closestCoin = null;
    let minDistance = Infinity;

    coins.forEach(coin => {
        const rect = coin.getBoundingClientRect();
        const coinX = rect.left + 40;
        const coinY = rect.top + 40;
        const distance = Math.hypot(coinX - centerX, coinY - centerY);

        if(distance < minDistance) {
            minDistance = distance;
            closestCoin = coin;
        }
    });

    if(closestCoin) {
        closestCoin.style.transform = 'scale(1.2)';
        setTimeout(() => {
            closestCoin.style.transform = 'scale(1)';
            closestCoin.click();
        }, 50);
    }
}