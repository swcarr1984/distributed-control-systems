### Thesis Research Project — High‑Performance Edge Runtime on Resource‑Constrained Hardware ###

This repository contains the full implementation of my thesis research project: a distributed real‑time control, monitoring, and HMI system built on Node.js, Express, MVC architecture, MySQL, WebSockets, and low‑latency device polling.
The system was engineered to run on resource‑constrained embedded hardware (Raspberry Pi Zero W and Raspberry Pi 5) while maintaining sub‑millisecond capture, deterministic state handling, and robust dual‑client communication.

### Project Overview ###
This research project explores the design and implementation of a high‑performance, real‑time distributed control system capable of:
- Sub‑millisecond device data capture
- Real‑time state, timestamp, and alarm recording
- Dual‑client communication (Ethernet TCP/IP + fibre‑optic node layer)
- HMI display and sequential program logic checks
- Asynchronous event handling using callbacks and Promises
- Multi‑layered data flow: acquisition → processing → storage → HMI
- Operation on constrained Linux‑based embedded devices

The system demonstrates how modern web technologies can be adapted for industrial‑grade real‑time control, even on low‑power hardware.

### Key Features ###
- Real‑Time Data Acquisition
- Sub‑millisecond device polling
- Deterministic state stamping
- High‑frequency capture loops with async scheduling
- Sequential program checks for safety and logic validation
- Dual‑Client Architecture
- Ethernet TCP/IP client for high‑level control
- Fibre‑optic node client for low‑latency device communication
- Redundant communication paths for reliability
- Web‑Based HMI - HTML/CSS/JavaScript front‑end
- Real‑time updates via WebSockets
- Alarm state visualisation
- Device status dashboards
- Operator interaction panels

Backend Architecture
- Node.js + Express
- MVC pattern for maintainability
- MySQL database for historical logging
- Real‑time alarm/event recording
- Async callbacks, Promises, and non‑blocking I/O

Frontend 
- HTML5
- CSS3
- JavaScript
- WebSocket client
- Real‑time HMI MVC (express/EJS) components

Embedded Hardware
Designed and validated on:
- Raspberry Pi Zero W (severely resource‑constrained)
- Raspberry Pi 5 (high‑performance edge node)
- Both running Linux OS with optimised runtime configurations.

## System Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                  Distributed Control System                  │
└──────────────────────────────────────────────────────────────┘

Device Layer (Sensors / IO / Fibre Nodes)
                │
                ▼
Fibre‑Optic Hardware Interface  <──>  TCP/IP Ethernet Client
                │
                ▼
Real‑Time Acquisition Engine (sub‑ms)
                │
                ▼
Processing & State Machine (async)
                │
                ▼
MySQL Database (events, alarms, history)
                │
                ▼
Express MVC Backend
                │
                ▼
WebSocket Server  <──>  HMI Frontend (HTML/CSS/JS)

```

### Hardware & OS ###
- Raspberry Pi Zero W
- Raspberry Pi 5
- Linux OS (Debian/Raspberry Pi OS)
- Fibre‑optic node (media converter) hardware
- Ethernet TCP/IP

### Core Capabilities ###
1. Sub‑Millisecond Capture
- High‑frequency polling loops with timestamped data and state transitions.

2. Alarm Recording & Reporting
- Real‑time alarm detection
- Historical alarm logs
- HMI alarm panel

3. Sequential Program Checks
- Step‑based logic validation
- State machine transitions
- Safety interlocks

4. Dual‑Client Communication
- TCP/IP for supervisory control
- Fibre‑optic node layer for deterministic device IO

5. Real‑Time HMI
- Live device values
- Alarm indicators
- System state visualisation

```text
###Repository Structure
Code
/src
   /controllers
   /models
   /views
   /routes
   /services
   /websocket
/database
/public
   /css
   /js
/hardware
/docs
```

### Research Outcomes ###
This project demonstrates that:
- Modern web technologies can be adapted for real‑time industrial control
- Sub‑millisecond capture is achievable on low‑power embedded Linux devices
- Dual‑client architectures improve reliability and determinism
- MVC + WebSockets provides a clean separation of concerns for HMI systems

**Node.js is viable for distributed control when engineered correctly**
