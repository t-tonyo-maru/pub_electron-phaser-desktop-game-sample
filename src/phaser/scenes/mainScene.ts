import Phaser from "phaser";

import BUTTON_PLUS from "../../assets/images/controllers/+.png";
import BUTTON_MINUS from "../../assets/images/controllers/-.png";
import BUTTON_A from "../../assets/images/controllers/a.png";
import BUTTON_B from "../../assets/images/controllers/b.png";
import CAPTURE from "../../assets/images/controllers/capture.png";
import CONTROLLER from "../../assets/images/controllers/controller.png";
import CURSOR_BOTTOM from "../../assets/images/controllers/cursor_bottom.png";
import CURSOR_LEFT from "../../assets/images/controllers/cursor_left.png";
import CURSOR_RIGHT from "../../assets/images/controllers/cursor_right.png";
import CURSOR_TOP from "../../assets/images/controllers/cursor_top.png";
import HOME from "../../assets/images/controllers/home.png";
import BUTTON_L from "../../assets/images/controllers/l.png";
import BUTTON_R from "../../assets/images/controllers/r.png";
import BUTTON_STICK from "../../assets/images/controllers/stick.png";
import BUTTON_X from "../../assets/images/controllers/x.png";
import BUTTON_Y from "../../assets/images/controllers/y.png";
import BUTTON_ZL from "../../assets/images/controllers/zl.png";
import BUTTON_ZR from "../../assets/images/controllers/zr.png";
import KIRITAN from "../../assets/images/kiritan.png";

const CONTROLLER_BUTTON_COUNT = 22;
const BUTTON_STATUS_COLORS = {
	ON: 0x888888,
	OFF: 0xffffff,
};

/**
 * https://phaser.io/examples/v3.85.0/input/gamepad
 * https://phaser.io/examples/v3.85.0/input/gamepad/view/move-sprite
 */
export class MainScene extends Phaser.Scene {
	title!: Phaser.GameObjects.Text;
	warning!: Phaser.GameObjects.Text;
	pad: Phaser.Input.Gamepad.Gamepad | null;
	player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	isLStickControl!: boolean;

	// text
	texts: Phaser.GameObjects.Text[] = [
		//  1: Left stick axes X,
		//  2: Left stick axes Y,
		//  3: Right stick axes X,
		//  4: Right stick axes Y,
		//  5: Button L,
		//  6: Button R,
		//  7: Button ZL,
		//  8: Button ZR,
		//  9: Button left stick,
		// 10: Button reft stick,
		// 11: Button minus,
		// 12: Button plus,
		// 13: Button home,
		// 14: Button capture,
		// 15: Button B,
		// 16: Button A,
		// 17: Button Y,
		// 18: Button X,
		// 19: Cursor T,
		// 20: Cursor B,
		// 21: Cursor L,
		// 22: Cursor R,
	];
	// controller + buttons
	controllerBg!: Phaser.GameObjects.Image;
	aButton!: Phaser.GameObjects.Image;
	bButton!: Phaser.GameObjects.Image;
	xButton!: Phaser.GameObjects.Image;
	yButton!: Phaser.GameObjects.Image;
	lButton!: Phaser.GameObjects.Image;
	rButton!: Phaser.GameObjects.Image;
	zlButton!: Phaser.GameObjects.Image;
	zrButton!: Phaser.GameObjects.Image;
	stickLButton!: Phaser.GameObjects.Image;
	stickRButton!: Phaser.GameObjects.Image;
	plusButton!: Phaser.GameObjects.Image;
	minusButton!: Phaser.GameObjects.Image;
	cursorTop!: Phaser.GameObjects.Image;
	cursorBottom!: Phaser.GameObjects.Image;
	cursorLeft!: Phaser.GameObjects.Image;
	cursorRight!: Phaser.GameObjects.Image;
	homeButton!: Phaser.GameObjects.Image;
	captureButton!: Phaser.GameObjects.Image;

	constructor() {
		super({ key: "MainScene_P6XfCc93+g1NXNnPt/YNuXIjQc1Hqb7e" });
		this.pad = null;
	}

