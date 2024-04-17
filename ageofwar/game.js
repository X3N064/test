const gameArea = document.getElementById('game');
const ageDisplay = document.getElementById('ageDisplay');
const resourceDisplay = document.getElementById('resourceDisplay');
const upgradeButton = document.getElementById('upgradeButton');
const unitChoices = document.getElementById('unitChoices');

let currentAge = 0;
let playerResources = 100;
let enemyResources = 100;
let playerBaseHealth = 500;
let enemyBaseHealth = 500;

const playerBase = document.createElement('div');
playerBase.id = 'playerBase';
playerBase.className = 'base';
playerBase.style.left = '0px';
gameArea.appendChild(playerBase);

const enemyBase = document.createElement('div');
enemyBase.id = 'enemyBase';
enemyBase.className = 'base';
enemyBase.style.right = '0px';
gameArea.appendChild(enemyBase);

const ages = [
    {
        name: '원시시대',
        units: [
            { name: '주먹쟁이', health: 50, attack: 5, cost: 20 },
            { name: '큰방망이', health: 60, attack: 10, cost: 30 },
            { name: '불지피미', health: 40, attack: 7, cost: 25 },
            { name: '공룡조련사', health: 100, attack: 20, cost: 50 }
        ]
    },
    {
        name: '석기시대',
        units: [
            { name: '돌도끼', health: 70, attack: 15, cost: 35 },
            { name: '궁수', health: 50, attack: 20, cost: 40 },
            { name: '기마병', health: 80, attack: 25, cost: 50 },
            { name: '마차병', health: 100, attack: 30, cost: 60 }
        ]
    },
    {
        name: '철기시대',
        units: [
            { name: '장창병', health: 90, attack: 25, cost: 60 },
            { name: '기마궁수', health: 70, attack: 30, cost: 70 },
            { name: '기사', health: 110, attack: 35, cost: 80 },
            { name: '영웅', health: 150, attack: 50, cost: 100 }
        ]
    },
    {
        name: '총기시대',
        units: [
            { name: '기관총병', health: 100, attack: 40, cost: 100 },
            { name: '대포', health: 150, attack: 50, cost: 150 },
            { name: '탱크', health: 200, attack: 60, cost: 200 },
            { name: '헬기', health: 250, attack: 70, cost: 300 }
        ]
    },
    {
        name: '미래시대',
        units: [
            { name: '군용로봇', health: 200, attack: 80, cost: 250 },
            { name: '골리앗', health: 250, attack: 100, cost: 300 },
            { name: 'VX-10', health: 300, attack: 120, cost: 350 },
            { name: '전쟁의 신', health: 400, attack: 150, cost: 400 }
        ]
    }
];

function startGame() {
    updateGameArea();
    setupInterface();
    setInterval(addResources, 1000); // 1초에 자원 추가
    setInterval(enemySpawnUnit, 3000); // 적 유닛 소환 주기 설정
}

function updateGameArea() {
    ageDisplay.textContent = currentAge + 1;
    resourceDisplay.textContent = playerResources;
}

function setupInterface() {
    unitChoices.innerHTML = '';
    ages[currentAge].units.forEach((unit, index) => {
        const unitButton = document.createElement('button');
        unitButton.textContent = `${unit.name} (${unit.cost})`;
        unitButton.addEventListener('click', () => createUnit(index));
        unitChoices.appendChild(unitButton);
    });
    upgradeButton.addEventListener('click', upgradeAge);
}

function upgradeAge() {
    if (currentAge < ages.length - 1 && playerResources >= 100) {
        currentAge++;
        playerResources -= 100;
        updateGameArea();
        setupInterface();
    }
}

function createUnit(unitIndex) {
    const unit = ages[currentAge].units[unitIndex];
    if (playerResources >= unit.cost) {
        playerResources -= unit.cost;
        spawnUnit('player', unit);
        updateGameArea();
    }
}

function addResources() {
    playerResources += 10; // 1초에 자원 추가
    enemyResources += 10; // 적 자원도 1초에 10 추가
    updateGameArea();
}

function enemySpawnUnit() {
    const unitIndex = Math.floor(Math.random() * ages[currentAge].units.length);
    const unit = ages[currentAge].units[unitIndex];
    if (enemyResources >= unit.cost) {
        enemyResources -= unit.cost;
        spawnUnit('enemy', unit);
    }
}

function spawnUnit(type, unit) {
    const unitElement = document.createElement('div');
    unitElement.className = type === 'player' ? 'unit' : 'enemy-unit';
    unitElement.style.position = 'absolute';
    unitElement.style.width = '30px';
    unitElement.style.height = '30px';
    
    const unitImage = `${unit.name}.jpg`;
    unitElement.style.backgroundImage = `url(${unitImage})`;

    if (type === 'player') {
        unitElement.style.left = '0px';
        unitElement.style.top = `${playerBase.offsetTop}px`;
    } else {
        unitElement.style.right = '0px';
        unitElement.style.top = `${enemyBase.offsetTop}px`;
    }

    // 유닛의 초기 체력, 공격력 및 비용을 데이터 속성에 저장
    unitElement.dataset.health = unit.health;
    unitElement.dataset.attack = unit.attack;
    unitElement.dataset.cost = unit.cost;

    // 유닛의 하단에 체력바 생성
    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';
    healthBar.style.width = `${unit.health}px`;
    healthBar.style.height = '5px';
    healthBar.style.backgroundColor = 'red';
    healthBar.style.border = '1px solid black'; // 테두리 추가
    healthBar.style.position = 'absolute';
    healthBar.style.bottom = '-5px';
    healthBar.style.left = '0px';
    unitElement.appendChild(healthBar);

    gameArea.appendChild(unitElement);
    moveUnit(unitElement, type);
}

