Number.prototype.padStart = function (...args) {
	return this.toString().padStart(...args);
};

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
	let get = Object.entries(obj).map(([k, v]) => k + '=' + v).join('&');
	return get != '' ? '?' + get : '';
}

function url2obj() {
	let strUrl = location.search;
	if (strUrl.indexOf('?') == -1) return {};
	return Object.fromEntries(strUrl.split("?")[1].split("&").map(v => v.trim().split('=')));
}

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
}).then(response => response.text());

let text2xml = text => (new DOMParser()).parseFromString(text, "text/xml");
let xml2text = xml => (new XMLSerializer()).serializeToString(xml);
let copyxml = xml => text2xml(xml2text(xml));

function text2html(text) {
	let t = document.createElement('template');
	t.innerHTML = text;
	return t.content.firstChild;
}

function text2svg(text) {
	return (new DOMParser()).parseFromString(
		`<?xml version="1.0" encoding="UTF-8"?>
			<svg xmlns="http://www.w3.org/2000/svg"
				 xmlns:xlink="http://www.w3.org/1999/xlink">${text}
			</svg>`, "image/svg+xml").querySelector('svg').firstChild;
}

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

function svgtourl(svg) {
	let svgstring = xml2text(svg);
	let blob = new Blob([svgstring], { type: 'image/svg+xml' });
	return URL.createObjectURL(blob);
}

let svgtoimg = svg => loadimg(svgtourl(svg));

let svgtopngurl = svg => svgtoimg(svg).then(img => {
	let canvas = text2html(`<canvas width="${img.naturalWidth}" height="${img.naturalHeight}"/>`);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return new Promise(r => canvas.toBlob(blob => r(URL.createObjectURL(blob))));
});

let pngtobase64 = src => loadimg(src).then(img => {
	let canvas = text2html(`<canvas width="${img.naturalWidth}" height="${img.naturalHeight}"/>`);
	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL();
});

function startDownload(url, name) {
	let a = document.createElement('a');
	a.href = url;
	a.download = name;
	a.click();
}
