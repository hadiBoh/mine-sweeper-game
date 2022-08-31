//variables 
let allBlockPositions = [];
let randompossibleBombPosition = [];
let possibleBombPositions = [];
const bombCount = 16;
const leftEdge = [9,18,27,36,45,54,63];
const rightEdge = [17,26,35,44,53,62,71];
let takenNearpossibleBombPosForThisIndex = [];
var gameOver = 0;
//create blocks along with its faces and give it class then put them in gameBoard
const gameBoard = document.querySelector(".game-board");
function createBlocks(){
	var info = document.createElement("div");
	info.classList.add("info");
	var div = document.createElement("div");
	var flag = document.createElement("img");
	div.classList.add("info-flag");
	flag.setAttribute("src","images/flag.jpg");
	div.innerHTML ="10";
	div.appendChild(flag);
	info.appendChild(div);
	gameBoard.appendChild(info);
	for (var i = 0; i < 81; i++) {
		//add block
		allBlockPositions.push(i);
		var block = document.createElement("div");
		block.classList.add("block");
		block.setAttribute("id",i);
		//add front and back
		var back = document.createElement("div");
		var front = document.createElement("div");
		back.classList.add("back");
		front.classList.add("front");
		if (i%2 == 0) {back.style.backgroundImage = "url('images/light.jpg')"}
		if (i%2 != 0) {back.style.backgroundImage = "url('images/dark.jpg')"}
		block.appendChild(front);
		block.appendChild(back);	
		gameBoard.appendChild(block);
	}		
}createBlocks();

//taking blocks and their backface and frontfaces
blocks = Array.from(document.querySelectorAll(".block"));
backs = Array.from(document.querySelectorAll(".back"));
fronts = Array.from(document.querySelectorAll(".front"));
//add random bomb
function addBomb(){
	let randompossibleBombPosition = allBlockPositions.sort((a, b) => 0.5 - Math.random());
	for (var i = 0; i < bombCount*5; i+=8) {
		fronts[randompossibleBombPosition[i]].style.backgroundImage = "url('images/bomb.jpg')";
		blocks[randompossibleBombPosition[i]].classList.add("bomb");
		possibleBombPositions.push(randompossibleBombPosition[i]);
	}
}addBomb();

//give blocks number of bombs next to them
function giveNumbers(){
	for (var i = 0; i < 81; i++) {
		var aroundBlock = takeNumberOfNearBombs(i);
		var count = 0;
		aroundBlock.forEach(index=>{
			if (blocks[index].classList.contains("bomb")) {
				count++;
			}
		}) 
		if (count >0) {
			if (!blocks[i].classList.contains("bomb")) {
				fronts[i].style.backgroundImage = "url('images/"+count+".jpg')";
				blocks[i].setAttribute("data-photo","given");
			}
		}		
		else if (count>5) {giveNumbers();}
	}
}giveNumbers();

//8 posisions of around of blocks 
//edge blocks neighber possible positions
// corner blocks neighber possible positions
function takeNumberOfNearBombs(i){
	let nearBomb = [];
	if (leftEdge.some(left=> i == left)) {nearBomb = [i-9,i-8,i+1,i+10,i+9];}
	else if (rightEdge.some(right=> i == right)) {nearBomb = [i-10,i-9,i+9,i+8,i-1];}
	else if (i<8 && i > 0) {nearBomb = [i+1,i+10,i+9,i+8,i-1];}
	else if (i<80 && i > 72) {nearBomb = [i-10,i-9,i-8,i+1,i-1];}
	else if (i == 0) {nearBomb = [i+1,i+9,i+10];}
	else if (i == 8) {nearBomb = [i-1,i+8,i+9];}
	else if (i == 72) {nearBomb = [i-9,i-8,i+1];}
	else if (i == 80) {nearBomb = [i-10,i-9,i-1];}
	else{nearBomb = [i-10,i-9,i-8,i+1,i+10,i+9,i+8,i-1];}
	return nearBomb;
}