	preload() {
		// controllers
		this.load.image("CONTROLLER", CONTROLLER);
		this.load.image("BUTTON_A", BUTTON_A);
		this.load.image("BUTTON_B", BUTTON_B);
		this.load.image("BUTTON_X", BUTTON_X);
		this.load.image("BUTTON_Y", BUTTON_Y);
		this.load.image("BUTTON_L", BUTTON_L);
		this.load.image("BUTTON_R", BUTTON_R);
		this.load.image("BUTTON_ZL", BUTTON_ZL);
		this.load.image("BUTTON_ZR", BUTTON_ZR);
		this.load.image("BUTTON_STICK", BUTTON_STICK);
		this.load.image("BUTTON_STICK", BUTTON_STICK);
		this.load.image("BUTTON_MINUS", BUTTON_MINUS);
		this.load.image("BUTTON_PLUS", BUTTON_PLUS);
		this.load.image("CURSOR_BOTTOM", CURSOR_BOTTOM);
		this.load.image("CURSOR_LEFT", CURSOR_LEFT);
		this.load.image("CURSOR_RIGHT", CURSOR_RIGHT);
		this.load.image("CURSOR_TOP", CURSOR_TOP);
		this.load.image("HOME", HOME);
		this.load.image("CAPTURE", CAPTURE);
		// kiritan
		this.load.image("KIRITAN", KIRITAN);
	}

