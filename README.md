# Drone-Control: Intelligent Cloud Based Control Station for Drones

## Descrição do Projeto

Este projeto foi desenvolvido por **Tomás Vilhena Pereira e João Afonso Godinho Ferreira** como parte da disciplina de **Projeto Informático**. A aplicação consiste numa **Intelligent Cloud Based Control Station for Drones**, que permite o controlo simultâneo de múltiplos drones, físicos ou simulados, a partir de qualquer localização. O sistema possibilita controlar o movimento vertical e horizontal dos drones, levantar voo, aterrar, criar rotas automáticas e captar imagens de vídeo em tempo real. Além disso, os dados dos drones são processados por um servidor, proporcionando uma interface simples e intuitiva para monitorar e controlar.

---

## Funcionalidades

- Controlo manual de drones: levantar voo, aterrar, alterar altitude e direção.
- Controlo automático: definição de waypoints e execução de rotas automáticas.
- Visualização em tempo real das imagens captadas pelas câmaras dos drones.
- Análise de dados importantes como altitude, localização GPS, nível de bateria e status do drone.
- Suporte para múltiplos drones com comunicação MAVLink.

---

## Tecnologias Utilizadas

- **Frontend**: Vue.js (Vue 3)
- **Backend**: Flask, Websockets (socket.io)
- **Protocolos de Comunicação**: MAVLink para comunicação com drones
- **Simuladores**: ArduCopter (SITL)
- **Integração de Mapas**: Google Maps API
- **Câmera Simulada**: DroidCam para testes de visualização em tempo real

---

## Instalação e Configuração

### Pré-requisitos

- **Python 3.8 ou superior**
- **Node.js** (para o frontend Vue.js)
- **ArduPilot SITL** (para simular os drones)
- Dependências adicionais listadas em `package.json`

  ## Como Usar

1. Abra a interface web em `http://localhost:8080`.
2. Conecte um ou mais drones (reais ou simulados) que utilizem o protocolo MAVLink.
3. Utilize os botões disponíveis na interface para:
   - Levantar voo e aterrar drones.
   - Definir waypoints no mapa e executar rotas automáticas.
   - Visualizar a transmissão de vídeo em tempo real.
   - Analisar os dados de telemetria dos drones.
4. Para testes, é possível usar a aplicação **DroidCam** para simular a câmara de um drone.

---

## Estrutura do Projeto

- **frontend/**: contém o código do Vue.js para a interface de usuário.
- **backend/**: contém o código Flask para o servidor e lógica de comunicação com drones.
- **simulator/**: configurações e scripts para integração com o simulador de drones (SITL).


