 // // variables for modal
 const modal = document.getElementById("howToModal");
 const spanClose = document.getElementsByClassName("closeModal")[0];
 const howToButton = document.getElementById("moreInfo");
 
 // // when the how to play button is clicked, the modal is opened
 howToButton.onclick = function() {
	 modal.style.display = "block";
 };
 // // when "Close" is clicked, the modal is closed
 spanClose.onclick = function() {
	 modal.style.display = "none";
 };
 // // when the modal is opened and anywhere outside of the modal is clicked, the modal will close
 window.onclick = function(e) {
	 if (e.target === modal) {
		 modal.style.display = "none";
	 }
 };
//Start Button
let startButton = document.getElementById('start');
let bodyhtml = document.getElementById('body');
startButton.addEventListener('click', Remove);
//Remove Function
function Remove() {
    let bodyChildren = bodyhtml.children;
    for(let i = 0; i < bodyChildren.length;i){
        bodyChildren[i].remove();
    }
}

//game Function(starts the entire game)
function startgame(){
kaboom()
fullscreen(!fullscreen())
let cons = 0;
// creating Sprites
loadSprite("bg", 'importantImages/background.png')
loadSprite("ghosty", 'importantImages/alarm.png')
loadSprite("spike", 'importantImages/tiktok.png')
loadSprite("grass", 'importantImages/rock.png')
loadSprite("portal", 'importantImages/elivator.png')
loadSprite("book2", 'importantImages/atomic.PNG')
loadSprite("keys", 'importantImages/keys.PNG')
loadSprite("laptop", 'importantImages/laptop.png')
loadSprite("bookbag", 'importantImages/backpack.PNG')
loadSprite("charger", 'importantImages/charger.PNG')
loadSprite("coin", 'importantImages/AAL.PNG')
loadSound("backgroundSound","Sound/backgroundSong.ogg")
//loading Player with spritesheet for idle animation
loadSprite("student-idle", 'importantImages/student_sprite.png', {
	sliceX: 11.8,
	anims: {
		"idle": {
			from: 0,
			to: 2,
			speed: 3,
			loop: true
		},
		"run": {
			from: 8,
			to: 11,
			speed: 5,
			loop:true
		},
	},
});
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
//Button Function

const LEVELS = [
	[
	    "       8                                               1",
	    "      ===                         1$1$1     1    1$1   $",
	    "                                  =====     =    ===   1",
	    "                             =          $1             $",
	    "===                        ^=           ==             1",
		"                          ^=                           $",
		"                          =             1$1$1          1",
		"              2          =              =====    $1    $",
		"      $      ===                                 ==    1",
		"     ====                                              $",
		"                      =        1               5       1",
		"0                     =       ====     >     =====     $",
		"==                    =               ====              ",
		"                      =                                 ",
		"       ^^      = >    =            >                 = @",
		"========================================================",
	],
	[
		"                             =",
		"                             =",
		"                             =",
		"        1$1$1$1$1            =",
		"====    =========   ======   =",
		"=               =        =   =",
		"=                        =   =",
		"= $> = 1$1$1$1$1$        = > =",
		"===================      =====",
		"=                        =    ",
		"=                     ====    ",
		"=                        =    ",
		"=  >   $1$1$1$1   >      = @ =",
		"=============================="
	],
]


const levelConf = {
// grid size
	width: 105,
	height: 107,
// define what each symbol means in the level graph
	"=": () => [
		sprite("grass"),
		area(),
		solid(),
		origin("bot"),
	],
	"$": () => [
		sprite("coin"),
		area(),
		pos(0, -40),
		origin("bot"),
		"coin",
	],
	"0": () => [
		sprite("laptop"),
		area(),
		pos(0,-40),
		origin("bot"),
		"coin",
	],
	"5": () => [
		sprite("charger"),
		area(),
		pos(0,-40),
		origin("bot"),
		"coin",
	],
	"1": () => [
		sprite("book2"),
		pos(0,-40),
		area(),
		origin("bot"),
		"coin",
	],
	"8": () => [
		sprite("bookbag"),
		area(),
		pos(0,-40),
		solid(),
		origin("bot"),
		"coin",
	],
	"2": () => [
		sprite("keys"),
		area(),
		pos(0,-20),
		solid(),
		origin("bot"),
		"coin",
	],
	"^": () => [
		sprite("spike"),
		pos(0,-5),
		area(),
		solid(),
		origin("bot"),
		"danger",
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
		pos(0, -62),
		"portal",
	],
} 


//Creats scenes for each level
scene("game", ({ levelId, coins} = { levelId: 0, coins: 0}) => {
	const music = play("backgroundSound")

//background
	add([
		sprite('bg', {width: width(), height: height()}),
		pos(1,0),
		pos(width()/2, height()/2),
		origin('center'),
		scale(1),
		fixed()
	
	]);
	
	add([
		text('press Esc to exit full screen'),
		pos(0,-200),
		fixed()
		])
	gravity(3200)
	// add level to scene
	const level = addLevel(LEVELS[levelId ?? 0], levelConf)
	// define player object
	const player = add([
		sprite("student-idle"),
		pos(0, 0),
		area(),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// the custom component we defined above
		origin("bot"),
	])
// makes it so that the idle animation plays
	player.play("idle");
// so idle animation plays when player is on ground and Some events
	player.onGround(() => {
		if (!isKeyDown("left") && !isKeyDown("right")) {
			player.play("idle")
		} 
		// else {
		// 	player.play("run")
		// }
	})
	// action() runs every frame
	player.onUpdate(() => {
		// center camera to player
		camPos(player.pos)
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			music.stop()
			go("lose")
		}
	})
	// if player onCollide with any obj with "danger" tag, lose
	player.onCollide("danger", () => {
		music.stop()
		go("lose")
	})

	player.onCollide("portal", () => {
		if (levelId + 1 < LEVELS.length) {
			music.stop()
			go("next")
		} else {
			music.stop()
			go("win")
		}
	})

	player.onGround((l) => {
		if (l.is("enemy")) {
			player.jump(JUMP_FORCE * 1.7)
			destroy(l)
			addKaboom(player.pos)
			cons += 10
			coinPitch += 100
			coins += 10
			coinsLabel.text = coins
		}
	})

	player.onCollide("enemy", (e, col) => {
	// if it's not from the top, die
		if (!col.isBottom()) {
			music.stop()
			go("lose")
		}
	})
//creats a Timer Player can see

	 timer = add([
		text(30),
		pos(200, 22),
		fixed(),
		{ time: 30, },
	])

	timer.onUpdate(() => {
		timer.time -= dt()
		timer.text = timer.time.toFixed(2)
		if (timer.time < 0) {
			music.stop()
			go("time")
		}
	})
	
//scene has to be inside game scene in order to appear
	scene('next', () => {
		add([
		sprite('bg', {width: width(), height: height()}),
		pos(1,0),
		pos(width()/2, height()/2),
		origin('center'),
		scale(1),
		fixed(),
		text('Find the hidden Elevator!'),
	])
	addButton('home', vec2(1300,0), home)
		add([
			text('level 2')
			])
			
			add([
		text('Press any Key to Continue'),
		pos(250,500)
	])
	
			onKeyPress(() => go("game", {
				levelId: levelId + 1,
				coins: cons
			}))
			stop("backgroundSound")
	})

	let coinPitch = 0
	onUpdate(() => {
		if (coinPitch > 0) {
			coinPitch = Math.max(0, coinPitch - dt() * 100)
		}
	})
	//More events
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
	onKeyPress("space", () => {
		// these 2 functions are provided by body() component
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE)
		}
	})
	onKeyDown("left", () => {
		player.move(-MOVE_SPEED, 0);
		player.flipX(false)
		if (player.isGrounded() && player.curAnim() !== "run") {
			player.play("run")
		}
	})
	onKeyDown("right", () => {
		player.move(MOVE_SPEED, 0)
		player.flipX(true)
		if (player.isGrounded() && player.curAnim() !== "run") {
			player.play("run")
		}
	})
	onKeyPress("down", () => {
		player.weight = 3
	})
	onKeyRelease("down", () => {
		player.weight = 1
	})

	onKeyRelease(["left", "right"], () => {
		// Only reset to "idle" if player is not holding any of these keys
		if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
			player.play("idle")
		}
	})
})
function addButton(txt,p,f){
		const btn = add([
		text(txt),
		pos(p),
		area({ cursor: "pointer", }),
		scale(1),
		// origin("center"),
			])
			btn.onClick(f)
	}
