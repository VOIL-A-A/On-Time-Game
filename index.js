//How to play Button
let moreinfo = document.getElementById('moreInfo');
function pop() {
    alert('test');
}
moreinfo.addEventListener('click', pop);
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
// Load assets
loadSprite("bean", 'laptop.png')
loadSprite("ghosty", 'laptop.png')
loadSprite("spike", 'laptop.png')
loadSprite("grass", 'laptop.png')
loadSprite("prize", 'laptop.png')
loadSprite("apple", 'laptop.png')
loadSprite("portal", 'laptop.png')
loadSprite("coin", 'laptop.png')
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
	     "                                                        ",
	    "          ===                                           ",
	    "                                    ====          ==    ",
	    "                       ====                             ",
	    "===                                                     ",
		"                                                       $",
		"                                                       $",
		"                                        =====          $",
		"               ===                                     $",
		"         $$                                            $",
		"        ====          =                                $",
		"                      =       ====             ====    $",
		"                      =                                $",
		"                      =                                $",
		"       ^^      = >    =                                $",
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
		pos(0, -9),
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


	let coinPitch = 0
	onUpdate(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100)
		}
	})
	player.onCollide("coin", (c) => {
		destroy(c)
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
		text("You Win"),
	])
	onKeyPress(() => go("game"))
})
go("game")
}
startButton.addEventListener('click',startgame)