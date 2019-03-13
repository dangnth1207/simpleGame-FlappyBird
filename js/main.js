var game = new Phaser.Game(250, 350, Phaser.AUTO, "");

var Menu = {

	preload : function() {

		game.load.image("start","assets/message.png");

	},

	create : function() {

		game.stage.backgroundColor = "#00ff99";

		startButton = game.add.button(game.width / 2, game.height / 2, "start", this.startGame, this);

		startButton.anchor.setTo(0.5);

	},

	startGame : function() {

		game.state.start("Game");

	}


}

var Game = {

	ground : null,

	player : null,

	enemiesTop : null,

	enemiesDown : null,

	time_until_spawn: null,

	last_spawn_time: null,

	preload : function() {

		game.load.image("ground", "assets/base.png");

		game.load.image("player", "assets/flappy.png");

		game.load.image("enemiesTop", "assets/top.png");

		game.load.image("enemiesDown", "assets/down.png");

	},

	create : function() {

		game.stage.backgroundColor = "#00ffff";
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.ground = game.add.sprite(0, game.world.height / 2 + 100 , 
			"ground");
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;

		this.player = game.add.sprite(75, game.world.height / 2 - 50, "player");
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y= 300;

		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		this.enemiesTop = game.add.group();
		this.enemiesDown = game.add.group();

		this.enemiesTop.enableBody = true;
		this.enemiesDown.enableBody = true;

		this.time_until_spawn = 1000;
		this.last_spawn_time = game.time.time;

	},

	update : function() {

		game.physics.arcade.overlap(this.player, this.ground, this.endGame, null, this);
		game.physics.arcade.overlap(this.player, this.enemiesTop, this.endGame, null, this);
		game.physics.arcade.overlap(this.player, this.enemiesDown, this.endGame, null, this);

		var cur_time = game.time.time;

		if (cur_time - this.last_spawn_time > this.time_until_spawn) {

			this.time_until_spawn =  2500;

			this.last_spawn_time = cur_time;

			this.spawnObstacle();

		}

	},

	spawnObstacle : function() {

		var tmp1 = this.enemiesTop.create(game.world.width, 
			game.world.height - (Math.random()*100 + 100) , "enemiesTop");

		tmp1.body.velocity.x = -50;
		tmp1.checkWorldBounds = true;
		tmp1.outOfBoundsKill = true;

		var tmp2 = this.enemiesDown.create(game.world.width, 
			tmp1.body.velocity.y - 250 , "enemiesDown");

		tmp2.body.velocity.x = -50;
		tmp2.checkWorldBounds = true;
		tmp2.outOfBoundsKill = true;		

	},

	jump : function() {

		//if (this.player.body.touching.down) {

			this.player.body.velocity.y = -125;

		//}

	},

	endGame : function() {

		game.state.start("Menu");

	}

}

game.state.add("Menu", Menu);
game.state.add("Game",Game);

game.state.start("Menu");