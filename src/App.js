import React, { Component } from "react";
import * as THREE from "three";
import { Modal, Button, Row, Progress } from 'antd';
import soundtrack from './assets/soundtrack.mp3';
import gunshot_sound from './assets/gunshot.mp3';
import zombie_death from './assets/zombie_death.mp3';
import './App.css';

const aspect = window.innerWidth / window.innerHeight;
const MAX_IN_MAGAZINE = 8;
const d = 20;

class App extends Component {
    animationId = null;
    characterDirection = 'UP';
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
    renderer = new THREE.WebGLRenderer();
    character = null;
    enemies = [];
    bullets = [];
    pressedKeys = {};
    soundtrack = new Audio(soundtrack);

    constructor(props) {
        super(props);
        
        this.state = {
            startModalVisible: true,
            endModalVisible: false,
            level: 1,
            bulletsAmount: {
                magazine: 8,
                all: 24
            },
            zombiesGenerated: 0,
            zombiesKilled: 0
        }
    }
    
    startGame = () => {
        this.setState({ startModalVisible: false })
        
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(this.scene.position);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.mount.appendChild(this.renderer.domElement);
    
        this.generateBaseShapes();
        this.animate();

        window.addEventListener('keydown', this.onKeyDownOrUp);
        window.addEventListener('keyup', this.onKeyDownOrUp);
    }

    playSoundTrack = () => {
        this.soundtrack.volume = 0.5;
        this.soundtrack.play();
    }

    animate = () => {                        
        this.id = requestAnimationFrame(this.animate);
        if (this.state.zombiesGenerated === this.state.zombiesKilled) {
            this.handleNewLevel();
        }

        this.bullets.forEach(bulletObj => {
            if (this.shouldRemoveObject(bulletObj.bullet)) {
                this.bullets = this.bullets.filter(obj => obj !== bulletObj);
                return this.scene.remove(bulletObj.bullet);
            }
            this.handleObjectMove(bulletObj.bullet, bulletObj.direction, 0.2, false);
        })

        this.enemies.forEach(enemy => {
            const distanceToCharacter = {
                x: enemy.position.x - this.character.position.x,
                z: enemy.position.z - this.character.position.z
            };
            this.handleEnemyMove(enemy, distanceToCharacter);
        })
               
        this.handleCollisions();
        this.renderer.render(this.scene, this.camera);
    };

    shouldRemoveObject = (object) => {
        if (Math.abs(object.position.x) > 20)
            return true;
            
        if (Math.abs(object.position.z) > 20)
            return true;
        
        return false;
    }

    handleNewLevel = () => {
        const enemiesNumber = this.state.level;
            
        this.setState(prevState => ({
            zombiesGenerated: prevState.zombiesGenerated + enemiesNumber
        }));
        this.blinkLevelInfo();
        setTimeout(() => this.generateEnemies(enemiesNumber), 3000);
    }

    handleEnemyMove = (enemy, distanceToCharacter) => {
        if (distanceToCharacter.x < 0 && distanceToCharacter.z > 0) 
            return this.handleObjectMove(enemy, 'RIGHT', 0.01, false);
        
        if (distanceToCharacter.x > 0 && distanceToCharacter.z < 0) 
            return this.handleObjectMove(enemy, 'LEFT', 0.01, false);
        
        if (distanceToCharacter.x > 0 && distanceToCharacter.z > 0) 
            return this.handleObjectMove(enemy, 'UP', 0.01, false);
        
        if (distanceToCharacter.x < 0 && distanceToCharacter.z < 0) 
            return this.handleObjectMove(enemy, 'DOWN', 0.01, false);
    }

    handleCollisions = () => {
        this.enemies.forEach(enemy => {
            this.bullets.forEach(bulletObj => {
                if (this.isCharacterCollisionDetected(enemy, bulletObj.bullet)) {
                    this.scene.remove(bulletObj.bullet);
                    this.scene.remove(enemy);
                    this.bullets = this.bullets.filter(b => b !== bulletObj);
                    this.enemies = this.enemies.filter(e => e !== enemy);
                    const death = new Audio(zombie_death);
                    death.play();
                    
                    this.setState(prevState => ({
                        bulletsAmount: {
                            ...prevState.bulletsAmount,
                            all: prevState.bulletsAmount.all + 3
                        },
                        zombiesKilled: prevState.zombiesKilled + 1,
                        level: prevState.zombiesGenerated === prevState.zombiesKilled + 1 ? prevState.level + 1 : prevState.level
                    }));
                }
            })

            if (this.isCharacterCollisionDetected(enemy, this.character)) {
                this.gameOver();
            }
        });
    }