	create() {
		// title
		this.title = this.add
			.text(
				this.scale.width / 2,
				32,
				"Electron x Phaser x Nintendo Switch Pro Controller",
				{
					color: "#ffffff",
					fontSize: 32,
				},
			)
			.setOrigin(0.5);

		// player kitiran
		this.player = this.physics.add.sprite(
			this.scale.width / 2,
			(this.scale.height * 3) / 4,
			"KIRITAN",
		);
		this.player.setBounce(0.1);
		this.player.setCollideWorldBounds(true);

		// cursor or LStick control flag
		this.isLStickControl = false;
		// toggle button for LStick control
		const toggleButton = this.add
			.text(this.scale.width * 0.8, this.scale.height * 0.9, "Toggle Control", {
				color: "#ffffff",
				fontSize: 24,
				backgroundColor: "#000000",
				padding: { x: 10, y: 5 },
			})
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

		toggleButton.on("pointerdown", () => {
			this.isLStickControl = !this.isLStickControl;
			toggleButton.setText(
				`Control is ${this.isLStickControl ? "LStick" : "CURSOR"}`,
			);
		});

		// controller background
		this.controllerBg = this.add
			.image(this.scale.width * 0.75, this.scale.height * 0.45, "CONTROLLER")
			.setScale(1)
			.setOrigin(0.5);
		// buttons
		this.aButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.343,
			this.controllerBg.y + this.controllerBg.height * -0.199,
			"BUTTON_A",
		);
		this.bButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.265,
			this.controllerBg.y + this.controllerBg.height * -0.098,
			"BUTTON_B",
		);
		this.xButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.265,
			this.controllerBg.y + this.controllerBg.height * -0.295,
			"BUTTON_X",
		);
		this.yButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.187,
			this.controllerBg.y + this.controllerBg.height * -0.199,
			"BUTTON_Y",
		);
		this.lButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.28,
			this.controllerBg.y + this.controllerBg.height * -0.6,
			"BUTTON_L",
		);
		this.rButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.28,
			this.controllerBg.y + this.controllerBg.height * -0.6,
			"BUTTON_R",
		);
		this.zlButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.28,
			this.controllerBg.y + this.controllerBg.height * -0.75,
			"BUTTON_ZL",
		);
		this.zrButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.28,
			this.controllerBg.y + this.controllerBg.height * -0.75,
			"BUTTON_ZR",
		);
		this.stickLButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.275,
			this.controllerBg.y + this.controllerBg.height * -0.195,
			"BUTTON_STICK",
		);
		this.stickRButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.13,
			this.controllerBg.y + this.controllerBg.height * 0.002,
			"BUTTON_STICK",
		);
		this.cursorTop = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.155,
			this.controllerBg.y + this.controllerBg.height * -0.075,
			"CURSOR_TOP",
		);
		this.cursorBottom = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.155,
			this.controllerBg.y + this.controllerBg.height * 0.075,
			"CURSOR_BOTTOM",
		);
		this.cursorLeft = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.202,
			this.controllerBg.y + this.controllerBg.height * 0.0,
			"CURSOR_LEFT",
		);
		this.cursorRight = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.105,
			this.controllerBg.y + this.controllerBg.height * 0.0,
			"CURSOR_RIGHT",
		);
		this.plusButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.1225,
			this.controllerBg.y + this.controllerBg.height * -0.305,
			"BUTTON_PLUS",
		);
		this.minusButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.1225,
			this.controllerBg.y + this.controllerBg.height * -0.305,
			"BUTTON_MINUS",
		);
		this.homeButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * 0.072,
			this.controllerBg.y + this.controllerBg.height * -0.199,
			"HOME",
		);
		this.captureButton = this.add.image(
			this.controllerBg.x + this.controllerBg.width * -0.07,
			this.controllerBg.y + this.controllerBg.height * -0.198,
			"CAPTURE",
		);

		// initial game pad text
		this.renderControllerInitialStatusText();

		// game pad
		if (!this.input.gamepad) return;
		this.input.gamepad.once(
			"connected",
			(pad: Phaser.Input.Gamepad.Gamepad) => {
				this.pad = pad;

				// button down
				pad.on("down", (buttonCode: number) => {
					this.renderControllerButtonStatusText(buttonCode, true);
					this.renderControllerButtonImage(buttonCode, true);
					if (!this.isLStickControl) {
						this.movePlayerWithCursor(buttonCode, true);
					}
				});
				// button up
				pad.on("up", (buttonCode: number) => {
					this.renderControllerButtonStatusText(buttonCode, false);
					this.renderControllerButtonImage(buttonCode, false);
					if (!this.isLStickControl) {
						this.movePlayerWithCursor(buttonCode, false);
					}
				});
			},
		);
	}

	update() {
		if (!this.pad) return;
		// left stick
		this.texts[0].text = `left stick axes x: ${this.pad.axes[0].getValue()}`;
		this.texts[1].text = `left stick axes y: ${this.pad.axes[1].getValue()}`;
		this.stickLButton.setPosition(
			this.controllerBg.x +
				this.controllerBg.width * -0.275 +
				14 * this.pad.axes[0].getValue(),
			this.controllerBg.y +
				this.controllerBg.height * -0.195 +
				14 * this.pad.axes[1].getValue(),
		);

		// right stick
		this.texts[2].text = `right stick axes x: ${this.pad.axes[2].getValue()}`;
		this.texts[3].text = `right stick axes y: ${this.pad.axes[3].getValue()}`;
		this.stickRButton.setPosition(
			this.controllerBg.x +
				this.controllerBg.width * 0.13 +
				14 * this.pad.axes[2].getValue(),
			this.controllerBg.y +
				this.controllerBg.height * 0.002 +
				14 * this.pad.axes[3].getValue(),
		);

		if (this.isLStickControl) {
			this.movePlayerWithLStick();
		}
	}

	renderControllerInitialStatusText(): void {
		for (let i = 0; i < CONTROLLER_BUTTON_COUNT; i++) {
			let text = "";
			if (i === 0) {
				text = "left stick axes x: 0";
			} else if (i === 1) {
				text = "left stick axes y: 0";
			} else if (i === 2) {
				text = "right stick axes x: 0";
			} else if (i === 3) {
				text = "right stick axes y: 0";
			} else if (i === 4) {
				text = "Button L: OFF";
			} else if (i === 5) {
				text = "Button R: OFF";
			} else if (i === 6) {
				text = "Button ZL: OFF";
			} else if (i === 7) {
				text = "Button ZR: OFF";
			} else if (i === 8) {
				text = "Button LStick: OFF";
			} else if (i === 9) {
				text = "Button RStick: OFF";
			} else if (i === 10) {
				text = "Button Minus: OFF";
			} else if (i === 11) {
				text = "Button Plus: OFF";
			} else if (i === 12) {
				text = "Button Home: OFF";
			} else if (i === 13) {
				text = "Button Capture: OFF";
			} else if (i === 14) {
				text = "Button B: OFF";
			} else if (i === 15) {
				text = "Button A: OFF";
			} else if (i === 16) {
				text = "Button Y: OFF";
			} else if (i === 17) {
				text = "Button X: OFF";
			} else if (i === 18) {
				text = "Cursor T: OFF";
			} else if (i === 19) {
				text = "Cursor B: OFF";
			} else if (i === 20) {
				text = "Cursor L: OFF";
			} else if (i === 21) {
				text = "Cursor R: OFF";
			}

			this.texts.push(
				this.add
					.text(
						this.scale.width * 0.1,
						this.scale.height * 0.1 + i * 28,
						text,
						{
							color: "#ffffff",
							fontSize: 20,
						},
					)
					.setOrigin(0, 0.5),
			);
		}
	}

	renderControllerButtonStatusText(buttonCode: number, on: boolean): void {
		const status = on ? "ON" : "OFF";
		if (buttonCode === 4) {
			this.texts[4].text = `Button L: ${status}`;
		}
		if (buttonCode === 5) {
			this.texts[5].text = `Button R: ${status}`;
		}
		if (buttonCode === 6) {
			this.texts[6].text = `Button ZL: ${status}`;
		}
		if (buttonCode === 7) {
			this.texts[7].text = `Button ZR: ${status}`;
		}
		if (buttonCode === 10) {
			this.texts[8].text = `Button LStick: ${status}`;
		}
		if (buttonCode === 11) {
			this.texts[9].text = `Button RStick: ${status}`;
		}
		if (buttonCode === 8) {
			this.texts[10].text = `Button Minus: ${status}`;
		}
		if (buttonCode === 9) {
			this.texts[11].text = `Button Plus: ${status}`;
		}
		if (buttonCode === 16) {
			this.texts[12].text = `Button Home: ${status}`;
		}
		if (buttonCode === 17) {
			this.texts[13].text = `Button Capture: ${status}`;
		}
		if (buttonCode === 0) {
			this.texts[14].text = `Button B: ${status}`;
		}
		if (buttonCode === 1) {
			this.texts[15].text = `Button A: ${status}`;
		}
		if (buttonCode === 2) {
			this.texts[16].text = `Button Y: ${status}`;
		}
		if (buttonCode === 3) {
			this.texts[17].text = `Button X: ${status}`;
		}
		if (buttonCode === 12) {
			this.texts[18].text = `Cursor T: ${status}`;
		}
		if (buttonCode === 13) {
			this.texts[19].text = `Cursor B: ${status}`;
		}
		if (buttonCode === 14) {
			this.texts[20].text = `Cursor L: ${status}`;
		}
		if (buttonCode === 15) {
			this.texts[21].text = `Cursor R: ${status}`;
		}
	}

	renderControllerButtonImage(buttonCode: number, on: boolean): void {
		if (buttonCode === 4) {
			// Button L
			if (this.lButton) {
				this.lButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 5) {
			// Button R
			if (this.rButton) {
				this.rButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 6) {
			// Button ZL
			if (this.zlButton) {
				this.zlButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 7) {
			// Button ZR
			if (this.zrButton) {
				this.zrButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 10) {
			// Button LStick
			if (this.stickLButton) {
				this.stickLButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 11) {
			// Button RStick
			if (this.stickRButton) {
				this.stickRButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 8) {
			// Button Minus
			if (this.minusButton) {
				this.minusButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 9) {
			// Button Plus
			if (this.plusButton) {
				this.plusButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 16) {
			// Button Home
			if (this.homeButton) {
				this.homeButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 17) {
			// Button Capture
			if (this.captureButton) {
				this.captureButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 0) {
			// Button B
			if (this.bButton) {
				this.bButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 1) {
			// Button A
			if (this.aButton) {
				this.aButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 2) {
			// Button Y
			if (this.yButton) {
				this.yButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 3) {
			// Button X
			if (this.xButton) {
				this.xButton.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 12) {
			// Cursor T
			if (this.cursorTop) {
				this.cursorTop.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 13) {
			// Cursor B
			if (this.cursorBottom) {
				this.cursorBottom.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 14) {
			// Cursor L
			if (this.cursorLeft) {
				this.cursorLeft.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
		if (buttonCode === 15) {
			// Cursor R
			if (this.cursorRight) {
				this.cursorRight.setTint(
					on ? BUTTON_STATUS_COLORS.ON : BUTTON_STATUS_COLORS.OFF,
				);
			}
		}
	}

	movePlayerWithCursor(buttonCode: number, on: boolean): void {
		if (buttonCode === 12) {
			// Cursor T
			if (this.cursorTop) {
				this.player.setVelocityY(on ? -200 : 0);
			}
		}
		if (buttonCode === 13) {
			// Cursor B
			if (this.cursorBottom) {
				this.player.setVelocityY(on ? 200 : 0);
			}
		}
		if (buttonCode === 14) {
			// Cursor L
			if (this.cursorLeft) {
				this.player.setVelocityX(on ? -200 : 0);
			}
		}
		if (buttonCode === 15) {
			// Cursor R
			if (this.cursorRight) {
				this.player.setVelocityX(on ? 200 : 0);
			}
		}
	}

	movePlayerWithLStick(): void {
		if (!this.pad) return;
		this.player.setVelocityX(400 * this.pad.axes[0].getValue());
		this.player.setVelocityY(400 * this.pad.axes[1].getValue());
	}
}
