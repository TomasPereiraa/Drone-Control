<template>
  <div>
    <h1>Intelligent Cloud Based Control Station For Drones</h1>
    <!-- Sidebar to manage drones -->
    <div class="sidebar">
      <h2>Drones</h2>
      <ul>
        <li v-for="drone in drones" :key="drone.id">
          {{ drone.id }} ({{ drone.address }}:{{ drone.port }})
          <button @click="removeDrone(drone.id)">Remove</button> 
          <button @click="selectDrone(drone.id)">Select</button>
        </li>
      </ul>
      <button @click="addDrone">Add Drone</button>
      <button @click="showGeneralView">Go to General Map and Info</button>
    </div>
    <div v-if="viewMode === 'general'" class="main-content">
      <h2 class="center-text">General Map</h2>
      <div ref="generalMap" class="map full-width"></div>
      <h3 class="center-text">Drone Information</h3>
      <div v-if="!anyDroneConnected" class="no-drones-message">
        <p>No drones connected.</p>
      </div>
      <div v-else class="drones-container">
        <div v-for="drone in drones" :key="drone.id" class="drone-info">
          <h3>Drone {{ drone.id }}</h3>
          <p>Altitude: {{ droneInfoMap.get(drone.id)?.alt || 0 }} m</p>
          <p>Longitude: {{ droneInfoMap.get(drone.id)?.lon || 0 }}°</p>
          <p>Latitude: {{ droneInfoMap.get(drone.id)?.lat || 0 }}°</p>
          <p>Mode: {{ droneInfoMap.get(drone.id)?.mode || 'Unknown' }}</p>
          <p>Armed: {{ droneInfoMap.get(drone.id)?.armed ? 'Yes' : 'No' }}</p>
          <p>Flight Time: {{ droneInfoMap.get(drone.id)?.flight_time || '' }}</p>
          <p>Battery: {{ droneInfoMap.get(drone.id)?.battery || 0 }}%</p>
          <p>Heading: {{ droneInfoMap.get(drone.id)?.heading || 0 }}°</p>
        </div>
      </div>
    </div>
    <div v-if="viewMode === 'drone' && selectedDrone !== null" class="drone-view">
      <!-- Top Section: Map and Camera -->
      <div class="top-section">
        <div class="map-container">
          <div ref="map" class="map"></div>
          <div class="centered-buttons">
            <button @click="clearRoute">Clear Route</button>
            <button @click="goToWaypoint" :disabled="!hasWaypoints">Go to Waypoint</button>
          </div>
        </div>
        <div class="drone-camera">
          <video ref="video" autoplay playsinline class="video"></video>
          <div class="camera-controls">
            <select v-model="selectedDeviceId">
              <option v-for="device in videoDevices" :value="device.deviceId" :key="device.deviceId">
                {{ device.label }}
              </option>
            </select>
            <button @click="startVideo">Start Video</button>
          </div>
        </div>
      </div>
      <!-- Bottom Section: Controls -->
      <div class="bottom-section">
        <div class="flight-controls">
          <div class="takeoff-land-controls">
            <button @click="connect">Connect</button>
            <input v-model="takeoffAltitudeInput" placeholder="Takeoff Altitude" @input="validateTakeoffAltitude" />
            <button @click="takeOff">Take Off</button>
            <button @click="land">Land</button>
            <button @click="goHome">Go Home</button>
          </div>

          <div class="movement-controls">
            <button @click="sendCommand('left')">Left</button>
            <div class="horizontal-controls">
              <button @click="sendCommand('forward')">Forward</button>
              <button @click="sendCommand('backward')">Backward</button>
            </div>
            <button @click="sendCommand('right')">Right</button>
            <div class="vertical-controls">
              <button @click="changeAltitude(1)">Increase Altitude</button>
              <button @click="changeAltitude(-1)">Decrease Altitude</button>
            </div>
          </div>
        </div>
        <div class="drone-info-panel">
          <h2>Drone {{ selectedDrone }} Info</h2>
          <p>Altitude: {{ droneInfoMap.get(selectedDrone)?.alt || 0 }} m</p>
          <p>Longitude: {{ droneInfoMap.get(selectedDrone)?.lon || 0 }}°</p>
          <p>Latitude: {{ droneInfoMap.get(selectedDrone)?.lat || 0 }}°</p>
          <p>Mode: {{ droneInfoMap.get(selectedDrone)?.mode || 'Unknown' }}</p>
          <p>Armed: {{ droneInfoMap.get(selectedDrone)?.armed ? 'Yes' : 'No' }}</p>
          <p>Flight Time: {{ droneInfoMap.get(selectedDrone)?.flight_time || '' }}</p>
          <p>Battery: {{ droneInfoMap.get(selectedDrone)?.battery || 0 }}%</p>
          <p>Heading: {{ droneInfoMap.get(selectedDrone)?.heading || 0 }}°</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* global google */