function home(){
	location.reload();
}


//Scenes for different endings
scene("time", () => {
	add([
		sprite('bg', {width: width(), height: height()}),
		pos(1,0),
		pos(width()/2, height()/2),
		origin('center'),
		scale(1),
		fixed(),
		text('You Ran Out of Time'),
	])
	add([
		text('Press any Key to Restart'),
		pos(250,500)
		])
	addButton('home', vec2(0,0), home)
	onKeyPress(() => go("game"))
	cons = 0
})
scene("lose", () => {
	add([
		sprite('bg', {width: width(), height: height()}),
		pos(1,0),
		pos(width()/2, height()/2),
		origin('center'),
		scale(1),
		fixed(),
		text(`You're late! Score: ${cons}`),
	])
	add([
		text('Press any Key to Restart'),
		pos(250,500)
		])
	addButton('home', vec2(0,0), home)
	onKeyPress(() => go("game"))
	cons = 0
	
})
scene("win", () => {
	add([
		sprite('bg', {width: width(), height: height()}),
		pos(1,0),
		pos(width()/2, height()/2),
		origin('center'),
		scale(1),
		fixed(),
		text(`You Arrived at Marcy! Score: ${cons}`),
	])
	add([
		text('Press any Key to Restart'),
		pos(250,500)
	])
	addButton('home', vec2(0,0), home)
	onKeyPress(() => go("game"))
	cons = 0
})

go("game")
}
startButton.addEventListener('click',startgame)
