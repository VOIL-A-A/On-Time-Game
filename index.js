 // // variables for modal
 const modal = document.getElementById("howToModal");
 const spanClose = document.getElementsByClassName("closeModal")[0];
 const howToButton = document.getElementById("moreInfo");
 
 // // when the how to play button is clicked, the modal is opened
 howToButton.onclick = function() {
	 modal.style.display = "block";
 }
 // // when "Close" is clicked, the modal is closed
 spanClose.onclick = function() {
	 modal.style.display = "none";
 }
 // // when the modal is opened and anywhere outside of the modal is clicked, the modal will close
 window.onclick = function(e) {
	 if (e.target === modal) {
		 modal.style.display = "none";
	 }
 }
//Start Button
let startButton = document.getElementById('start');
startButton.addEventListener('click', Remove);
let bodyhtml = document.getElementById('body');
//Remove Function
function Remove() {
    let bodyChildren = bodyhtml.children;
    for(let i = 0; i < bodyChildren.length;i){
        bodyChildren[i].remove();
    }
}

//
function startgame(){
kaboom()
fullscreen(!fullscreen())
//Cons(coins) is not workin as intended
let cons = 0;
// Load assets
loadSprite("bean", 'importantImages/laptop.png')
loadSprite("ghosty", 'importantImages/laptop.png')
loadSprite("spike", 'importantImages/laptop.png')
loadSprite("grass", 'importantImages/laptop.png')
loadSprite("prize", 'importantImages/laptop.png')
loadSprite("apple", 'importantImages/laptop.png')
loadSprite("portal", 'importantImages/laptop.png')
loadSprite("book2", 'importantImages/atomic.PNG')
loadSprite("keys", 'importantImages/keys.PNG')
loadSprite("laptop", 'importantImages/laptop.PNG')
loadSprite("bookbag", 'importantImages/backpack.PNG')
loadSprite("charger", 'importantImages/charger.PNG')
loadSprite("coin", 'importantImages/AAL.PNG')
// custom component controlling enemy patrol movement
function patrol(speed = 60, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area", ],
		add() {
			this.on("collide", (obj, col) => {
				if (col.isLeft() || col.isRight()) {
					dir = -dir
				}
			})
		},
		update() {
			this.move(speed * dir, 0)
		},
	}
}
// define some constants
const JUMP_FORCE = 1520
const MOVE_SPEED = 480
const FALL_DEATH = 2400

const LEVELS = [
	[
	    "      88                                               $",
	    "      ===                                              $",
	    "                                    ====          ==   $",
	    "                       ====                            $",
	    "===                                                    $",
		"                                                       $",
		"                                                       $",
		"                22                       =====         $",
		"               ===                                     $",
		"         $$                                            $",
		"        ====          =       1 1             5 5      $",
		"                      =      ====            ====      $",
		"                      =                                $",
		"                      =              ==                $",
		"       ^^      = >    =    00      >                   $",
		"========================================================",
	],
// 	[
// 		"     $    $    $    $     $",
// 		"     $    $    $    $     $",
// 		"                           ",
// 		"                           ",
// 		"                           ",
// 		"                           ",
// 		"                           ",
// 		" ^^^^>^^^^>^^^^>^^^^>^^^^^@",
// 		"===========================",
// 	],
]

// define what each symbol means in the level graph
const levelConf = {
	// grid size
	width: 100,
	height: 100,
	// define each object as a list of components
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		// pos(0, -9),
		origin("bot"),
		"coin",
	],
	"0": () => [
		sprite("laptop"),
		area(),
		origin("bot"),
		"coin",
	],
	"5": () => [
		sprite("charger"),
		area(),
		origin("bot"),
		"coin",
	],
	"1": () => [
		sprite("book2"),
		area(),
		origin("bot"),
		"coin",
	],
	"%": () => [
		sprite("prize"),
		area(),
		solid(),
		origin("bot"),
		"prize",
	],
	"8": () => [
		sprite("bookbag"),
		area(),
		solid(),
		origin("bot"),
		"coin",
	],
	"2": () => [
		sprite("keys"),
		area(),
		solid(),
		origin("bot"),
		"coin",
	],
	"^": () => [
		sprite("spike"),
		area(),
		solid(),
		origin("bot"),
		"danger",
	],
	"#": () => [
		sprite("apple"),
		area(),
		origin("bot"),
		body(),
		"apple",
	],
	">": () => [
		sprite("ghosty"),
		area(),
		origin("bot"),
		body(),
		patrol(),
		"enemy",
	],
	"@": () => [
		sprite("portal"),
		area({ scale: 0.5, }),
		origin("bot"),
		pos(0, -12),
		"portal",
	],
