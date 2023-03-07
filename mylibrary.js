Number.prototype.padStart = function (...args) { return this.toString().padStart(...args); };
Number.prototype.padEnd = function (...args) { return this.toString().padEnd(...args); };

String.prototype.forEach = function (cb = () => { }) { this.split(/(?:)/u).forEach(cb); };

Array.prototype.random = function () { return this.length <= 0 ? null : this[Math.floor(Math.random() * this.length)]; };
Array.prototype.draw = function () { return this.length <= 0 ? null : this.splice(Math.floor(Math.random() * this.length), 1)[0]; };

Object.prototype.entries = function () { return Object.entries(this); };
Object.prototype.forEach = function (cb = () => { }) { this.entries().forEach(([k, v]) => cb(v, k)); };
Object.prototype.some = function (cb = () => { }) { return this.entries().some(([k, v]) => cb(v, k)); };

Audio.prototype.replay = function () {
	this.currentTime = 0;
	this.play();
};

function range(f, l) {
	let a = [];
	if (f < l) { for (let i = f; i <= l; i++) { a.push(i); } }
	else { for (let i = f; i >= l; i--) { a.push(i); } }
	return a;
}
let range_nf = (f, l) => range(f, l).slice(1);
let range_nl = (f, l) => range(f, l).slice(0, -1);
let range_nfl = (f, l) => range(f, l).slice(1, -1);

function setCookie(key, value) {
	let d = new Date();
	d.setTime(d.getTime() + (100 * 24 * 60 * 60 * 1000));
	document.cookie = `${key}=${value};expires=${d.toUTCString()};path=${location.pathname}`;
}

function getCookie(key) {
	let cookie = Object.fromEntries(document.cookie.split(';').map(v => v.trim().split('=')));
	return cookie[key] ?? '';
}

function obj2get(obj) {
	let get = new URLSearchParams(obj).toString();
	return get != '' ? '?' + get : '';
}

let url2obj = () => Object.fromEntries(new URLSearchParams(location.search));

function obj2url(obj) {
	window.history.pushState({}, 0, location.href.split('?')[0] + obj2get(obj) + location.hash);
}

let promise = (cb, ...args) => new Promise(r => cb(...args, r));
let sleep = ms => new Promise(r => setTimeout(r, ms));

let loadfile = (type, url) => fetch(url).then(r => r[type]());
let loadsound = url => loadfile('blob', url).then(blob => new Audio(URL.createObjectURL(blob)));
let sentpost = (url, obj) => fetch(url, {
	body: JSON.stringify(obj),
	headers: { 'content-type': 'application/json' },
	method: 'POST'
}).then(r => r.text());

let text2xml = text => (new DOMParser()).parseFromString(text, "text/xml");
let xml2text = xml => (new XMLSerializer()).serializeToString(xml);
let copyxml = xml => text2xml(xml2text(xml));

function text2html(text) {
	let t = document.createElement('template');
	t.innerHTML = text;
	return t.content.firstChild;
}

let text2svg = text => (new DOMParser()).parseFromString(
	`<?xml version="1.0" encoding="UTF-8"?>`
	+ `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${text.replace(/^\s*<\?[\w\s\"\'\.\-\=]*\?>\s*/g, '')}</svg>`,
	"image/svg+xml").querySelector('svg').firstChild;

let getimgsize = src => new Promise((res, rej) => {
	let img = new Image();
	img.onload = () => res([img.naturalWidth, img.naturalHeight]);
	img.onerror = () => res([-1, -1]);
	img.src = src;
});

let loadimg = src => new Promise((res, rej) => {
	let img = new Image();
	img.onload = () => res(img);
	img.onerror = rej;
	img.src = src;
});

function imgtocanvas(img) {
	let canvas = text2html(`<canvas width="${img.naturalWidth}" height="${img.naturalHeight}"/>`);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return canvas;
}

let svgtexttourl = text => URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
let svgtourl = svg => svgtexttourl(xml2text(svg));
let svgtoimg = svg => loadimg(svgtourl(svg));

let svgtopngurl = svg => svgtoimg(svg).then(img => new Promise(r => imgtocanvas(img).toBlob(blob => r(URL.createObjectURL(blob)))));
let pngtobase64 = src => loadimg(src).then(img => imgtocanvas(img).toDataURL());

function startDownload(url, name) {
	let a = document.createElement('a');
	a.href = url;
	a.download = name;
	a.click();
}
