(function(){"use strict";var e={9777:function(e,t,o){var n=o(5130),i=o(6768);const r={id:"app"};function s(e,t,o,n,s,a){const d=(0,i.g2)("DroneControl");return(0,i.uX)(),(0,i.CE)("div",r,[(0,i.bF)(d)])}var a=o(4232);const d=(0,i.Lk)("h1",null,"Drone Control and Navigation",-1),l={class:"sidebar"},c=(0,i.Lk)("h2",null,"Drones",-1),h=["onClick"],u={key:0},p=(0,i.Lk)("h2",null,"Mapa Geral",-1),f={ref:"generalMap",style:{width:"100%",height:"400px"}},g=(0,i.Lk)("h2",null,"Informação dos Drones",-1),k={key:0,class:"no-drones-message"},m=(0,i.Lk)("p",null,"No drones connected.",-1),v=[m],D={key:1},y={key:1},b=(0,i.Lk)("h2",null,"Drone Info",-1),w={class:"drone-controls"},M={ref:"map",style:{width:"50%",height:"400px",float:"left"}},L={style:{width:"50%",height:"400px",float:"left"}},C=(0,i.Lk)("h2",null,"Drone Camera",-1),I={ref:"video",autoplay:"",playsinline:"",style:{width:"100%",height:"100%"}},E=["value"],A=["disabled"];function _(e,t,o,r,s,m){return(0,i.uX)(),(0,i.CE)("div",null,[d,(0,i.Lk)("div",l,[c,(0,i.Lk)("ul",null,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(s.drones,(e=>((0,i.uX)(),(0,i.CE)("li",{key:e.id,onClick:t=>m.selectDrone(e.id)},(0,a.v_)(e.id)+" ("+(0,a.v_)(e.address)+":"+(0,a.v_)(e.port)+") ",9,h)))),128))]),(0,i.Lk)("button",{onClick:t[0]||(t[0]=(...e)=>m.addDrone&&m.addDrone(...e))},"Add Drone"),(0,i.Lk)("button",{onClick:t[1]||(t[1]=(...e)=>m.showGeneralView&&m.showGeneralView(...e))},"Go to General Map and Info")]),"general"===s.viewMode?((0,i.uX)(),(0,i.CE)("div",u,[p,(0,i.Lk)("div",f,null,512),g,m.anyDroneConnected?((0,i.uX)(),(0,i.CE)("div",D,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(s.drones,(e=>((0,i.uX)(),(0,i.CE)("div",{key:e.id,class:"drone-info"},[(0,i.Lk)("h3",null,"Drone "+(0,a.v_)(e.id),1),(0,i.Lk)("p",null,"Altitude: "+(0,a.v_)(s.droneInfoMap.get(e.id)?.alt||0)+" m",1),(0,i.Lk)("p",null,"Longitude: "+(0,a.v_)(s.droneInfoMap.get(e.id)?.lon||0)+"°",1),(0,i.Lk)("p",null,"Latitude: "+(0,a.v_)(s.droneInfoMap.get(e.id)?.lat||0)+"°",1),(0,i.Lk)("p",null,"Mode: "+(0,a.v_)(s.droneInfoMap.get(e.id)?.mode||"Unknown"),1),(0,i.Lk)("p",null,"Armado: "+(0,a.v_)(s.droneInfoMap.get(e.id)?.armed?"Sim":"Não"),1),(0,i.Lk)("p",null,"Tempo de Voo: "+(0,a.v_)(s.droneInfoMap.get(e.id)?.flight_time||""),1),(0,i.Lk)("p",null,"Bateria: "+(0,a.v_)(s.droneInfoMap.get(e.id)?.battery||0)+"%",1),(0,i.Lk)("p",null,"Heading: "+(0,a.v_)(s.droneInfoMap.get(e.id)?.heading||0)+"°",1)])))),128))])):((0,i.uX)(),(0,i.CE)("div",k,v))])):(0,i.Q3)("",!0),"drone"===s.viewMode&&null!==s.selectedDrone?((0,i.uX)(),(0,i.CE)("div",y,[(0,i.Lk)("h2",null,"Connect to Drone "+(0,a.v_)(s.selectedDrone),1),(0,i.Lk)("button",{onClick:t[2]||(t[2]=(...e)=>m.connect&&m.connect(...e))},"Connect"),(0,i.bo)((0,i.Lk)("input",{"onUpdate:modelValue":t[3]||(t[3]=e=>s.takeoffAltitudeInput=e),placeholder:"Altitude de Decolagem",onInput:t[4]||(t[4]=(...e)=>m.validateTakeoffAltitude&&m.validateTakeoffAltitude(...e))},null,544),[[n.Jo,s.takeoffAltitudeInput]]),(0,i.Lk)("button",{onClick:t[5]||(t[5]=(...e)=>m.takeOff&&m.takeOff(...e))},"Take Off"),(0,i.Lk)("button",{onClick:t[6]||(t[6]=(...e)=>m.land&&m.land(...e))},"Land"),(0,i.Lk)("div",null,[(0,i.Lk)("button",{onClick:t[7]||(t[7]=e=>m.changeAltitude(1))},"Increase Altitude"),(0,i.Lk)("button",{onClick:t[8]||(t[8]=e=>m.changeAltitude(-1))},"Decrease Altitude")]),(0,i.Lk)("div",null,[(0,i.Lk)("button",{onClick:t[9]||(t[9]=e=>m.sendCommand("forward"))},"Forward"),(0,i.Lk)("button",{onClick:t[10]||(t[10]=e=>m.sendCommand("backward"))},"Backward"),(0,i.Lk)("button",{onClick:t[11]||(t[11]=e=>m.sendCommand("left"))},"Left"),(0,i.Lk)("button",{onClick:t[12]||(t[12]=e=>m.sendCommand("right"))},"Right")]),(0,i.Lk)("div",null,[(0,i.Lk)("button",{onClick:t[13]||(t[13]=(...e)=>m.goHome&&m.goHome(...e))},"Go Home")]),(0,i.Lk)("div",null,[b,(0,i.Lk)("p",null,"Altitude: "+(0,a.v_)(s.droneInfoMap.get(s.selectedDrone)?.alt||0)+" m",1),(0,i.Lk)("p",null,"Longitude: "+(0,a.v_)(s.droneInfoMap.get(s.selectedDrone)?.lon||0)+"°",1),(0,i.Lk)("p",null,"Latitude: "+(0,a.v_)(s.droneInfoMap.get(s.selectedDrone)?.lat||0)+"°",1),(0,i.Lk)("p",null,"Mode: "+(0,a.v_)(s.droneInfoMap.get(s.selectedDrone)?.mode||"Unknown"),1),(0,i.Lk)("p",null,"Armado: "+(0,a.v_)(s.droneInfoMap.get(s.selectedDrone)?.armed?"Sim":"Não"),1),(0,i.Lk)("p",null,"Tempo de Voo: "+(0,a.v_)(s.droneInfoMap.get(s.selectedDrone)?.flight_time||""),1),(0,i.Lk)("p",null,"Bateria: "+(0,a.v_)(s.droneInfoMap.get(s.selectedDrone)?.battery||0)+"%",1),(0,i.Lk)("p",null,"Heading: "+(0,a.v_)(s.droneInfoMap.get(s.selectedDrone)?.heading||0)+"°",1)]),(0,i.Lk)("div",w,[(0,i.Lk)("div",M,null,512),(0,i.Lk)("div",L,[C,(0,i.Lk)("video",I,null,512),(0,i.Lk)("div",null,[(0,i.bo)((0,i.Lk)("select",{"onUpdate:modelValue":t[14]||(t[14]=e=>s.selectedDeviceId=e)},[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(s.videoDevices,(e=>((0,i.uX)(),(0,i.CE)("option",{value:e.deviceId,key:e.deviceId},(0,a.v_)(e.label),9,E)))),128))],512),[[n.u1,s.selectedDeviceId]]),(0,i.Lk)("button",{onClick:t[15]||(t[15]=(...e)=>m.startVideo&&m.startVideo(...e))},"Start Video")])])]),(0,i.Lk)("div",null,[(0,i.Lk)("button",{onClick:t[16]||(t[16]=(...e)=>m.clearRoute&&m.clearRoute(...e))},"Clear Route"),(0,i.Lk)("button",{onClick:t[17]||(t[17]=(...e)=>m.goToWaypoint&&m.goToWaypoint(...e)),disabled:!m.hasWaypoints},"Go to Waypoint",8,A)])])):(0,i.Q3)("",!0)])}o(4114),o(3375),o(9225),o(3972),o(9209),o(5714),o(7561),o(6197);var W=o(7910),S={data(){return{drones:[],selectedDrone:null,socket:null,map:null,generalMap:null,markers:new Map,takeoffAltitude:3,takeoffAltitudeInput:"",viewMode:"general",droneInfoMap:new Map,droneWaypoints:new Map,videoStream:null,selectedDeviceId:null,videoDevices:[],initialPositions:new Map,batteryWarning20:new Set,batteryWarning10:new Set,batteryWarningZero:new Set}},computed:{hasWaypoints(){return this.droneWaypoints.has(this.selectedDrone)&&this.droneWaypoints.get(this.selectedDrone).length>0},anyDroneConnected(){return this.drones.some((e=>this.droneInfoMap.has(e.id)))}},methods:{loadGoogleMaps(){return new Promise(((e,t)=>{if("undefined"!==typeof google&&google.maps)return void e();const o=document.createElement("script");o.src="https://maps.googleapis.com/maps/api/js?key=AIzaSyACfUVHlE0cjTUKLBgVPAY0bLguBkxG1rg&libraries=places,directions",o.async=!0,o.defer=!0,o.onload=e,o.onerror=t,document.head.appendChild(o)}))},addDrone(){const e=prompt("Enter drone ID:"),t=prompt("Enter drone address:"),o=prompt("Enter drone port:");if(e&&t&&o){const n=this.drones.some((t=>t.id===e));if(n)return void alert("Error: A drone with this ID already exists.");const i=this.drones.some((e=>e.address===t&&e.port===o));if(i)return void alert("Error: A drone with this address and port already exists.");this.drones.push({id:e,address:t,port:o}),this.droneInfoMap.set(e,{mode:"Unknown",armed:!1,lat:-35.3632626,lon:149.1652378,alt:0,flight_time:"",battery:100,heading:0}),this.generalMap&&this.updateGeneralMapMarker(e,-35.3632626,149.1652378)}},selectDrone(e){this.selectedDrone=e,this.viewMode="drone",(0,i.dY)((()=>{this.initializeMap(),this.renderRoute(),this.getVideoDevices()}))},showGeneralView(){this.selectedDrone=null,this.viewMode="general",(0,i.dY)((()=>{this.initializeGeneralMap()}))},connect(){const e=this.drones.find((e=>e.id===this.selectedDrone));e?(this.socket=(0,W.Ay)("http://localhost:5000"),this.socket.emit("set_connection",{id:e.id,address:e.address,port:e.port}),this.socket.on("response",(e=>{console.log("Server response:",e.message)})),this.socket.on("connect",(()=>{console.log("Connected to Flask-SocketIO server!")})),this.socket.on("disconnect",(()=>{console.log("Disconnected from Flask-SocketIO server")})),this.socket.on("drone_data",(e=>{console.log(`Data received for Drone ${e.id}:`,e),this.droneInfoMap.set(e.id,e),this.initialPositions.has(e.id)||this.initialPositions.set(e.id,{lat:e.lat,lon:e.lon}),e.id===this.selectedDrone&&this.updateMarker(),this.updateGeneralMapMarker(e.id,e.lat,e.lon),this.checkBatteryLevel(e.id,e.battery)}))):console.error("Selected drone not found")},takeOff(){this.isDroneConnected()?this.isValidAltitude(this.takeoffAltitudeInput)?(this.takeoffAltitude=parseFloat(this.takeoffAltitudeInput.replace(",",".")),this.socket.emit("takeoff",{id:this.selectedDrone,altitude:this.takeoffAltitude}),console.log(`Takeoff command sent with altitude ${this.takeoffAltitude}`)):this.showError("Please enter a valid altitude."):this.showError("The drone must be connected first.")},land(){this.isDroneConnected()?(this.socket.emit("land",{id:this.selectedDrone}),console.log("Land command sent")):this.showError("The drone must be connected first.")},changeAltitude(e){if(!this.isDroneConnected())return void this.showError("The drone must be connected first.");if(!this.isDroneReady())return void this.showError("The drone must be armed and in GUIDED mode to change altitude.");let t=e>0?"move_up":"move_down";this.socket.emit(t,{id:this.selectedDrone,duration:2}),console.log("Change altitude command sent: "+(e>0?"up":"down"))},sendCommand(e){if(!this.isDroneConnected())return void this.showError("The drone must be connected first.");if(!this.isDroneReady())return void this.showError("The drone must be armed and in GUIDED mode to move.");let t="";switch(e){case"forward":t="move_forward";break;case"backward":t="move_backward";break;case"left":t="move_left";break;case"right":t="move_right";break}t?(this.socket.emit(t,{id:this.selectedDrone}),console.log(`Command sent: ${e}`)):console.error("Invalid direction")},goHome(){if(!this.isDroneConnected())return void this.showError("The drone must be connected first.");if(!this.isDroneReady())return void this.showError("The drone must be armed and in GUIDED mode to go home.");const e=this.initialPositions.get(this.selectedDrone);e&&this.socket?(this.socket.emit("go_home",{id:this.selectedDrone,...e}),console.log(`Go Home command sent for drone ${this.selectedDrone} to position`,e)):console.error("Home position not set or socket not connected")},initializeMap(){this.loadGoogleMaps().then((()=>{const e={center:{lat:this.droneInfoMap.get(this.selectedDrone).lat,lng:this.droneInfoMap.get(this.selectedDrone).lon},zoom:15,mapTypeId:"terrain"};this.map=new google.maps.Map(this.$refs.map,e),console.log("Map initialized:",this.map),this.marker=new google.maps.Marker({position:{lat:this.droneInfoMap.get(this.selectedDrone).lat,lng:this.droneInfoMap.get(this.selectedDrone).lon},map:this.map,title:"Drone Position",icon:{url:o(5846),scaledSize:new google.maps.Size(50,50)},draggable:!1}),this.map.addListener("click",(e=>{this.addRoutePoint(e.latLng)})),this.renderRoute()})).catch((e=>{console.error("Failed to load Google Maps:",e)}))},initializeGeneralMap(){this.loadGoogleMaps().then((()=>{const e={center:{lat:-35.3632626,lng:149.1652378},zoom:10,mapTypeId:"terrain"};this.generalMap=new google.maps.Map(this.$refs.generalMap,e),console.log("General Map initialized:",this.generalMap),this.drones.forEach((e=>{const t=this.droneInfoMap.get(e.id);t&&this.updateGeneralMapMarker(e.id,t.lat,t.lon)}))})).catch((e=>{console.error("Failed to load Google Maps:",e)}))},updateMarker(){if(this.marker&&this.map){const e={lat:this.droneInfoMap.get(this.selectedDrone).lat,lng:this.droneInfoMap.get(this.selectedDrone).lon};this.marker.setPosition(e),this.map.setCenter(e),console.log("Marker updated to position:",e)}},updateGeneralMapMarker(e,t,n){if(console.log(`Updating marker for Drone ${e} to position (${t}, ${n})`),this.generalMap){let i=this.markers.get(e);i?(i.setMap(this.generalMap),i.setPosition({lat:t,lng:n}),console.log(`Marker updated for Drone ${e} to (${t}, ${n})`)):(i=new google.maps.Marker({position:{lat:t,lng:n},map:this.generalMap,title:`Drone ${e}`,icon:{url:o(5846),scaledSize:new google.maps.Size(30,30)},draggable:!1}),this.markers.set(e,i),console.log(`Marker created for Drone ${e} at (${t}, ${n})`))}else console.error("General map not initialized.")},addRoutePoint(e){const t=this.selectedDrone;this.droneWaypoints.has(t)||this.droneWaypoints.set(t,[]);const o=new google.maps.Marker({position:e,map:this.map,title:"Route Point",icon:{path:google.maps.SymbolPath.CIRCLE,fillColor:"blue",fillOpacity:.8,scale:6,strokeColor:"white",strokeWeight:2},draggable:!0});this.droneWaypoints.get(t).push({marker:o,latLng:e,alt:this.takeoffAltitude}),console.log("Route point added:",e)},renderRoute(){const e=this.selectedDrone;this.map&&(this.droneWaypoints.forEach((e=>{e.forEach((e=>{e.marker.setMap(null)}))})),this.droneWaypoints.has(e)&&this.droneWaypoints.get(e).forEach((e=>{e.marker.setMap(this.map)})))},clearRoute(){const e=this.selectedDrone;this.droneWaypoints.has(e)&&(this.droneWaypoints.get(e).forEach((e=>{e.marker&&e.marker.setMap(null)})),this.droneWaypoints.set(e,[]),console.log("Route cleared for drone:",e),this.initializeMap())},goToWaypoint(){if(!this.isDroneConnected())return void this.showError("The drone must be connected first.");if(!this.isDroneReady())return void this.showError("The drone must be armed and in GUIDED mode to go to waypoints.");const e=this.selectedDrone;if(this.droneWaypoints.has(e)&&this.droneWaypoints.get(e).length>0){const t=this.droneWaypoints.get(e).map((e=>({lat:e.latLng.lat(),lng:e.latLng.lng(),alt:e.alt})));console.log("Sending route to backend:",t),this.socket.emit("start_route",{id:this.selectedDrone,waypoints:t}),console.log("Route command sent with waypoints:",t)}else console.error("No route defined for drone:",e)},checkBatteryLevel(e,t){t<=20&&!this.batteryWarning20.has(e)&&(this.showError(`Warning: Drone ${e} battery is at ${t}%.`),this.batteryWarning20.add(e)),t<=10&&!this.batteryWarning10.has(e)&&(this.showError(`Critical Warning: Drone ${e} battery is at ${t}%.`),this.batteryWarning10.add(e)),t<=0&&!this.batteryWarningZero.has(e)&&(this.showError(`Emergency: Drone ${e} battery is depleted. Landing immediately.`),this.batteryWarningZero.add(e),this.socket.emit("land",{id:e}))},async getVideoDevices(){try{const e=await navigator.mediaDevices.enumerateDevices();if(this.videoDevices=e.filter((e=>"videoinput"===e.kind)),this.videoDevices.length>0){const e=this.videoDevices.find((e=>e.label.includes("DroidCam")||e.deviceId.includes("/dev/video0")));e?this.selectedDeviceId=e.deviceId:console.error("DroidCam device not found.")}else console.error("No video input devices found.")}catch(e){console.error("Error accessing media devices.",e)}},async startVideo(){try{if(this.selectedDeviceId){const e={video:{deviceId:{exact:this.selectedDeviceId}}};this.videoStream=await navigator.mediaDevices.getUserMedia(e),this.$refs.video.srcObject=this.videoStream}else console.error("No video device selected.")}catch(e){console.error("Error accessing media devices.",e)}},showError(e){alert(e)},isDroneConnected(){return this.socket&&this.socket.connected},isDroneReady(){const e=this.droneInfoMap.get(this.selectedDrone);return e&&e.armed&&"GUIDED"===e.mode},isValidAltitude(e){return/^-?\d+([,.]\d+)?$/.test(e)},validateTakeoffAltitude(){const e=this.takeoffAltitudeInput;this.isValidAltitude(e)||(this.takeoffAltitudeInput=e.replace(/[^0-9,.]/g,""))},onKeydown(e){switch(["Space","ArrowUp","ArrowDown"].indexOf(e.code)>-1&&e.preventDefault(),e.code){case"Space":console.log("takeoff"),this.takeOff();break;case"ControlLeft":console.log("CTRL Land"),this.land();break;case"ArrowUp":console.log("up"),this.changeAltitude(1);break;case"ArrowDown":console.log("Down"),this.changeAltitude(-1);break;case"KeyA":console.log("left"),this.sendCommand("left");break;case"KeyD":this.sendCommand("right"),console.log("Right");break;case"KeyS":this.sendCommand("backward"),console.log("back");break;case"KeyW":console.log("forward"),this.sendCommand("forward");break;default:break}}},mounted(){"general"===this.viewMode&&(0,i.dY)((()=>{this.initializeGeneralMap()})),document.addEventListener("keydown",this.onKeydown)},beforeUnmount(){this.videoStream&&this.videoStream.getTracks().forEach((e=>e.stop())),this.drones.forEach((e=>{this.droneWaypoints.has(e.id)&&this.droneWaypoints.get(e.id).forEach((e=>{e.marker&&e.marker.setMap(null)}))})),document.removeEventListener("keydown",this.onKeydown)}},G=o(1241);const T=(0,G.A)(S,[["render",_]]);var O=T,$={components:{DroneControl:O}};const R=(0,G.A)($,[["render",s]]);var P=R;const V=(0,n.Ef)(P);V.mount("#app")},5846:function(e,t,o){e.exports=o.p+"img/droneMarker.4df4337e.png"}},t={};function o(n){var i=t[n];if(void 0!==i)return i.exports;var r=t[n]={exports:{}};return e[n].call(r.exports,r,r.exports,o),r.exports}o.m=e,function(){var e=[];o.O=function(t,n,i,r){if(!n){var s=1/0;for(c=0;c<e.length;c++){n=e[c][0],i=e[c][1],r=e[c][2];for(var a=!0,d=0;d<n.length;d++)(!1&r||s>=r)&&Object.keys(o.O).every((function(e){return o.O[e](n[d])}))?n.splice(d--,1):(a=!1,r<s&&(s=r));if(a){e.splice(c--,1);var l=i();void 0!==l&&(t=l)}}return t}r=r||0;for(var c=e.length;c>0&&e[c-1][2]>r;c--)e[c]=e[c-1];e[c]=[n,i,r]}}(),function(){o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,{a:t}),t}}(),function(){o.d=function(e,t){for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){o.p="/"}(),function(){var e={524:0};o.O.j=function(t){return 0===e[t]};var t=function(t,n){var i,r,s=n[0],a=n[1],d=n[2],l=0;if(s.some((function(t){return 0!==e[t]}))){for(i in a)o.o(a,i)&&(o.m[i]=a[i]);if(d)var c=d(o)}for(t&&t(n);l<s.length;l++)r=s[l],o.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return o.O(c)},n=self["webpackChunkdronefly1"]=self["webpackChunkdronefly1"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=o.O(void 0,[504],(function(){return o(9777)}));n=o.O(n)})();
//# sourceMappingURL=app.9cf44405.js.map