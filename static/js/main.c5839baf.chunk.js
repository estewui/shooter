(this.webpackJsonpshootlab=this.webpackJsonpshootlab||[]).push([[0],{83:function(e,t,n){},84:function(e,t,n){},89:function(e,t,n){"use strict";n.r(t);var o=n(0),i=n.n(o),r=n(23),a=n.n(r),s=(n(83),n(77)),l=n(49),c=n(3),d=n(8),u=n(5),h=n(6),m=n(13),b=n(95),p=n(93),f=n(94),v=n(45),j=n.p+"static/media/soundtrack.14a6a92a.mp3",g=n.p+"static/media/gunshot.12621986.mp3",w=n.p+"static/media/zombie_death.7bad6105.mp3",y=(n(84),n(15)),O=window.innerWidth/window.innerHeight,z=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var o;return Object(c.a)(this,n),(o=t.call(this,e)).animationId=null,o.characterDirection="UP",o.scene=new m.h,o.camera=new m.f(-20*O,20*O,20,-20,1,1e3),o.renderer=new m.i,o.character=null,o.enemies=[],o.bullets=[],o.pressedKeys={},o.soundtrack=new Audio(j),o.startGame=function(){o.setState({startModalVisible:!1}),o.camera.position.set(20,20,20),o.camera.lookAt(o.scene.position),o.renderer.setSize(window.innerWidth,window.innerHeight),o.mount.appendChild(o.renderer.domElement),o.generateBaseShapes(),o.animate(),window.addEventListener("keydown",o.onKeyDownOrUp),window.addEventListener("keyup",o.onKeyDownOrUp)},o.playSoundTrack=function(){o.soundtrack.volume=.5,o.soundtrack.play()},o.animate=function(){o.id=requestAnimationFrame(o.animate),o.state.zombiesGenerated===o.state.zombiesKilled&&o.handleNewLevel(),o.bullets.forEach((function(e){if(o.shouldRemoveObject(e.bullet))return o.bullets=o.bullets.filter((function(t){return t!==e})),o.scene.remove(e.bullet);o.handleObjectMove(e.bullet,e.direction,.2,!1)})),o.enemies.forEach((function(e){var t={x:e.position.x-o.character.position.x,z:e.position.z-o.character.position.z};o.handleEnemyMove(e,t)})),o.handleCollisions(),o.renderer.render(o.scene,o.camera)},o.shouldRemoveObject=function(e){return Math.abs(e.position.x)>20||Math.abs(e.position.z)>20},o.handleNewLevel=function(){var e=o.state.level;o.setState((function(t){return{zombiesGenerated:t.zombiesGenerated+e}})),o.blinkLevelInfo(),setTimeout((function(){return o.generateEnemies(e)}),3e3)},o.handleEnemyMove=function(e,t){return t.x<0&&t.z>0?o.handleObjectMove(e,"RIGHT",.01,!1):t.x>0&&t.z<0?o.handleObjectMove(e,"LEFT",.01,!1):t.x>0&&t.z>0?o.handleObjectMove(e,"UP",.01,!1):t.x<0&&t.z<0?o.handleObjectMove(e,"DOWN",.01,!1):void 0},o.handleCollisions=function(){o.enemies.forEach((function(e){o.bullets.forEach((function(t){o.isCharacterCollisionDetected(e,t.bullet)&&(o.scene.remove(t.bullet),o.scene.remove(e),o.bullets=o.bullets.filter((function(e){return e!==t})),o.enemies=o.enemies.filter((function(t){return t!==e})),new Audio(w).play(),o.setState((function(e){return{bulletsAmount:Object(l.a)(Object(l.a)({},e.bulletsAmount),{},{all:e.bulletsAmount.all+3}),zombiesKilled:e.zombiesKilled+1,level:e.zombiesGenerated===e.zombiesKilled+1?e.level+1:e.level}})))})),o.isCharacterCollisionDetected(e,o.character)&&o.gameOver()}))},o.gameOver=function(){cancelAnimationFrame(o.id),o.scene.remove(o.character),o.soundtrack.pause(),o.soundtrack.currentTime=0;var e=localStorage.getItem("bestScore");(!e||o.state.zombiesKilled>e)&&localStorage.setItem("bestScore",o.state.zombiesKilled),o.setState({endModalVisible:!0})},o.generateBaseShapes=function(){o.generateCharacter(),o.generatePlane()},o.generatePlane=function(){var e=new m.g(40,40),t=new m.e({color:8421504,side:m.b}),n=new m.d(e,t);n.rotation.set(Math.PI/2,0,0),o.scene.add(n)},o.generateHumanoidShape=function(e,t,n,o,i){var r=new m.a(1.3,4,2),a=new m.e({color:e}),l=new m.a(1.3,1.5,2),c=new m.e({color:t}),d=new m.a(1.3,2,.8),u=new m.e({color:n}),h=new m.a(1.3,1.2,.8),b=new m.e({color:o}),p=new m.a(1.3,.2,2),f=new m.e({color:i}),v={body:new m.d(r,a),head:new m.d(l,c),leg1:new m.d(d,u),leg2:new m.d(d,u),arm1:new m.d(h,b),arm2:new m.d(h,b),hair:new m.d(p,f)};v.body.position.set(0,4,0),v.head.position.set(0,7,0),v.hair.position.set(0,8,0),v.leg1.position.set(0,1,-.6),v.leg2.position.set(0,1,.6),v.arm1.position.set(0,4.6,1.5),v.arm2.position.set(0,4.6,-1.5);for(var j=new m.c,g=0,w=Object.entries(v);g<w.length;g++){var y=Object(s.a)(w[g],2),O=(y[0],y[1]);j.add(O)}return j},o.generateCharacter=function(){var e=o.generateHumanoidShape(16777215,15515803,0,15515803,0);o.character=e,o.scene.add(e)},o.generateEnemies=function(e){for(var t=0;t<e;++t)o.generateEnemy()},o.generateEnemy=function(){var e={x:o.getNumberOrOppositeRandomly(10*Math.random()+10),y:2,z:o.getNumberOrOppositeRandomly(10*Math.random()+10)},t=o.generateHumanoidShape(16711680,16711680,0,16711680,0);t.position.set(e.x,e.y,e.z),o.enemies.push(t),o.scene.add(t)},o.getNumberOrOppositeRandomly=function(e){return 0===Math.round(Math.random())?e:-e},o.handleObjectMove=function(e,t,n){var i=!(arguments.length>3&&void 0!==arguments[3])||arguments[3];return"LEFT"===t?o.handleObjectLeftMove(e,n,i):"RIGHT"===t?o.handleObjectRightMove(e,n,i):"UP"===t?o.handleObjectUpMove(e,n,i):"DOWN"===t?o.handleObjectDownMove(e,n,i):void 0},o.onKeyDownOrUp=function(e){if(o.pressedKeys[e.key]="keydown"===e.type,o.playSoundTrack(),o.pressedKeys.ArrowLeft&&o.pressedKeys.ArrowDown)return o.handleObjectMove(o.character,"LEFT",.2),void o.handleObjectMove(o.character,"DOWN",.2);if(o.pressedKeys.ArrowLeft&&o.pressedKeys.ArrowUp)return o.handleObjectMove(o.character,"LEFT",.2),void o.handleObjectMove(o.character,"UP",.2);if(o.pressedKeys.ArrowRight&&o.pressedKeys.ArrowUp)return o.handleObjectMove(o.character,"RIGHT",.2),void o.handleObjectMove(o.character,"UP",.2);if(o.pressedKeys.ArrowRight&&o.pressedKeys.ArrowDown)return o.handleObjectMove(o.character,"RIGHT",.2),void o.handleObjectMove(o.character,"DOWN",.2);if(o.pressedKeys.ArrowLeft){if(o.checkIfNewDirectionAndChange("LEFT"))return;o.handleObjectMove(o.character,"LEFT",.2)}if(o.pressedKeys.ArrowRight){if(o.checkIfNewDirectionAndChange("RIGHT"))return;o.handleObjectMove(o.character,"RIGHT",.2)}if(o.pressedKeys.ArrowUp){if(o.checkIfNewDirectionAndChange("UP"))return;o.handleObjectMove(o.character,"UP",.2)}if(o.pressedKeys.ArrowDown){if(o.checkIfNewDirectionAndChange("DOWN"))return;o.handleObjectMove(o.character,"DOWN",.2)}o.pressedKeys[" "]&&o.shoot(),o.pressedKeys.r&&o.reload()},o.checkIfNewDirectionAndChange=function(e){return o.characterDirection!==e&&(o.characterDirection=e,"LEFT"===e&&(o.character.rotation.y=Math.PI/4),"UP"===e&&(o.character.rotation.y=3*Math.PI/4),"RIGHT"===e&&(o.character.rotation.y=5*Math.PI/4),"DOWN"===e&&(o.character.rotation.y=7*Math.PI/4),!0)},o.handleObjectLeftMove=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(n){if(e.position.x-t<=-20)return;if(e.position.z+t>=20)return}e.position.x-=t,e.position.z+=t},o.handleObjectRightMove=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(n){if(e.position.x+t>=20)return;if(e.position.z-t<=-20)return}e.position.x+=t,e.position.z-=t},o.removeBulletFromRender=function(e){console.log(e)},o.handleObjectUpMove=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(n){if(e.position.x-t<=-20)return;if(e.position.z-t<=-20)return}e.position.x-=t,e.position.z-=t},o.handleObjectDownMove=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(n){if(e.position.x+t>=20)return;if(e.position.z+t>=20)return}e.position.x+=t,e.position.z+=t},o.shoot=function(){if(!(o.state.bulletsAmount.magazine<=0)){o.setState((function(e){return{bulletsAmount:Object(l.a)(Object(l.a)({},e.bulletsAmount),{},{magazine:e.bulletsAmount.magazine-1})}}));var e=new m.a(.4,.4,.4),t=new m.e({color:16777215}),n=new m.d(e,t),i=o.calculateBaseBulletPosition();n.position.set(i.x,i.y,i.z);var r={bullet:n,direction:o.characterDirection};o.scene.add(n),o.bullets.push(r),new Audio(g).play()}},o.calculateBaseBulletPosition=function(){var e=o.character.position;return"UP"===o.characterDirection||"DOWN"===o.characterDirection?{x:"UP"===o.characterDirection?e.x+2.2:e.x,y:e.y+3,z:"DOWN"===o.characterDirection?e.z+2.2:e.z}:{x:e.x,y:e.y+3,z:e.z}},o.reload=function(){o.state.bulletsAmount.magazine>=8||o.state.bulletsAmount.all<=0||o.setState((function(e){return{bulletsAmount:{magazine:e.bulletsAmount.all<8?e.bulletsAmount.all:8,all:e.bulletsAmount.all-8>0?e.bulletsAmount.all-8:0}}}))},o.calculateZombiesLevelKilledPercentage=function(){var e=o.state,t=e.zombiesGenerated,n=e.zombiesKilled,i=e.level;return(i-(t-n))/i*100},o.blinkLevelInfo=function(){var e=document.getElementById("level-info");setTimeout((function(){e&&(e.style.display="none"===e.style.display?"":"none")}),500),setTimeout((function(){e&&(e.style.display="none"===e.style.display?"":"none")}),1e3)},o.state={startModalVisible:!0,endModalVisible:!1,level:1,bulletsAmount:{magazine:8,all:24},zombiesGenerated:0,zombiesKilled:0},o}return Object(d.a)(n,[{key:"isCharacterCollisionDetected",value:function(e,t){var n=t.geometry?t:t.children[0],o=t.position.y-n.geometry.parameters.height/2,i=t.position.y+n.geometry.parameters.height/2,r=t.position.x+n.geometry.parameters.width/2,a=t.position.x-n.geometry.parameters.width/2,s=t.position.z-n.geometry.parameters.depth/2,l=t.position.z+n.geometry.parameters.depth/2,c=e.position.y-e.children[0].geometry.parameters.height/2,d=e.position.y+e.children[0].geometry.parameters.height/2,u=e.position.x+e.children[0].geometry.parameters.width/2,h=e.position.x-e.children[0].geometry.parameters.width/2,m=e.position.z-e.children[0].geometry.parameters.depth/2,b=e.position.z+e.children[0].geometry.parameters.depth/2;return!(i<c||r<h||o>d||a>u||s>b||l<m)}},{key:"render",value:function(){var e=this,t=this.state,n=t.startModalVisible,o=t.endModalVisible;return Object(y.jsxs)("div",{children:[!n&&!o&&Object(y.jsxs)(y.Fragment,{children:[Object(y.jsxs)("div",{id:"bullets-info",children:["Bullets amount: ",this.state.bulletsAmount.magazine,"  /  ",this.state.bulletsAmount.all]}),Object(y.jsxs)("div",{id:"zombies-info",children:["Zombies killed: ",this.state.zombiesKilled]}),Object(y.jsxs)("div",{id:"level-info",children:[Object(y.jsxs)(b.a,{justify:"center",children:["Level: ",this.state.level]}),Object(y.jsx)(b.a,{children:Object(y.jsx)(p.a,{percent:this.calculateZombiesLevelKilledPercentage(),showInfo:!1,strokeColor:"red"})})]})]}),Object(y.jsxs)(f.a,{visible:this.state.startModalVisible,title:"Welcome to Shootlab game!",footer:Object(y.jsx)(v.a,{onClick:this.startGame,children:"Start a game"}),maskClosable:!1,closable:!1,children:[Object(y.jsx)(b.a,{children:"Moving: \u2191\u2190\u2193\u2192"}),Object(y.jsx)(b.a,{children:"Shoot: space"}),Object(y.jsx)(b.a,{children:"Reload: R"})]}),Object(y.jsxs)(f.a,{visible:this.state.endModalVisible,title:"Game over!",footer:Object(y.jsx)(v.a,{onClick:function(){return window.location.reload()},children:"Play one more time"}),maskClosable:!1,closable:!1,children:[Object(y.jsxs)(b.a,{children:["Your score: ",this.state.zombiesKilled]}),Object(y.jsxs)(b.a,{children:["Level: ",this.state.level]}),Object(y.jsxs)(b.a,{children:["Your best score: ",localStorage.getItem("bestScore")]})]}),Object(y.jsx)("div",{ref:function(t){return e.mount=t}})]})}}]),n}(o.Component);a.a.render(Object(y.jsx)(i.a.StrictMode,{children:Object(y.jsx)(z,{})}),document.getElementById("root"))}},[[89,1,2]]]);
//# sourceMappingURL=main.c5839baf.chunk.js.map