import { nextTick } from 'vue';
import io from 'socket.io-client';

export default {
  data() {
    return {
      drones: [], 
      selectedDrone: null, 
      socket: null,
      map: null,
      generalMap: null,
      markers: new Map(), 
      takeoffAltitude: 3, 
      takeoffAltitudeInput: '', 
      viewMode: 'general', 
      droneInfoMap: new Map(), 
      droneWaypoints: new Map(), 
      videoStream: null, 
      selectedDeviceId: null, 
      videoDevices: [],
      initialPositions: new Map(),
      batteryWarning20: new Set(),
      batteryWarning10: new Set(),
      batteryWarningZero: new Set() 
    };
  },
  computed: {
    hasWaypoints() {
      return this.droneWaypoints.has(this.selectedDrone) && this.droneWaypoints.get(this.selectedDrone).length > 0;
    },
    anyDroneConnected() {
      return this.drones.some(drone => this.droneInfoMap.has(drone.id));
    }
  },
  methods: {
    loadGoogleMaps() {
      return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=API_KEY&libraries=places,directions';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
    addDrone() {
      const id = prompt("Enter drone ID:");
      const address = prompt("Enter drone address (IP):");
      const port = prompt("Enter drone port:");

      if (id && address && port) {
        // Validate IP address and port
        if (!this.validateIpAddress(address)) {
          alert("Error: Invalid IP address.");
          return;
        }

        if (!this.validatePort(port)) {
          alert("Error: Invalid port number.");
          return;
        }

        // Check for duplicate ID
        const duplicateId = this.drones.some(drone => drone.id === id);
        if (duplicateId) {
          alert("Error: A drone with this ID already exists.");
          return;
        }

        // Check for duplicate address and port
        const duplicateAddressPort = this.drones.some(drone => drone.address === address && drone.port === port);
        if (duplicateAddressPort) {
          alert("Error: A drone with this address and port already exists.");
          return;
        }

        // Add the new drone if no duplicates are found
        this.drones.push({ id, address, port });
        this.droneInfoMap.set(id, {
          mode: 'Unknown',
          armed: false,
          lat: -35.3632626, 
          lon: 149.1652378, 
          alt: 0,
          flight_time: '',
          battery: 100,
          heading: 0
        });

        if (this.generalMap) {
          this.updateGeneralMapMarker(id, -35.3632626, 149.1652378);
        }

        this.checkConnection(id, address, port);
      }
    },
    checkConnection(id, address, port) {
      this.socket = io('http://localhost:5000');
      this.socket.emit('set_connection', {
        id: id,
        address: address,
        port: port
      });

      this.socket.on('connection_status', (data) => {
        if (data.status === 'failed') {
          this.removeDrone(id);
          alert(`Error: ${data.error}`);
        } else {
          console.log('Connection successful:', data);
        }
      });
    },
    removeDrone(id) {
      this.drones = this.drones.filter(drone => drone.id !== id);
      if (this.markers.has(id)) {
        this.markers.get(id).setMap(null);
        this.markers.delete(id);
      }
      this.droneInfoMap.delete(id);
      this.droneWaypoints.delete(id);
      this.initialPositions.delete(id);
      this.batteryWarning20.delete(id);
      this.batteryWarning10.delete(id);
      this.batteryWarningZero.delete(id);
      if (this.selectedDrone === id) {
        this.selectedDrone = null;
        this.viewMode = 'general';
        nextTick(() => {
          this.initializeGeneralMap();
        });
      }
    },
    validateIpAddress(ip) {
      const ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])){3}$/;
      return ipRegex.test(ip);
    },
    validatePort(port) {
      const portNumber = parseInt(port, 10);
      return portNumber > 0 && portNumber <= 65535;
    },
    selectDrone(id) {
      this.selectedDrone = id;
      this.viewMode = 'drone';
      nextTick(() => {
        this.initializeMap(); 
        this.renderRoute(); 
        this.getVideoDevices(); 
      });
    },
    showGeneralView() {
      this.selectedDrone = null;
      this.viewMode = 'general';
      nextTick(() => {
        this.initializeGeneralMap(); 
      });
    },
    connect() {
      const drone = this.drones.find(d => d.id === this.selectedDrone);
      if (!drone) {
        console.error('Selected drone not found');
        return;
      }
      this.socket = io('http://localhost:5000');
      this.socket.emit('set_connection', {
        id: drone.id,
        address: drone.address,
        port: drone.port
      });
      this.socket.on('response', (data) => {
        console.log('Server response:', data.message);
      });
      this.socket.on('connect', () => {
        console.log('Connected to Flask-SocketIO server!');
      });
      this.socket.on('disconnect', () => {
        console.log('Disconnected from Flask-SocketIO server');
        this.land();
      });
      this.socket.on('drone_data', (data) => {
        console.log(`Data received for Drone ${data.id}:`, data);
        this.droneInfoMap.set(data.id, data);
        if (!this.initialPositions.has(data.id)) {
          this.initialPositions.set(data.id, { lat: data.lat, lon: data.lon });
        }
        if (data.id === this.selectedDrone) {
          this.updateMarker(); // Update the marker with new data
        }
        this.updateGeneralMapMarker(data.id, data.lat, data.lon);
        this.checkBatteryLevel(data.id, data.battery);
      });
    },

    land() {
      if (!this.isDroneConnected()) {
        this.showError("The drone must be connected first.");
        return;
      }
      this.socket.emit('land', { id: this.selectedDrone });
      console.log('Land command sent');
    },

    isDroneConnected() {
      return this.socket && this.socket.connected;
    },
    takeOff() {
      if (!this.isDroneConnected()) {
        this.showError("The drone must be connected first.");
        return;
      }
      if (!this.isValidAltitude(this.takeoffAltitudeInput)) {
        this.showError("Please enter a valid altitude.");
        return;
      }
      this.takeoffAltitude = parseFloat(this.takeoffAltitudeInput.replace(',', '.'));
      this.socket.emit('takeoff', { id: this.selectedDrone, altitude: this.takeoffAltitude });
      console.log(`Takeoff command sent with altitude ${this.takeoffAltitude}`);
    },
    changeAltitude(direction) {
      if (!this.isDroneConnected()) {
        this.showError("The drone must be connected first.");
        return;
      }
      if (!this.isDroneReady()) {
        this.showError("The drone must be armed and in GUIDED mode to change altitude.");
        return;
      }
      let socketEvent = direction > 0 ? 'move_up' : 'move_down';
      this.socket.emit(socketEvent, { id: this.selectedDrone, duration: 2 });
      console.log(`Change altitude command sent: ${direction > 0 ? 'up' : 'down'}`);
    },
    sendCommand(direction) {
      if (!this.isDroneConnected()) {
        this.showError("The drone must be connected first.");
        return;
      }
      if (!this.isDroneReady()) {
        this.showError("The drone must be armed and in GUIDED mode to move.");
        return;
      }
      let socketEvent = '';
      switch (direction) {
        case 'forward':
          socketEvent = 'move_forward';
          break;
        case 'backward':
          socketEvent = 'move_backward';
          break;
        case 'left':
          socketEvent = 'move_left';
          break;
        case 'right':
          socketEvent = 'move_right';
          break;
      }
      if (socketEvent) {
        this.socket.emit(socketEvent, { id: this.selectedDrone });
        console.log(`Command sent: ${direction}`);
      } else {
        console.error('Invalid direction');
      }
    },
    goHome() {
      if (!this.isDroneConnected()) {
        this.showError("The drone must be connected first.");
        return;
      }
      if (!this.isDroneReady()) {
        this.showError("The drone must be armed and in GUIDED mode to go home.");
        return;
      }
      const homePosition = this.initialPositions.get(this.selectedDrone);
      if (homePosition && this.socket) {
        this.socket.emit('go_home', { id: this.selectedDrone, ...homePosition });
        console.log(`Go Home command sent for drone ${this.selectedDrone} to position`, homePosition);
      } else {
        console.error('Home position not set or socket not connected');
      }
    },
    initializeMap() {
      this.loadGoogleMaps().then(() => {
        const mapOptions = {
          center: { lat: this.droneInfoMap.get(this.selectedDrone).lat, lng: this.droneInfoMap.get(this.selectedDrone).lon },
          zoom: 15,
          mapTypeId: 'terrain'
        };
        this.map = new google.maps.Map(this.$refs.map, mapOptions);
        console.log('Map initialized:', this.map);

        this.marker = new google.maps.Marker({
          position: { lat: this.droneInfoMap.get(this.selectedDrone).lat, lng: this.droneInfoMap.get(this.selectedDrone).lon },
          map: this.map,
          title: 'Drone Position',
          icon: {
            url: require('@/assets/droneMarker.png'),
            scaledSize: new google.maps.Size(50, 50)
          },
          draggable: false
        });

        this.map.addListener('click', (event) => {
          this.addRoutePoint(event.latLng);
        });

        this.renderRoute();
      }).catch((error) => {
        console.error('Failed to load Google Maps:', error);
      });
    },
    initializeGeneralMap() {
      this.loadGoogleMaps().then(() => {
        const mapOptions = {
          center: { lat: -35.3632626, lng: 149.1652378 }, // Initial center of the map
          zoom: 10,
          mapTypeId: 'terrain'
        };
        this.generalMap = new google.maps.Map(this.$refs.generalMap, mapOptions);
        console.log('General Map initialized:', this.generalMap);

        // Update markers for all drones
        this.drones.forEach(drone => {
          const info = this.droneInfoMap.get(drone.id);
          if (info) {
            this.updateGeneralMapMarker(drone.id, info.lat, info.lon);
          }
        });

      }).catch((error) => {
        console.error('Failed to load Google Maps:', error);
      });
    },
    updateMarker() {
      if (this.marker && this.map) {
        const position = {
          lat: this.droneInfoMap.get(this.selectedDrone).lat,
          lng: this.droneInfoMap.get(this.selectedDrone).lon
        };
        this.marker.setPosition(position);
        this.map.setCenter(position); // Center the map on the marker position
        console.log('Marker updated to position:', position);
      }
    },
    updateGeneralMapMarker(droneId, lat, lon) {
      console.log(`Updating marker for Drone ${droneId} to position (${lat}, ${lon})`); 
      if (this.generalMap) {
        let marker = this.markers.get(droneId);
        if (!marker) {
          marker = new google.maps.Marker({
            position: { lat, lng: lon },
            map: this.generalMap,
            title: `Drone ${droneId}`,
            icon: {
              url: require('@/assets/droneMarker.png'),
              scaledSize: new google.maps.Size(30, 30)
            },
            draggable: false
          });
          this.markers.set(droneId, marker);
          console.log(`Marker created for Drone ${droneId} at (${lat}, ${lon})`);
        } else {
          marker.setMap(this.generalMap);  
          marker.setPosition({ lat, lng: lon });
          console.log(`Marker updated for Drone ${droneId} to (${lat}, ${lon})`);
        }
      } else {
        console.error('General map not initialized.');
      }
    },
    addRoutePoint(latLng) {
      const droneId = this.selectedDrone;
      if (!this.droneWaypoints.has(droneId)) {
        this.droneWaypoints.set(droneId, []);
      }

      const marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: 'Route Point',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'blue',
          fillOpacity: 0.8,
          scale: 6,
          strokeColor: 'white',
          strokeWeight: 2
        },
        draggable: true
      });

      this.droneWaypoints.get(droneId).push({
        marker,
        latLng,
        alt: this.takeoffAltitude
      });

      console.log('Route point added:', latLng);
    },
    renderRoute() {
      const droneId = this.selectedDrone;
      if (this.map) {
        // Clear previous route points from the map
        this.droneWaypoints.forEach((waypoints) => {
          waypoints.forEach(waypoint => {
            waypoint.marker.setMap(null);
          });
        });

        if (this.droneWaypoints.has(droneId)) {
          this.droneWaypoints.get(droneId).forEach(waypoint => {
            waypoint.marker.setMap(this.map);
          });
        }
      }
    },
    clearRoute() {
      const droneId = this.selectedDrone;
      if (this.droneWaypoints.has(droneId)) {
        this.droneWaypoints.get(droneId).forEach(waypoint => {
          if (waypoint.marker) {
            waypoint.marker.setMap(null); 
          }
        });
        this.droneWaypoints.set(droneId, []);
        console.log('Route cleared for drone:', droneId);

        this.initializeMap();
      }
    },
    goToWaypoint() {
      if (!this.isDroneConnected()) {
        this.showError("The drone must be connected first.");
        return;
      }
      if (!this.isDroneReady()) {
        this.showError("The drone must be armed and in GUIDED mode to go to waypoints.");
        return;
      }
      const droneId = this.selectedDrone;
      if (this.droneWaypoints.has(droneId) && this.droneWaypoints.get(droneId).length > 0) {
        const waypoints = this.droneWaypoints.get(droneId).map(waypoint => ({
          lat: waypoint.latLng.lat(),
          lng: waypoint.latLng.lng(),
          alt: waypoint.alt
        }));

        console.log('Sending route to backend:', waypoints);
        this.socket.emit('start_route', { id: this.selectedDrone, waypoints });
        console.log('Route command sent with waypoints:', waypoints);
      } else {
        this.showError('No route defined for drone.');
      }
    },
    checkBatteryLevel(droneId, batteryLevel) {
      if (batteryLevel <= 20 && !this.batteryWarning20.has(droneId)) {
        this.showError(`Warning: Drone ${droneId} battery is at ${batteryLevel}%.`);
        this.batteryWarning20.add(droneId);
      }
      if (batteryLevel <= 10 && !this.batteryWarning10.has(droneId)) {
        this.showError(`Critical Warning: Drone ${droneId} battery is at ${batteryLevel}%.`);
        this.batteryWarning10.add(droneId);
      }
      if (batteryLevel <= 0 && !this.batteryWarningZero.has(droneId)) {
        this.showError(`Emergency: Drone ${droneId} battery is depleted. Landing immediately.`);
        this.batteryWarningZero.add(droneId);
        this.socket.emit('land', { id: droneId });
      }
    },
    async getVideoDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.videoDevices = devices.filter(device => device.kind === 'videoinput');

        if (this.videoDevices.length > 0) {
          const droidCamDevice = this.videoDevices.find(device => device.label.includes('DroidCam') || device.deviceId.includes('/dev/video0'));

          if (droidCamDevice) {
            this.selectedDeviceId = droidCamDevice.deviceId;
          } else {
            console.error('DroidCam device not found.');
          }
        } else {
          console.error('No video input devices found.');
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    },
    async startVideo() {
      try {
        if (this.selectedDeviceId) {
          const constraints = {
            video: {
              deviceId: { exact: this.selectedDeviceId },
            },
          };

          this.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
          this.$refs.video.srcObject = this.videoStream;
        } else {
          console.error('No video device selected.');
        }
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    },
    showError(message) {
      alert(message);
    },
    isDroneReady() {
      const droneData = this.droneInfoMap.get(this.selectedDrone);
      return droneData && droneData.armed && droneData.mode === 'GUIDED';
    },
    isValidAltitude(value) {
      return /^-?\d+([,.]\d+)?$/.test(value);
    },
    validateTakeoffAltitude() {
      const input = this.takeoffAltitudeInput;
      if (!this.isValidAltitude(input)) {
        this.takeoffAltitudeInput = input.replace(/[^0-9,.]/g, '');
      }
    },
    onKeydown(event) {
      if (["Space", "ArrowUp", "ArrowDown"].indexOf(event.code) > -1) {
        event.preventDefault();
      }
      switch (event.code) {
        case ("Space"): {
          console.log("takeoff")
          this.takeOff();
          break;
        }
        case ("ControlLeft"): {
          console.log("CTRL Land");
          this.land()
          break;
        }
        case ("ArrowUp"): {
          console.log("up")
          this.changeAltitude(1);
          break;
        }
        case ("ArrowDown"): {
          console.log("Down")
          this.changeAltitude(-1);
          break;
        }
        case ("KeyA"): {
          console.log("left")
          this.sendCommand('left');
          break;
        }
        case ("KeyD"): {
          this.sendCommand('right');
          console.log("Right")
          break;
        }
        case ("KeyS"): {
          this.sendCommand('backward');
          console.log("back")
          break;
        }
        case ("KeyW"): {
          console.log("forward")
          this.sendCommand('forward');
          break;
        }
        default: {
          break;
        }
      }
    }
  },
  mounted() {
    if (this.viewMode === 'general') {
      nextTick(() => {
        this.initializeGeneralMap();
      });
    }
    document.addEventListener("keydown", this.onKeydown);
  },
  beforeUnmount() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
    this.drones.forEach(drone => {
      if (this.droneWaypoints.has(drone.id)) {
        this.droneWaypoints.get(drone.id).forEach(waypoint => {
          if (waypoint.marker) {
            waypoint.marker.setMap(null);
          }
        });
      }
    });
    document.removeEventListener("keydown", this.onKeydown);
  },
};
</script>

