from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from pymavlink import mavutil
import threading
import time
import math

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:8080")

drones = {}
takeoff_time = {}
total_flight_time = {}
default_speed = 2  

route_threads = {}

def connect_to_sitl(drone_id, address, port):
    try:
        connection_str = f'udp:{address}:{port}'
        master = mavutil.mavlink_connection(connection_str)
        print(f"Conectado ao SITL em {connection_str}. Esperando por heartbeat...")
        master.wait_heartbeat(timeout=15)
        print("Heartbeat recebido.")
        drones[drone_id] = master
        takeoff_time[drone_id] = 0
        total_flight_time[drone_id] = 0
        emit('connection_status', {'id': drone_id, 'status': 'connected'})
    except Exception as e:
        print(f"Não foi possível conectar ao SITL ou receber heartbeat: {e}")
        drones[drone_id] = None
        emit('connection_status', {'id': drone_id, 'status': 'failed', 'error': str(e)})

def get_battery_status(master):
    try:
        if master is None:
            raise Exception("Master not initialized")
        msg = master.recv_match(type='BATTERY_STATUS', blocking=True, timeout=2)
        if msg:
            return msg.battery_remaining  
        return None
    except Exception as e:
        print(f"Erro ao obter status da bateria: {e}")
        return None

def calculate_flight_time(drone_id):
    elapsed = 0
    if takeoff_time.get(drone_id, 0) > 0:
        elapsed = time.time() - takeoff_time[drone_id]
    total_time = total_flight_time.get(drone_id, 0) + elapsed
    minutes = int(total_time // 60)
    seconds = int(total_time % 60)
    return f"{minutes} min {seconds} s"

def land_all_drones():
    for drone_id, master in drones.items():
        if master:
            land_drone(drone_id)
            print(f"Drone {drone_id} pousado devido à desconexão do servidor.")

def broadcast_drone_data():
    while True:
        try:
            for drone_id, master in drones.items():
                if master is None:
                    print("Master not initialized. Retrying...")
                    time.sleep(1)
                    continue

                heartbeat_msg = master.recv_match(type='HEARTBEAT', blocking=True, timeout=2)
                position_msg = master.recv_match(type='GLOBAL_POSITION_INT', blocking=True, timeout=2)
                attitude_msg = master.recv_match(type='ATTITUDE', blocking=True, timeout=2)

                if heartbeat_msg and position_msg and attitude_msg:
                    heading = attitude_msg.yaw * 180 / math.pi

                    mode_mapping = master.mode_mapping()
                    inverted_mapping = {v: k for k, v in mode_mapping.items()}
                    mode = inverted_mapping.get(heartbeat_msg.custom_mode, 'Unknown')
                    is_armed = heartbeat_msg.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED
                    lat = position_msg.lat / 1e7
                    lon = position_msg.lon / 1e7
                    alt = position_msg.relative_alt / 1000
                    battery = get_battery_status(master) or 0

                    if mode == 'GUIDED' and is_armed:
                        if takeoff_time[drone_id] == 0:
                            takeoff_time[drone_id] = time.time()
                    else:
                        if takeoff_time[drone_id] != 0:
                            total_flight_time[drone_id] += time.time() - takeoff_time[drone_id]
                            takeoff_time[drone_id] = 0

                    flight_time = calculate_flight_time(drone_id)

                    socketio.emit('drone_data', {
                        'id': drone_id,
                        'mode': mode,
                        'armed': bool(is_armed),
                        'lat': lat,
                        'lon': lon,
                        'alt': alt,
                        'flight_time': flight_time,
                        'battery': battery,
                        'heading': heading
                    })

                    print(
                        f"Drone {drone_id} - Modo: {mode}, Armado: {bool(is_armed)}, Lat: {lat}, Lon: {lon}, Alt: {alt}, Bat: {battery}, Flight Time: {flight_time}, Heading: {heading}")
                else:
                    print(f"Drone {drone_id} - Não foi possível receber HEARTBEAT ou posição global ou atitude.")
        except Exception as e:
            print(f"Erro inesperado ao obter dados: {e}")
        time.sleep(0.5)  

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('disconnect')
def handle_disconnect():
    print('Cliente desconectado. Pousando todos os drones.')
    land_all_drones()

@socketio.on('set_connection')
def handle_set_connection(data):
    drone_id = data.get('id')
    address = data.get('address')
    port = data.get('port')
    connect_to_sitl(drone_id, address, port)

@socketio.on('takeoff')
def handle_takeoff(data):
    drone_id = data.get('id')
    master = drones.get(drone_id)
    if master is None:
        print("Master not initialized. Cannot take off.")
        return
    takeoff_time[drone_id] = time.time()
    mode = 'GUIDED'
    mode_id = master.mode_mapping()[mode]
    master.set_mode(mode_id)

    master.mav.command_long_send(
        master.target_system,
        master.target_component,
        mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
        0, 1, 0, 0, 0, 0, 0, 0
    )
    master.motors_armed_wait()
    current_altitude = data['altitude'] if 'altitude' in data else 3
    print(f"Decolando até {current_altitude} metros.")
    master.mav.command_long_send(
        master.target_system,
        master.target_component,
        mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
        0, 0, 0, 0, 0, 0, 0, current_altitude
    )

@socketio.on('land')
def handle_land(data):
    drone_id = data.get('id')
    master = drones.get(drone_id)
    if master is None:
        print("Master not initialized. Cannot land.")
        return
    print("Pousando.")
    master.mav.command_long_send(
        master.target_system,
        master.target_component,
        mavutil.mavlink.MAV_CMD_NAV_LAND,
        0, 0, 0, 0, 0, 0, 0, 0
    )
    total_flight_time[drone_id] += time.time() - takeoff_time[drone_id]
    takeoff_time[drone_id] = 0

def move_drone(drone_id, velocity_x, velocity_y, duration):
    master = drones.get(drone_id)
    if master is None:
        print(f"Master not initialized for drone {drone_id}. Cannot move.")
        return

    master.mav.set_position_target_local_ned_send(
        0, master.target_system, master.target_component,
        mavutil.mavlink.MAV_FRAME_LOCAL_NED, 0b0000111111000111,
        0, 0, 0,  # posições não são usadas
        velocity_x, velocity_y, 0,  # X, Y, Z velocidades
        0, 0, 0,  # acelerações não são usadas
        0, 0  # yaw e yaw_rate não são usados
    )
    time.sleep(duration)
    master.mav.set_position_target_local_ned_send(
        0, master.target_system, master.target_component,
        mavutil.mavlink.MAV_FRAME_LOCAL_NED, 0b0000111111000111,
        0, 0, 0,
        0, 0, 0,
        0, 0,
        0, 0
    )

@socketio.on('move_forward')
def handle_move_forward(data):
    drone_id = data.get('id')
    print(f"Drone {drone_id} - Frente.")
    move_drone(drone_id, 1, 0, 2)

@socketio.on('move_backward')
def handle_move_backward(data):
    drone_id = data.get('id')
    print(f"Drone {drone_id} - Trás.")
    move_drone(drone_id, -1, 0, 2)

@socketio.on('move_right')
def handle_move_right(data):
    drone_id = data.get('id')
    print(f"Drone {drone_id} - Direita.")
    move_drone(drone_id, 0, 1, 2)

@socketio.on('move_left')
def handle_move_left(data):
    drone_id = data.get('id')
    print(f"Drone {drone_id} - Esquerda.")
    move_drone(drone_id, 0, -1, 2)

@socketio.on('move_up')
def handle_move_up(data):
    drone_id = data.get('id')
    print(f"Drone {drone_id} - Cima.")
    move_drone_vertically(drone_id, -0.5, data.get('duration', 2))

@socketio.on('move_down')
def handle_move_down(data):
    drone_id = data.get('id')
    print(f"Drone {drone_id} - Baixo.")
    move_drone_vertically(drone_id, 0.5, data.get('duration', 2))

def move_drone_vertically(drone_id, velocity_z, duration):
    master = drones.get(drone_id)
    if master is None:
        print(f"Master not initialized for drone {drone_id}. Cannot move vertically.")
        return

    master.mav.set_position_target_local_ned_send(
        0, master.target_system, master.target_component,
        mavutil.mavlink.MAV_FRAME_LOCAL_NED, 0b0000111111000111,
        0, 0, 0,  # posições não são usadas
        0, 0, velocity_z,  # velocidade em Z
        0, 0, 0,  # acelerações não são usadas
        0, 0,  # yaw
        0  # yaw_rate
    )
    time.sleep(duration)
    master.mav.set_position_target_local_ned_send(
        0, master.target_system, master.target_component,
        mavutil.mavlink.MAV_FRAME_LOCAL_NED, 0b0000111111000111,
        0, 0, 0,
        0, 0, 0,
        0, 0,
        0, 0
    )

def move_to_waypoint(drone_id, waypoint, callback=None):
    master = drones.get(drone_id)
    if master is None:
        print(f"Master not initialized for drone {drone_id}. Cannot move to waypoint.")
        return

    lat = waypoint['lat']
    lon = waypoint['lng']
    alt = waypoint['alt']

    print(f"Drone {drone_id} - Moving to waypoint: Lat {lat}, Lon {lon}, Alt {alt}")
    master.mav.set_position_target_global_int_send(
        0,
        master.target_system, master.target_component,
        mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT_INT,  
        0b110111111000,  
        int(lat * 1e7),  
        int(lon * 1e7),  
        alt, 
        0, 0, 0, 
        0, 0, 0,  
        0, 0  
    )

    while True:
        msg = master.recv_match(type='GLOBAL_POSITION_INT', blocking=True)
        if msg:
            current_lat = msg.lat / 1e7
            current_lon = msg.lon / 1e7
            distance = math.sqrt((lat - current_lat)**2 + (lon - current_lon)**2)
            if distance < 0.0001:  
                socketio.emit('waypoint_reached', {'id': drone_id})
                if callback:
                    callback()
                break
        time.sleep(1)

def move_along_route(drone_id, waypoints):
    print(f"Moving drone {drone_id} along route: {waypoints}")
    def next_waypoint(index):
        if index < len(waypoints):
            print(f"Moving to waypoint {index + 1}/{len(waypoints)}: {waypoints[index]}")
            move_to_waypoint(drone_id, waypoints[index], lambda: next_waypoint(index + 1))

    next_waypoint(0)

@socketio.on('start_route')
def handle_start_route(data):
    drone_id = data.get('id')
    waypoints = data.get('waypoints', [])
    print(f"Received start_route command for drone {drone_id} with waypoints: {waypoints}")

    
    if drone_id in route_threads:
        try:
            if route_threads[drone_id].is_alive():
                route_threads[drone_id].do_run = False
                route_threads[drone_id].join()
        except Exception as e:
            print(f"Erro ao interromper a thread de rota anterior: {e}")

    def run_route():
        t = threading.currentThread()
        for index, waypoint in enumerate(waypoints):
            if getattr(t, "do_run", True):
                print(f"Moving to waypoint {index + 1}/{len(waypoints)}: {waypoint}")
                move_to_waypoint(drone_id, waypoint)
            else:
                break

   
    route_thread = threading.Thread(target=run_route)
    route_threads[drone_id] = route_thread
    route_thread.start()

def stop_route(drone_id):
    if drone_id in route_threads and route_threads[drone_id].is_alive():
        route_threads[drone_id].do_run = False
        route_threads[drone_id].join()
        del route_threads[drone_id]
        print(f"Rota para drone {drone_id} parada.")

@socketio.on('go_home')
def handle_go_home(data):
    drone_id = data.get('id')
    lat = data.get('lat')
    lon = data.get('lon')
    master = drones.get(drone_id)
    if master is None:
        print(f"Master not initialized for drone {drone_id}. Cannot go home.")
        return

    stop_route(drone_id)

    def go_home_and_land():
        move_to_waypoint(drone_id, {'lat': lat, 'lng': lon, 'alt': 5}, lambda: land_drone(drone_id))

    route_thread = threading.Thread(target=go_home_and_land)
    route_thread.start()

def land_drone(drone_id):
    master = drones.get(drone_id)
    if master is None:
        print(f"Master not initialized for drone {drone_id}. Cannot land.")
        return
    print(f"Drone {drone_id} - Landing.")
    master.mav.command_long_send(
        master.target_system,
        master.target_component,
        mavutil.mavlink.MAV_CMD_NAV_LAND,
        0, 0, 0, 0, 0, 0, 0, 0
    )
    total_flight_time[drone_id] += time.time() - takeoff_time[drone_id]
    takeoff_time[drone_id] = 0

if __name__ == '__main__':
    import signal
    def signal_handler(sig, frame):
        print('Servidor Flask-SocketIO encerrado. Pousar todos os drones.')
        land_all_drones()
        socketio.stop()

    signal.signal(signal.SIGINT, signal_handler)

    data_thread = threading.Thread(target=broadcast_drone_data, daemon=True)
    data_thread.start()
    socketio.run(app, debug=True, use_reloader=False, allow_unsafe_werkzeug=True)