function moveUnit(unitElement, type) {
    // 바닥 높이 설정
    const groundHeight = 50; // 바닥의 높이 (CSS에서 지정한 값과 일치시켜야 합니다.)
    
    // 유닛의 bottom을 바닥 높이에 맞추어 설정
    unitElement.style.bottom = `${groundHeight}px`;

    const moveInterval = setInterval(() => {
        let currentPos;
        if (type === 'player') {
            currentPos = parseInt(unitElement.style.left);
            unitElement.style.left = `${currentPos + 1}px`;
        } else {
            currentPos = parseInt(unitElement.style.right);
            unitElement.style.right = `${currentPos + 1}px`;
        }

        // 충돌 감지
        const collisionDetected = checkCollision(unitElement, type);
        if (collisionDetected) {
            clearInterval(moveInterval); // 충돌 시 이동 중지
            return;
        }

        // 기지 도달 감지
        if ((type === 'player' && unitElement.getBoundingClientRect().right >= enemyBase.getBoundingClientRect().left) || 
            (type === 'enemy' && unitElement.getBoundingClientRect().left <= playerBase.getBoundingClientRect().right)) {
            clearInterval(moveInterval);
            engageBase(unitElement, type);
        }
    }, 16);
}


function engageBase(unitElement, type) {
    const attackInterval = setInterval(() => {
        const attack = parseInt(unitElement.dataset.attack);
        
        if (type === 'player') {
            // 플레이어 유닛이 적 기지를 공격
            enemyBaseHealth -= attack;

            // 적 기지의 체력바 업데이트
            const enemyBaseHealthBar = enemyBase.querySelector('.health-bar');
            if (enemyBaseHealthBar) {
                enemyBaseHealthBar.style.width = `${enemyBaseHealth}px`;
            }

            if (enemyBaseHealth <= 0) {
                alert('플레이어가 승리했습니다.');
                clearInterval(attackInterval);
                return; // 공격 중지
            }
        } else {
            // 적 유닛이 플레이어 기지를 공격
            playerBaseHealth -= attack;

            // 플레이어 기지의 체력바 업데이트
            const playerBaseHealthBar = playerBase.querySelector('.health-bar');
            if (playerBaseHealthBar) {
                playerBaseHealthBar.style.width = `${playerBaseHealth}px`;
            }

            if (playerBaseHealth <= 0) {
                alert('플레이어가 패배했습니다.');
                clearInterval(attackInterval);
                return; // 공격 중지
            }
        }

        // 유닛의 현재 체력을 확인하여 사망 여부를 확인
        if (parseInt(unitElement.dataset.health) <= 0) {
            clearInterval(attackInterval);
            return; // 공격 중지
        }
        
    }, 1000);
}

function checkCollision(unitElement, type) {
    const opponentUnits = document.querySelectorAll(type === 'player' ? '.enemy-unit' : '.unit');
    const unitRect = unitElement.getBoundingClientRect();
    for (const opponentUnit of opponentUnits) {
        const opponentRect = opponentUnit.getBoundingClientRect();
        if (type === 'player' && unitRect.right >= opponentRect.left && unitRect.left <= opponentRect.right) {
            battle(unitElement, opponentUnit);
            return true;
        } else if (type === 'enemy' && unitRect.left <= opponentRect.right && unitRect.right >= opponentRect.left) {
            battle(unitElement, opponentUnit);
            return true;
        }
    }
    return false;
}

function battle(playerUnit, opponentUnit) {
    // 유닛 간 전투를 위한 주기적인 공격을 설정
    const battleInterval = setInterval(() => {
        // 각 유닛의 체력과 공격력을 가져옴
        let playerHealth = parseInt(playerUnit.dataset.health);
        let opponentHealth = parseInt(opponentUnit.dataset.health);
        const playerAttack = parseInt(playerUnit.dataset.attack);
        const opponentAttack = parseInt(opponentUnit.dataset.attack);

        // 유닛이 서로 공격하여 체력을 감소시킴
        playerHealth -= opponentAttack;
        opponentHealth -= playerAttack;

        // 업데이트된 체력을 유닛 데이터 속성에 반영
        playerUnit.dataset.health = playerHealth;
        opponentUnit.dataset.health = opponentHealth;

        // 체력바 업데이트
        const playerHealthBar = playerUnit.querySelector('.health-bar');
        const opponentHealthBar = opponentUnit.querySelector('.health-bar');
        playerHealthBar.style.width = `${playerHealth}px`;
        opponentHealthBar.style.width = `${opponentHealth}px`;

        // 플레이어 유닛 사망 처리
        if (playerHealth <= 0) {
            clearInterval(battleInterval);
            playerUnit.remove();

            // 상대 유닛의 공격을 중지하고 이동을 재개
            moveUnit(opponentUnit, 'enemy');
            return; // 반복 중지
        }

        // 적 유닛 사망 처리
        if (opponentHealth <= 0) {
            clearInterval(battleInterval);
            opponentUnit.remove();

            // 플레이어 유닛의 이동을 재개
            moveUnit(playerUnit, 'player');
            return; // 반복 중지
        }
    }, 1000);
}


// 게임 시작
startGame();
