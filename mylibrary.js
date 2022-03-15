function paddingLeft(str, length) {
	str += '';
	if (str.length >= length)
		return str;
	else
		return paddingLeft("0" + str, length);
}

function setCookie(cname, cvalue) {
	var d;
	var expires = '';
	d = new Date();
	d.setTime(d.getTime() + (100 * 24 * 60 * 60 * 1000));
	expires = "expires=" + d.toUTCString() + ";";
	document.cookie = cname + "=" + cvalue + ";" + expires + "path=" + location.pathname;
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function url2array() {
	var arr = [];
	var strUrl = location.search;
	if (strUrl.indexOf('?') != -1) {
		var allData = strUrl.split("?")[1].split("&");
		for (var i = 0; i < allData.length; i++) {
			var data = allData[i].split("=");
			arr[data[0]] = decodeURIComponent(data[1]);
		}
	}
	return arr;
}

function array2url(arr) {
	var allData = [];
	for (var i in arr) {
		allData.push(i + '=' + encodeURIComponent(arr[i]));
	}
	var strUrl = allData.length != 0 ? ('?' + allData.join('&')) : '';
	var url = location.href.split('?')[0];
	window.history.pushState({}, 0, url + strUrl + location.hash);
}

function promise(callback, ...args) {
	return new Promise((resolve, reject) => {
		callback(...args, (data) => {
			resolve(data);
		});
	});
}

function promisearr(callback, ...args) {
	return new Promise((resolve, reject) => {
		callback(...args, (...args) => {
			resolve(args);
		});
	});
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function openfile(url, callback) {
	let oReq = new XMLHttpRequest();
	oReq.addEventListener("load", function () {
		if (this.status != 404) {
			callback(this.responseText);
		} else {
			callback('{}');
		}
	});
	oReq.addEventListener("error", function () {
		callback('{}');
	});
	oReq.open("GET", url);
	oReq.send();
}

function openfilebinary(url, callback) {
	let oReq = new XMLHttpRequest();
	oReq.responseType = "arraybuffer";
	oReq.addEventListener("load", function () {
		if (this.status != 404) {
			callback(new Uint8Array(this.response));
		} else {
			callback('{}');
		}
	});
	oReq.addEventListener("error", function () {
		callback('{}');
	});
	oReq.open("GET", url);
	oReq.send();
}

function text2xml(text) {
	let parser = new DOMParser();
	return parser.parseFromString(text, "text/xml");
}

function xml2text(xml) {
	let xsl = new XMLSerializer();
	return xsl.serializeToString(xml);
}

function copyxml(xml) {
	return text2xml(xml2text(xml));
}

function getimgsize(imgsrc, callback) {
	let a = new Image();
	a.onload = () => {
		callback(a.naturalWidth, a.naturalHeight);
	};
	a.onerror = () => {
		callback(-1, -1);
	};
	a.src = imgsrc;
}

function loadimg(imgsrc, callback) {
	let img = new Image();
	img.onload = () => {
		callback(img);
	};
	img.src = imgsrc;
}

function loadsound(src, callback) {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', src);
	xhr.responseType = "blob";
	xhr.send();
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			let blob = this.response;
			callback(URL.createObjectURL(blob));
		}
	}
}

function svgtoimg(svg, callback) {
	let svgstring = xml2text(svg);
	let img = new Image();
	let blob = new Blob([svgstring], { type: 'image/svg+xml' });
	let url = URL.createObjectURL(blob);
	img.onload = () => {
		callback();
	};
	img.src = url;
	return img;
}

function svgtopngurl(svg, callback) {
	let img = svgtoimg(svg, () => {
		let c = document.createElement("canvas");
		c.setAttribute('width', img.naturalWidth);
		c.setAttribute('height', img.naturalHeight);
		let ctx = c.getContext("2d");
		ctx.drawImage(img, 0, 0);
		c.toBlob((blob) => {
			let url = URL.createObjectURL(blob);
			callback(url);
		});
	});
}

function pngtobase64(imgsrc, callback) {
	let img = new Image();
	img.onload = () => {
		let c = document.createElement("canvas");
		c.setAttribute('width', img.naturalWidth);
		c.setAttribute('height', img.naturalHeight);
		let ctx = c.getContext("2d");
		ctx.drawImage(img, 0, 0);
		callback(c.toDataURL());
	};
	img.src = imgsrc;
}

function getclickpoint(event, element) {
	return {
		x: event.clientX - element.offsetLeft + document.documentElement.scrollLeft + document.body.scrollLeft,
		y: event.clientY - element.offsetTop + document.documentElement.scrollTop + document.body.scrollTop
	};
}

function startDownload(url, name) {
	let download = document.createElement('a');
	download.href = url;
	download.download = name;
	download.click();
}

function arrsum(arr) {
	let sum = 0;
	let len = arr.length;
	for (let i = 0; i < len; i++) {
		sum += arr[i] * 1;
	}
	return sum;
}
function arraverage(arr) {
	let len = arr.length;
	if (len != 0)
		return arrsum(arr) / len;
	else
		return 0;
}
function arrsd(arr) {
	let sum = 0;
	let average = arraverage(arr);
	let len = arr.length;
	for (let i = 0; i < len; i++) {
		let k = arr[i] - average;
		sum += k * k;
	}
	return Math.sqrt(sum / len);
}

function componentToHex(c) {
	c = Math.floor(c * 1);
	var hex = c.toString(16);
	return paddingLeft(hex, 2);
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(h) {
	let r, g, b;
	if (h.length == 4) {
		r = 0x11 * ('0x' + h[1]);
		g = 0x11 * ('0x' + h[2]);
		b = 0x11 * ('0x' + h[3]);
	} else {
		r = 1 * ('0x' + h[1] + h[2]);
		g = 1 * ('0x' + h[3] + h[4]);
		b = 1 * ('0x' + h[5] + h[6]);
	}
	return [r, g, b];
}

function removeChild(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

function sentpost(url, obj, callback) {
	obj = obj || {};
	callback = callback || (() => { });
	let oReq = new XMLHttpRequest();
	oReq.open("POST", url, true);
	oReq.setRequestHeader('Content-Type', 'application/json');
	oReq.addEventListener("load", function () {
		if (this.status != 404) {
			callback(this.responseText);
		} else {
			callback('{}');
		}
	});
	oReq.addEventListener("error", function () {
		callback('{}');
	});
	oReq.send(JSON.stringify(obj));
}