//click the blocks and rotate if its not bomb otherwise game is over
blocks.forEach(block=>{
	block.addEventListener("click",clickBlock);

	function clickBlock(){
		//return if it has flag on it
		if (block.childNodes[1].getAttribute("click-alert") == "flag") {
			return;
		}
		if (gameOver != 1) {
			if (block.getAttribute("data-id") != "clicked"){
				block.setAttribute("data-id" ,"clicked");
				block.style.transform = "rotateY(180deg)";
				//game over
				if (block.classList.contains("bomb")) {
					blocks.forEach(item=>{
						if (item.classList.contains("bomb")) {
							item.style.transform = "rotateY(180deg)";
						}
					})
					message = document.querySelector(".info");
					message.innerHTML = "Game Over!";
					message.style.color = "red";
					gameOver = 1;
					return;
				}
				winCheck();
				//only click on number
				if (block.getAttribute("data-photo") == "given") {
					block.setAttribute("data-id" ,"clicked");
					block.style.transform = "rotateY(180deg)";
					return;			
				}
				clickAroundBlock(takeNumberOfNearBombs(parseInt(block.getAttribute("id"))));

			}
		}
	}	
})
//check for win
function winCheck(){
	var c=0;
	blocks.forEach(block=>{
		if (block.style.transform == "rotateY(180deg)") {
			c++;
		}
	})
	//console.log(c)
	if (c == 71) {
		message = document.querySelector(".info");
		message.innerHTML = "You Won!";
		message.style.color = "green";
		
		// rotate bombs after wining
		setTimeout(()=>{
		blocks.forEach(item=>{
			if (item.classList.contains("bomb")) {
				item.style.transform = "rotateY(180deg)";
				item.style.backgroundImage = "";
			}
		})
		},2000)
		gameOver = 1;
	}
}
//add and remove flag 
backs.forEach(back=>{
	back.addEventListener("contextmenu",(e)=>{
		e.preventDefault();
		var info = document.querySelector(".info-flag");
		if (back.getAttribute("click-alert") == "flag") {
			back.style.backgroundImage = "";
			back.removeAttribute("click-alert")
			info.innerHTML = parseInt(info.innerHTML)+1;
			var flag = document.createElement("img");
			flag.setAttribute("src","images/flag.jpg");
			info.appendChild(flag);
		}else if (parseInt(info.innerHTML) > 0){
			back.style.backgroundImage = "url('images/flag.jpg')";
			back.setAttribute("click-alert","flag")
				info.innerHTML = parseInt(info.innerHTML)-1;
				var flag = document.createElement("img");
				flag.setAttribute("src","images/flag.jpg");
				info.appendChild(flag);
			
		}
		winCheck();
	})	
})

//rotate clicked block's around if not bomb
function clickAroundBlock(aroundArray){
	if (aroundArray.length == 0) {return;}

	aroundArray.forEach(index=>{
		if (blocks[index].classList.contains("bomb")
			|| blocks[index].getAttribute("data-id") == "clicked") {
			return;
		}
		else{
			blocks[index].style.transform = "rotateY(180deg)";
			blocks[index].setAttribute("data-id","clicked");
		}
	})


	getAroundArrysAround(aroundArray);
}

//get rotated around of clicked block to get checked
function getAroundArrysAround(aroundArray){
	let aroundArraysAround = [];

	aroundArray.forEach(index=>{
		//big problem solved you know whaaaaaaaaaaaaaaaaaaaat!!!!
		if(fronts[index].style.backgroundImage != ""){
			return;
		}
		var result = takeNumberOfNearBombs(index);
		result.forEach(item=>{
			if (blocks[item].getAttribute("data-id") != "clicked"
				&& !blocks[item].classList.contains("bomb")
				&& blocks[item].getAttribute("data-photo") != "given"
				&& blocks[item].style.transform != "rotateY(180deg)") {
				aroundArraysAround.push(item);
			}
			//this piece of code stops when all of rotated white blocks are srounded by only numbers!!!!
			if (blocks[item].getAttribute("data-photo") == "given") {
				blocks[item].style.transform = "rotateY(180deg)";
				blocks[item].setAttribute("data-id","clicked");				
			}	
		})
	})
		

	//console.log(unique)

	clickAroundBlock(aroundArraysAround)
}


