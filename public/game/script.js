const room = window.location.pathname.split("/")[2];
console.log(room);

const username = localStorage.getItem("username");

const socket = io();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