    gameOver = () => {
        cancelAnimationFrame(this.id);
        this.scene.remove(this.character);
        this.soundtrack.pause();
        this.soundtrack.currentTime = 0;

        const bestScore = localStorage.getItem('bestScore');
        
        if (!bestScore || this.state.zombiesKilled > bestScore) {
            localStorage.setItem('bestScore', this.state.zombiesKilled);
        }
        
        this.setState({ endModalVisible: true });
    }

    
    isCharacterCollisionDetected(group, object) {
        const obj = object.geometry ? object : object.children[0];
        
        let b1 = object.position.y - obj.geometry.parameters.height / 2;
        let t1 = object.position.y + obj.geometry.parameters.height / 2;
        let r1 = object.position.x + obj.geometry.parameters.width / 2;
        let l1 = object.position.x - obj.geometry.parameters.width / 2;
        let f1 = object.position.z - obj.geometry.parameters.depth / 2;
        let B1 = object.position.z + obj.geometry.parameters.depth / 2;
        let b2 = group.position.y - group.children[0].geometry.parameters.height / 2;
        let t2 = group.position.y + group.children[0].geometry.parameters.height / 2;
        let r2 = group.position.x + group.children[0].geometry.parameters.width / 2;
        let l2 = group.position.x - group.children[0].geometry.parameters.width / 2;
        let f2 = group.position.z - group.children[0].geometry.parameters.depth / 2;
        let B2 = group.position.z + group.children[0].geometry.parameters.depth / 2;
        if (t1 < b2 || r1 < l2 || b1 > t2 || l1 > r2 || f1 > B2 || B1 < f2) {
            return false;
        }
        return true;
    }

    generateBaseShapes = () => {
        this.generateCharacter();
        this.generatePlane();
    }
    
    generatePlane = () => {
        const planeGeometry = new THREE.PlaneGeometry(40, 40);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        plane.rotation.set(Math.PI / 2, 0, 0);
        this.scene.add(plane);
    }

