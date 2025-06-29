# 🐔 MycoCheck Frontend

**MycoCheck** is a web-based poultry monitoring platform designed to help farmers detect and respond to symptoms of **Mycoplasma infection** in chickens. This repository contains the frontend code for the system, built using **Vue 3**, **Pinia**, and **Vuetify**.

---

## Features

- ✅ Real-time snapshot viewing of symptomatic chickens
- 📊 Dashboard with detection accuracy and timestamps
- 💬 Vet-to-Farmer messaging system (via SignalR)
- 📱 Mobile-responsive sidebar and layout
- 🔐 Login/logout with user-type based access (Farmer / Vet)
- 🔔 SMS alerts for flagged symptoms (handled via backend)
- ✅ Handles jwt+google 0auth 2.0 from backend

---

## 🛠 Tech Stack

| Category   | Tools                    |
|------------|--------------------------|
| Framework  | [Vue 3](https://vuejs.org/) |
| UI Library | [Vuetify 3](https://next.vuetifyjs.com/) |
| State Mgmt | [Pinia](https://pinia.vuejs.org/) |
| Realtime   | [SignalR](https://www.npmjs.com/package/@microsoft/signalr) |
| HTTP       | Axios + REST API         |
| Build Tool | Vite                     |

---

## 📦 Project Structure

```bash
src/
│
├── components/          # Reusable components (layout, tables, etc.)
├── pages/               # Main route views like Dashboard, Messages
├── stores/              # Pinia stores (e.g., FarmerStore)
├── plugins/axios.js     # Axios instance for backend communication
├── App.vue              # Root Vue file
└── main.js              # App entry point
