// 기본 설정
const gameArea = document.getElementById('game');
const interfaceArea = document.getElementById('interface');
const ageDisplay = document.getElementById('ageDisplay');
const resourceDisplay = document.getElementById('resourceDisplay');
const upgradeButton = document.getElementById('upgradeButton');
const unitChoices = document.getElementById('unitChoices');

let currentAge = 0; // 현재 연대 인덱스 (0부터 시작)
let playerResources = 100; // 플레이어 자원

const playerBase = document.getElementById('playerBase');
const enemyBase = document.getElementById('enemyBase');

// 연대 정보
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

// 초기 상태 설정
function startGame() {
    updateGameArea();
    setupInterface();
    setInterval(updateUnits, 10); // 주기적으로 유닛을 업데이트합니다.
}

// 게임 영역 업데이트
function updateGameArea() {
    ageDisplay.textContent = currentAge + 1; // 연대 표시
    resourceDisplay.textContent = playerResources; // 자원 표시
}

// 인터페이스 설정
function setupInterface() {
    // 유닛 선택 공간 초기화
    unitChoices.innerHTML = '';
    ages[currentAge].units.forEach((unit, index) => {
        const unitButton = document.createElement('button');
        unitButton.textContent = `${unit.name} (${unit.cost} 자원)`;
        unitButton.onclick = () => createUnit(index);
        unitChoices.appendChild(unitButton);
    });

    // 연대 업그레이드 버튼 설정
    upgradeButton.onclick = upgradeAge;
}

// 연대 업그레이드
function upgradeAge() {
    if (currentAge < ages.length - 1 && playerResources >= 100) {
        currentAge++;
        playerResources -= 100;
        updateGameArea();
        setupInterface();
    }
}

// 유닛 생성
function createUnit(unitIndex) {
    const unit = ages[currentAge].units[unitIndex];
    if (playerResources >= unit.cost) {
        playerResources -= unit.cost;
        // 유닛 생성 및 이동 로직
        spawnUnit('player', unit);
        updateGameArea();
    } else {
        console.log('자원이 부족합니다.');
    }
}

// 유닛 생성 및 초기 설정
function spawnUnit(type, unit) {
    // 유닛을 생성하고 초기 설정합니다.
    const unitElement = document.createElement('div');
    unitElement.classList.add('unit');
    unitElement.style.top = `${Math.random() * (gameArea.clientHeight - 30)}px`; // 유닛 위치 무작위 지정

    // 플레이어와 적에 따라 시작 위치와 색상 설정
    if (type === 'player') {
        unitElement.style.left = '0px';
    } else {
        unitElement.classList.add('enemy-unit');
        unitElement.style.right = '0px';
    }

    // 유닛 데이터를 설정
    unitElement.dataset.health = unit.health;
    unitElement.dataset.attack = unit.attack;

    // 유닛 이동 속도
    const speed = 1;

    // 이동 로직 설정
    moveUnit(unitElement, type, speed);

    // 게임 영역에 유닛 추가
    gameArea.appendChild(unitElement);
}

// 유닛 이동 및 업데이트
function moveUnit(unitElement, type, speed) {
    function move() {
        let currentX;
        if (type === 'player') {
            currentX = parseInt(unitElement.style.left);
            currentX += speed;
            unitElement.style.left = `${currentX}px`;
        } else {
            currentX = parseInt(unitElement.style.right);
            currentX += speed;
            unitElement.style.right = `${currentX}px`;
        }

        // 유닛이 상대 기지에 도착했는지 확인
        if (checkUnitAtBase(unitElement, type)) {
            // 상대 기지를 공격합니다.
            attackBase(unitElement, type);
            clearInterval(moveInterval);
        }
    }

    const moveInterval = setInterval(move, 50); // 유닛을 일정 속도로 이동
    unitElement.moveInterval = moveInterval;
}

// 유닛이 상대 기지에 도착했는지 확인
function checkUnitAtBase(unitElement, type) {
    const unitRect = unitElement.getBoundingClientRect();
    if (type === 'player') {
        // 유닛이 적 기지 근처에 도착했는지 확인
        const enemyBaseRect = enemyBase.getBoundingClientRect();
        return unitRect.right >= enemyBaseRect.left;
    } else {
        // 유닛이 플레이어 기지 근처에 도착했는지 확인
        const playerBaseRect = playerBase.getBoundingClientRect();
        return unitRect.left <= playerBaseRect.right;
    }
}

// 유닛이 상대 기지에 도착했을 때의 로직
function attackBase(unitElement, type) {
    // 상대 기지를 공격하는 로직을 여기에 추가하세요.
    // 예: 기지의 체력을 감소시키거나 게임 승리 조건 확인

    // 임시로 유닛을 제거합니다.
    unitElement.remove();
}

// 주기적으로 유닛을 업데이트
function updateUnits() {
    const units = document.querySelectorAll('.unit, .enemy-unit');
    units.forEach((unitElement) => {
        moveUnit(unitElement);
    });
}

// 게임 시작
startGame();