    generateHumanoidShape = (bodyColor, headColor, legsColor, armsColor, hairColor) => {
        const bodyGeometry = new THREE.BoxGeometry(1.3, 4, 2);
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: bodyColor });
        const headGeometry = new THREE.BoxGeometry(1.3, 1.5, 2);
        const headMaterial = new THREE.MeshBasicMaterial({ color: headColor });
        const legGeometry = new THREE.BoxGeometry(1.3, 2, 0.8);
        const legMaterial = new THREE.MeshBasicMaterial({ color: legsColor });
        const armGeometry = new THREE.BoxGeometry(1.3, 1.2, 0.8);
        const armMaterial = new THREE.MeshBasicMaterial({ color: armsColor });
        const hairGeometry = new THREE.BoxGeometry(1.3, 0.2, 2);
        const hairMaterial = new THREE.MeshBasicMaterial({ color: hairColor });              
        
        const shape = {
            body: new THREE.Mesh(bodyGeometry, bodyMaterial),  
            head: new THREE.Mesh(headGeometry, headMaterial), 
            leg1: new THREE.Mesh(legGeometry, legMaterial),  
            leg2: new THREE.Mesh(legGeometry, legMaterial),  
            arm1: new THREE.Mesh(armGeometry, armMaterial),  
            arm2: new THREE.Mesh(armGeometry, armMaterial),  
            hair: new THREE.Mesh(hairGeometry, hairMaterial)
        }

        shape.body.position.set(0, 4, 0);
        shape.head.position.set(0, 7, 0);
        shape.hair.position.set(0, 8, 0);
        shape.leg1.position.set(0, 1, -0.6);
        shape.leg2.position.set(0, 1, 0.6);
        shape.arm1.position.set(0, 4.6, 1.5);
        shape.arm2.position.set(0, 4.6, -1.5);
        
        const human = new THREE.Group();
        for (const [_, value] of Object.entries(shape)) {
            human.add(value);
        }

        return human;
    }

    generateCharacter = () => {
        const character = this.generateHumanoidShape(0xffffff, 0xecc09b, 0x000000, 0xecc09b, 0x000000);
                  
        this.character = character;
        this.scene.add(character);
    }

    generateEnemies = (amount) => {        
        for (let i=0; i<amount; ++i) {
            this.generateEnemy();
        }
    }

    generateEnemy = () => {
        const randomPosition = {
            x: this.getNumberOrOppositeRandomly(Math.random() * 10 + 10),
            y: 2,
            z: this.getNumberOrOppositeRandomly(Math.random() * 10 + 10),
        };
        
        const enemy = this.generateHumanoidShape(0xff0000, 0xff0000, 0x000000, 0xff0000, 0x000000);
        enemy.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
        this.enemies.push(enemy);
        this.scene.add(enemy);
    }

    getNumberOrOppositeRandomly = (number) => {
        if (Math.round(Math.random()) === 0) {
            return number;
        }
        
        return -number;
    }

    handleObjectMove = (object, direction, value, checkPossibilityToMove = true) => {

        if (direction === 'LEFT')
            return this.handleObjectLeftMove(object, value, checkPossibilityToMove);

        if (direction === 'RIGHT')
            return this.handleObjectRightMove(object, value, checkPossibilityToMove);

        if (direction === 'UP')
            return this.handleObjectUpMove(object, value, checkPossibilityToMove);

        if (direction === 'DOWN')
            return this.handleObjectDownMove(object, value, checkPossibilityToMove);
    }

    onKeyDownOrUp = (event) => {
        this.pressedKeys[event.key] = event.type === 'keydown';
        this.playSoundTrack();

        if (this.pressedKeys['ArrowLeft'] && this.pressedKeys['ArrowDown']) {
            this.handleObjectMove(this.character, 'LEFT', 0.2);
            this.handleObjectMove(this.character, 'DOWN', 0.2);
            return;
        }

        if (this.pressedKeys['ArrowLeft'] && this.pressedKeys['ArrowUp']) {
            this.handleObjectMove(this.character, 'LEFT', 0.2);
            this.handleObjectMove(this.character, 'UP', 0.2);
            return;
        }

        if (this.pressedKeys['ArrowRight'] && this.pressedKeys['ArrowUp']) {
            this.handleObjectMove(this.character, 'RIGHT', 0.2);
            this.handleObjectMove(this.character, 'UP', 0.2);
            return;
        }

        if (this.pressedKeys['ArrowRight'] && this.pressedKeys['ArrowDown']) {
            this.handleObjectMove(this.character, 'RIGHT', 0.2);
            this.handleObjectMove(this.character, 'DOWN', 0.2);
            return;
        }

        if (this.pressedKeys['ArrowLeft']) {
            const isNewDirection = this.checkIfNewDirectionAndChange('LEFT');
            if (isNewDirection)
                return;

            this.handleObjectMove(this.character, 'LEFT', 0.2);
        }
        if (this.pressedKeys['ArrowRight']) {
            const isNewDirection = this.checkIfNewDirectionAndChange('RIGHT');
            if (isNewDirection)
                return;

            this.handleObjectMove(this.character, 'RIGHT', 0.2)
        }
        if (this.pressedKeys['ArrowUp']) {
            const isNewDirection = this.checkIfNewDirectionAndChange('UP');
            if (isNewDirection)
                return;

            this.handleObjectMove(this.character, 'UP', 0.2);
        }
        if (this.pressedKeys['ArrowDown']) {
            const isNewDirection = this.checkIfNewDirectionAndChange('DOWN');
            if (isNewDirection)
                return;

            this.handleObjectMove(this.character, 'DOWN', 0.2);
        }

        if (this.pressedKeys[' ']) {
            this.shoot();
        }

        if (this.pressedKeys['r']) {
            this.reload();
        }
    }

    checkIfNewDirectionAndChange = (direction) => {
        if (this.characterDirection !== direction) {
            this.characterDirection = direction;
            if (direction === 'LEFT') {
                this.character.rotation.y = Math.PI / 4;
            }
            if (direction === 'UP') {
                this.character.rotation.y = 3 * Math.PI / 4;
            }
            if (direction === 'RIGHT') {
                this.character.rotation.y = 5 * Math.PI / 4;
            }
            if (direction === 'DOWN') {
                this.character.rotation.y = 7 * Math.PI / 4;
            }
            
            return true;
        }
        return false;
    }

    handleObjectLeftMove = (object, value, checkPossibilityToMove = false, isBullet = false) => {
        if (checkPossibilityToMove) {
            if (object.position.x - value <= -20)
                return ;
            if (object.position.z + value >= 20)
                return ;
        }
        
        object.position.x -= value;
        object.position.z += value;
    }

    handleObjectRightMove = (object, value, checkPossibilityToMove = false, isBullet = false) => {
        if (checkPossibilityToMove) {
            if (object.position.x + value >= 20)
                return ;
            if (object.position.z - value <= -20)
                return ;
        }
        
        object.position.x += value;
        object.position.z -= value;
    }

    removeBulletFromRender = (bulletObj) => {
        console.log(bulletObj);
    }

    handleObjectUpMove = (object, value, checkPossibilityToMove = false, isBullet = false) => {
        if (checkPossibilityToMove) {
            if (object.position.x - value <= -20)
                return ;
            if (object.position.z - value <= -20)
                return ;
        }
        
        object.position.x -= value;
        object.position.z -= value;
    }

    handleObjectDownMove = (object, value, checkPossibilityToMove = false) => {
        if (checkPossibilityToMove) {
            if (object.position.x + value >= 20)
                return ;
            if (object.position.z + value >= 20)
                return ;
        }
        
        object.position.x += value;
        object.position.z += value;
    }

    shoot = () => {
        if (this.state.bulletsAmount.magazine <= 0)
            return ;
        
        this.setState(prevState => ({
            bulletsAmount: {
                ...prevState.bulletsAmount,
                magazine: prevState.bulletsAmount.magazine - 1,
            },
        }));
        
        const bulletGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

        const position = this.calculateBaseBulletPosition();
        
        bullet.position.set(position.x, position.y, position.z);
        const bulletObj = { bullet: bullet, direction: this.characterDirection };
        this.scene.add(bullet);
        this.bullets.push(bulletObj);
        
        const gunshot = new Audio(gunshot_sound);
        gunshot.play();
    }

    calculateBaseBulletPosition = () => {
        const characterPosition = this.character.position;
        
        if (this.characterDirection === 'UP' || this.characterDirection === 'DOWN') {
            const position = {
                x: this.characterDirection === 'UP' ? characterPosition.x + 2.2 : characterPosition.x,
                y: characterPosition.y + 3,
                z: this.characterDirection === 'DOWN' ? characterPosition.z + 2.2 : characterPosition.z
            };

            return position;
        }

        const position = {
            x: characterPosition.x,
            y: characterPosition.y + 3,
            z: characterPosition.z
        };
        return position;
        
    }

    reload = () => {        
        if (this.state.bulletsAmount.magazine >= MAX_IN_MAGAZINE)
            return ;
        
        if (this.state.bulletsAmount.all <= 0)
            return ;

        this.setState(prevState => ({
            bulletsAmount: {
                magazine: prevState.bulletsAmount.all < MAX_IN_MAGAZINE ? prevState.bulletsAmount.all : MAX_IN_MAGAZINE,
                all: prevState.bulletsAmount.all - MAX_IN_MAGAZINE > 0 ? prevState.bulletsAmount.all - MAX_IN_MAGAZINE : 0
            },
        }))
    }

    calculateZombiesLevelKilledPercentage = () => {
        const { zombiesGenerated, zombiesKilled, level } = this.state;
        const toKill = zombiesGenerated - zombiesKilled;
        const generatedInLevel = level;
        const killedInLevel = generatedInLevel - toKill;
        return killedInLevel / generatedInLevel * 100;
    }

    render() {
        const { startModalVisible, endModalVisible } = this.state;
        
        return (
            <div>
                {!startModalVisible && !endModalVisible &&
                    <>
                        <div id='bullets-info'>
                            Bullets amount: {this.state.bulletsAmount.magazine}  /  {this.state.bulletsAmount.all}
                        </div>
                        <div id='zombies-info'>
                            Zombies killed: {this.state.zombiesKilled}
                        </div>
                        <div id='level-info'>
                            <Row justify='center'>
                                Level: {this.state.level}
                            </Row>
                            <Row>
                                <Progress 
                                    percent={this.calculateZombiesLevelKilledPercentage()} 
                                    showInfo={false} 
                                    strokeColor='red'
                                />
                            </Row>
                        </div>
                    </>
                }
                <Modal 
                    visible={this.state.startModalVisible}  
                    title='Welcome to Shootlab game!'
                    footer={<Button onClick={this.startGame}>Start a game</Button>}
                    maskClosable={false}
                    closable={false}
                >
                    <Row>Moving: ↑←↓→</Row>
                    <Row>Shoot: space</Row>
                    <Row>Reload: R</Row>
                </Modal>
                <Modal 
                    visible={this.state.endModalVisible}  
                    title='Game over!'
                    footer={<Button onClick={() => window.location.reload()}>Play one more time</Button>}
                    maskClosable={false}
                    closable={false}
                >
                    <Row>Your score: {this.state.zombiesKilled}</Row>
                    <Row>Level: {this.state.level}</Row>
                    <Row>Your best score: {localStorage.getItem('bestScore')}</Row>
                </Modal>
                <div ref={ref => (this.mount = ref)} />
            </div>
        )
    }

    blinkLevelInfo = () => {
        var levelInfoDiv = document.getElementById('level-info');
        setTimeout(() => {
            if (levelInfoDiv) {
                levelInfoDiv.style.display = (levelInfoDiv.style.display === 'none' ? '' : 'none');
            }
        }, 500);
        setTimeout(() => {
            if (levelInfoDiv) {
                levelInfoDiv.style.display = (levelInfoDiv.style.display === 'none' ? '' : 'none');
            }
        }, 1000);
     }
}

export default App;