// 	">": () => [
// 		sprite("ghosty"),
// 		area(),
// 		origin("bot"),
// 		body(),
// 		patrol(),
// 		"enemy",
// 	],
// 	"@": () => [
// 		sprite("portal"),
// 		area({ scale: 0.5, }),
// 		origin("bot"),
// 		pos(0, -12),
// 		"portal",
// 	],
}

scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {
	gravity(3200)
	// add level to scene
	const level = addLevel(LEVELS[levelId ?? 0], levelConf)
	// define player object
	const player = add([
		sprite("bean"),
		pos(0, 0),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		origin("bot"),
	])
	// action() runs every frame
	player.onUpdate(() => {
		// center camera to player
		camPos(player.pos)
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("lose")
		}
	})
	// if player onCollide with any obj with "danger" tag, lose
	player.onCollide("danger", () => {
		go("lose")
	})

	player.onCollide("portal", () => {
		if (levelId + 1 < LEVELS.length) {
			go("game", {
				levelId: levelId + 1,
				coins: coins,
			})
		} else {
			go("win")
		}
	})

	player.onGround((l) => {
		if (l.is("enemy")) {
			player.jump(JUMP_FORCE * 1.5)
			destroy(l)
			addKaboom(player.pos)
		}
	})

	player.onCollide("enemy", (e, col) => {
		// if it's not from the top, die
		if (!col.isBottom()) {
			go("lose")
		}
	})
// 	player.onCollide("portal", () => {
// 		if (levelId + 1 < LEVELS.length) {
// 			go("game", {
// 				levelId: levelId + 1,
// 				coins: coins,
// 			})
// 		} else {
// 			go("win")
// 		}
// 	})

// 	player.onGround((l) => {
// 		if (l.is("enemy")) {
// 			player.jump(JUMP_FORCE * 1.5)
// 			destroy(l)
// 			addKaboom(player.pos)
// 		}
// 	})

// 	player.onCollide("enemy", (e, col) => {
// 		// if it's not from the top, die
// 		if (!col.isBottom()) {
// 			go("lose")
// 		}
// 	})

const timer = add([
		text(10),
		pos(100, 32),
		fixed(),
		{ time: 10, },
	])

	timer.onUpdate(() => {
		timer.time -= dt()
		timer.text = timer.time.toFixed(2)
		if (timer.time < 0) {
			go("win")
		}
	})

	let coinPitch = 0
	onUpdate(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100)
		}
	})
	player.onCollide("coin", (c) => {
		destroy(c)
		cons += 1
		coinPitch += 100
		coins += 1
		coinsLabel.text = coins
	})
	player.onCollide("bookbag", (c) => {
		destroy(c)
		cons += 1
		coinPitch += 100
		coins += 1
		coinsLabel.text = coins
	})
	const coinsLabel = add([
		text(coins),
		pos(24, 24),
		fixed(),
	])
	// jump with space
	onKeyPress("space", () => {
		// these 2 functions are provided by body() component
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
		}
	})
	onKeyDown("left", () => {
		player.move(-MOVE_SPEED, 0)
	})
	onKeyDown("right", () => {
		player.move(MOVE_SPEED, 0)
	})
	onKeyPress("down", () => {
		player.weight = 3
	})
	onKeyRelease("down", () => {
		player.weight = 1
	})
})
scene("lose", () => {
	add([
		text("You Lose"),
	])
	onKeyPress(() => go("game"))
})
scene("win", () => {
	add([
		text(`You Won With a score of ${cons}`),
	])
	onKeyPress(() => go("game"))
	cons = 0
})
go("game")
}
startButton.addEventListener('click',startgame)