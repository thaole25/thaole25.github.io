// 1 => <div class='wall'></div>
// 2 => <div class='coin'></div>
// 3 => <div class='ground'></div>
// 4 => <div class='banana'></div>
// 5 => <div class='minion'></div>

const map1 = [ 
    [1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,3,4,3,3,3,2,3,3,3,2,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1], 
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,1,3,3,3,3,1],  
    [1,3,3,3,3,3,5,3,3,3,3,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1], 
];

const map2 = [ 
    [1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,3,4,3,3,3,2,3,3,3,2,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1], 
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,5,3,3,3,3,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1], 
];

const map3 = [ 
    [1,1,1,1,1,1,1,1,1,1,1,1], 
    [1,3,3,3,3,3,4,3,3,3,3,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1], 
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,5,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1],  
    [1,3,2,3,3,3,3,3,3,3,2,1],  
    [1,3,3,3,3,3,3,3,3,3,3,1], 
    [1,1,1,1,1,1,1,1,1,1,1,1], 
];

const MAX_TIME = 20;
const el = document.getElementById('world');
const nextButton = document.getElementById('nextBtn');
const finishButton = document.getElementById('finishBtn');
const timer = document.getElementById('timer');
const historyMap = [map1, map2, map3];
const participant = "Thao";

let listenerPressKey;
let timeout;
let gameIndex = 0;
let seconds = MAX_TIME;
let saveData = []; //uct timestamp - posX - posY - game index - participant
//let fileName = currentMap + ".json";

startGame();

function startGame(){
	let map = historyMap[gameIndex];
	results = drawWorld(map);
	let goals = results[0];
	let minion = results[1];
	countDown();
	listenerPressKey = function listener(event){
		pressKey(map, goals, minion);
	}
	document.addEventListener("keydown", listenerPressKey);
}

function drawWorld(map){
	let goals = [];
	let minion;
	el.innerHTML = '';
	for(let y = 0; y < map.length ; y = y + 1) {
		for(let x = 0; x < map[y].length ; x = x + 1) {		
			if (map[y][x] === 1) {
				el.innerHTML += "<div class='wall'></div>";
			}
			else if (map[y][x] === 2) {
				el.innerHTML += "<div class='coin'></div>";
				goals.push({"x": x, "y": y, "type": 2});
			}
			else if (map[y][x] === 3) {
				el.innerHTML += "<div class='ground'></div>";
			}
			else if (map[y][x] === 4) {
				el.innerHTML += "<div class='banana'></div>";
				goals.push({"x": x, "y": y, "type": 4});
			}
			else if (map[y][x] === 5) {
				el.innerHTML += "<div class='minion'></div>";
				minion = {"x": x, "y": y};
				
			}
		}
		el.innerHTML += "<br>";
	}
	return [goals, minion];
}

function countDown(){
	timer.innerHTML = seconds;
	seconds --;
	timeout = setTimeout(countDown, 1000);
	if (seconds < 0){
		finish();
	}
}

function pressKey(map, goals, minion){
	let numberGoals = goals.length;
	let i;
	let now = new Date();
	let timestamp = now.getUTCFullYear() + "-" + (now.getUTCMonth() + 1) + "-" + now.getUTCDate()
					+ " " + now.getUTCHours() + ":" + now.getUTCMinutes() + ":" + now.getUTCSeconds() 
					+ "." + now.getUTCMilliseconds();
	if (event.keyCode === 37){ // minion MOVE LEFT
		if (map[minion.y][minion.x-1] !== 1){
			for (i = 0; i < numberGoals; i++){
				if (minion.y == goals[i].y && minion.x == goals[i].x){
					map[minion.y][minion.x] = goals[i].type;
					break;
				}
			}

			if (i == numberGoals){
				map[minion.y][minion.x] = 3;
			}
			minion.x = minion.x - 1;
			//map[minion.y][minion.x] = 5;
			//drawWorld(map);
		}
	}else if (event.keyCode === 38){ // minion MOVE UP
		if ( map[minion.y-1][minion.x] !== 1){
			for (i = 0; i < numberGoals; i++){
				if (minion.y == goals[i].y && minion.x == goals[i].x){
					map[minion.y][minion.x] = goals[i].type;
					break;
				}
			}
			if (i == numberGoals){
				map[minion.y][minion.x] = 3;
			}
			minion.y = minion.y - 1;
			//map[minion.y][minion.x] = 5;
			//drawWorld(map);
		}
	}
	else if (event.keyCode === 39){ // minion MOVE RIGHT
		if ( map[minion.y][minion.x+1] !== 1){
			for (i = 0; i < numberGoals; i++){
				if (minion.y == goals[i].y && minion.x == goals[i].x){
					map[minion.y][minion.x] = goals[i].type;
					break;
				}
			}
			if (i == numberGoals){
				map[minion.y][minion.x] = 3;
			}
			minion.x = minion.x + 1;
			//map[minion.y][minion.x] = 5;
			//drawWorld(map);
		}
	}
	else if (event.keyCode === 40){ // minion MOVE DOWN
		if ( map[minion.y+1][minion.x] !== 1){
			for (i = 0; i < numberGoals; i++){
				if (minion.y == goals[i].y && minion.x == goals[i].x){
					map[minion.y][minion.x] = goals[i].type;
					break;
				}
			}
			if (i == numberGoals){
				map[minion.y][minion.x] = 3;
			}
			minion.y = minion.y + 1;
			//map[minion.y][minion.x] = 5;
			//drawWorld(map);
		}
	}
	saveData.push([timestamp, minion.x, minion.y, gameIndex, participant]);
	map[minion.y][minion.x] = 5;
	drawWorld(map);
}

function finish(){
	clearTimeout(timeout);
	timer.innerHTML = '';
	document.removeEventListener("keydown", listenerPressKey);
	finishButton.style.display = 'none';
	nextButton.style.display = 'inline-block';
	let fileName = participant + "-" + gameIndex + ".csv";
	saveToCSV(fileName, saveData);
	gameIndex += 1;
}

function saveToCSV(fileName, saveData) {
	let csvContent = "data:text/csv;charset=utf-8,";
	saveData.forEach(elem => {
		let row = elem.join(",");
		csvContent += row + "\r\n";
	});
	let link = document.createElement("a");
	link.setAttribute("href", encodeURI(csvContent));
	link.setAttribute("download", fileName);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function nextGame() {
    //done();
    nextButton = document.getElementById("nextMap");
    nextButton.disabled = true;
	if (currentMap == 1){
		design = design2;
		currentMap += 1;
	}else if (currentMap == 2){
		design = design3;
		currentMap += 1;
	}else{
        alert("No more maps! Back to the first map");
        design = design1;
        currentMap = 1;
	}
	map = design.map;
	minion = design.minion;
    goals = design.goals;
    savePositions = [];
    fileName = currentMap + ".json";
    drawWorld(map);
    seconds = MAX_TIME;
    countDown();
    //countDown(30);
    document.addEventListener("keydown", pressKey);
}