<style>
/* Basic styling for buttons */
button {
  margin: 0; /* Remove all margins to eliminate space between buttons */
  padding: 10px;
  font-size: 16px;
}

input {
  margin: 0; /* Remove all margins to eliminate space between input and buttons */
  padding: 10px;
  font-size: 16px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  text-align: left;
  margin-top: 20px;
}

h3 {
  text-align: center;
  margin-top: 20px;
}

.main-content {
  text-align: center;
}

.map-container {
  width: 50%; /* Adjusted width to provide more space for the map */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0; /* Remove margin */
}

.map {
  width: 100%;
  height: 400px;
  margin-bottom: 10px; /* Adjust margin to place buttons directly below */
}

.map.full-width {
  width: 100%; /* Make the general map span from one side to the other */
}

.drone-view .top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0; /* Remove gap between map and camera */
}

.drone-camera {
  width: 50%; /* Adjusted width to provide more space for the camera */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0; /* Remove margin */
}

.video {
  width: 100%;
  height: 400px;
}

.camera-controls {
  margin-top: 10px;
}

.centered-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.centered-buttons button {
  margin: 0 5px;
}

.bottom-section {
  display: flex;
}

.flight-controls {
  width: 65%;
}

.takeoff-land-controls,
.movement-controls {
  display: flex;
  margin-bottom: 10px;
}

.takeoff-land-controls button,
.movement-controls button {
  margin: 0;
}

.movement-controls .horizontal-controls,
.movement-controls .vertical-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movement-controls .horizontal-controls button,
.movement-controls .vertical-controls button {
  margin: 0;
}

.drone-info-panel {
  width: 30%;
  text-align: left;
}

.sidebar {
  width: 200px;
  padding: 10px;
  background-color: #f0f0f0;
  border-right: 1px solid #ddd;
  float: left;
}

.sidebar h2 {
  margin-top: 0;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  padding: 5px;
  cursor: pointer;
}

.sidebar ul li:hover {
  background-color: #ddd;
}

.no-drones-message {
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
  color: red;
}

/* New CSS for side-by-side drone info */
.drones-container {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping to the next line if there are many drones */
  justify-content: center; /* Center the content */
}

.drone-info {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px;
  flex: 1 1 300px; /* Flex item basis and minimum width */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}
</style>
