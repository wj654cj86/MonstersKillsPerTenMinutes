function createtd(str, style) {
	let td = document.createElement('td');
	td.innerHTML = str;
	if (typeof style != 'undefined')
		td.className = style;
	return td;
}

function creatediv(str, style, width) {
	let td = createtd('', style);
	let div = document.createElement('div');
	div.innerHTML = str;
	if (typeof width != 'undefined')
		div.style.width = width + 'px';
	td.append(div);
	return td;
}

var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSplDOktwi4lBhEY3JqBbs5tdF4MrX_wBJ4u28c6IiO8xnhWPOc2FeSVBr7aNlfg4fVzdORQQ-qX0K-/pubhtml';
var 巴哈討論串 = 'https://forum.gamer.com.tw/C.php?page=1&bsn=7650&snA=995533&to=';

function createa(str, style, width) {
	let td = creatediv('', style, width);
	let div = td.getElementsByTagName('div')[0];
	let a = document.createElement('a');
	a.href = 巴哈討論串 + str.replace('★', '');
	a.innerHTML = '移至' + str.replace('★', '') + '樓';
	div.append(a);
	return td;
}

var 職業表 = [];
var 類型表 = {};
var 群體表 = {};

function 切換職業() {
	let 類型名稱 = 類型.value;
	let 群體名稱 = 群體.value;
	職業.innerHTML = '';
	let cnt = 0;
	for (let i = 0; i < 職業表.length; i++) {
		if ((類型名稱 == '全部' || 職業表[i].類型 == 類型名稱 || (職業表[i].類型 == '傑諾' && (類型名稱 == '盜賊' || 類型名稱 == '海盜')))
			&& (群體名稱 == '全部' || 職業表[i].群體 == 群體名稱)) {
			let op = document.createElement('option');
			op.value = 職業表[i].職業;
			op.innerHTML = 職業表[i].職業;
			職業.append(op);
			cnt++;
		}
	}
	if (cnt == 0) {
		let op = document.createElement('option');
		op.value = '沒有符合條件的職業';
		op.innerHTML = '沒有符合條件的職業';
		職業.append(op);
	}
}

var 資料表 = [];
var 地圖經驗表 = [];
var 區域表 = {};
var 資料載入中 = (() => {
	let tr = document.createElement('tr');
	let td = document.createElement('td');
	td.colSpan = 12;
	td.innerHTML = '資料載入中......';
	td.className = '偶數行';
	tr.append(td);
	return tr;
})();
var 沒有資料列 = (() => {
	let tr = document.createElement('tr');
	let td = document.createElement('td');
	td.colSpan = 12;
	td.innerHTML = '暫無資料';
	td.className = '偶數行';
	tr.append(td);
	return tr;
})();

var 顯示 = [];
var 怪物隻數隱藏表 = document.createElement('tbody');
function 列出怪物隻數() {
	let 職業名稱 = 職業.value;
	let 區域名稱 = 區域.value;
	顯示 = [];
	for (let i = 0; i < 資料表.length; i++) {
		if (資料表[i].職業 == 職業名稱
			&& (區域名稱 == '全部' || 區域名稱 == 資料表[i].區域)) {
			怪物隻數表.append(資料表[i].html);
			顯示.push(資料表[i]);
		} else {
			怪物隻數隱藏表.append(資料表[i].html);
		}
	}
	if (顯示.length == 0) {
		怪物隻數表.append(沒有資料列);
	} else {
		怪物隻數隱藏表.append(沒有資料列);
	}
	for (let k in 按鈕) {
		按鈕[k].innerHTML = '▲';
		順序[k] = true;
	}
	奇偶數行顏色設定();
	顯示經驗總值();
}

var 等差經驗增量 = [];

function 顯示經驗總值() {
	let 等級 = 玩家等級.value;
	if (isNaN(等級) || 等級 < 200) {
		玩家等級錯誤.innerHTML = '玩家等級錯誤';
		return;
	}
	玩家等級錯誤.innerHTML = '';
	for (let i = 0; i < 顯示.length; i++) {
		if (typeof 顯示[i].地圖經驗 == 'undefined') {
			顯示[i].經驗html.innerHTML = '未有地圖經驗';
			顯示[i].經驗值 = 0;
			continue;
		}
		// console.log(JSON.stringify(顯示[i].地圖經驗));
		let 等級差 = 等級 - 顯示[i].地圖經驗.A怪.等級;
		let j;
		for (j = 0; j < 等差經驗增量.length; j++) {
			if (等級差 >= 等差經驗增量[j].等級) {
				break;
			}
		}
		let 經驗 = 顯示[i].地圖經驗.A怪.經驗 * 等差經驗增量[j].經驗;
		if (typeof 顯示[i].地圖經驗.B怪 != 'undefined') {
			等級差 = 等級 - 顯示[i].地圖經驗.B怪.等級;
			for (j = 0; j < 等差經驗增量.length; j++) {
				if (等級差 >= 等差經驗增量[j].等級) {
					break;
				}
			}
			經驗 = (經驗 + 顯示[i].地圖經驗.B怪.經驗 * 等差經驗增量[j].經驗) / 2;
		}
		顯示[i].經驗值 = 經驗 * 顯示[i].擊殺數 / 1E8;
		顯示[i].經驗html.innerHTML = (顯示[i].經驗值).toFixed(2) + '億';
	}
}

function 奇偶數行顏色設定() {
	for (let i = 0; i < 顯示.length; i++) {
		let r = 顯示[i].html;
		if (i & 1) {
			r.className = '奇數行';
		} else {
			r.className = '偶數行';
		}
	}
}

function 重新顯示() {
	for (let i = 0; i < 顯示.length; i++) {
		怪物隻數表.append(顯示[i].html);
	}
	奇偶數行顏色設定();
}

let 順序 = {
	'地圖': true,
	'擊殺數': true,
	'經驗值': true
};
let 按鈕 = {};
function createth(str, style, width, cb) {
	let th = document.createElement('th');
	th.innerHTML = str + '  ';
	if (typeof style != 'undefined')
		th.className = style;
	if (typeof width != 'undefined')
		th.style.width = width + 'px';
	if (typeof cb != 'undefined') {
		let btn = document.createElement('button');
		btn.innerHTML = '▲';
		btn.onclick = cb;
		按鈕[str] = btn;
		th.append(btn);
	}
	return th;
}

function 排序(key) {
	順序[key] = !順序[key];
	for (let k in 按鈕) {
		if (k == key) continue;
		按鈕[k].innerHTML = '▲';
		順序[k] = true;
	}
	if (順序[key]) {
		按鈕[key].innerHTML = '▲';
		顯示.sort((a, b) => {
			if (a[key] < b[key])
				return -1;
			else if (a[key] > b[key])
				return 1;
			else
				return 0;
		});
	} else {
		按鈕[key].innerHTML = '▼';
		顯示.sort((a, b) => {
			if (a[key] < b[key])
				return 1;
			else if (a[key] > b[key])
				return -1;
			else
				return 0;
		});
	}
	重新顯示();
}

window.onload = async () => {
	類型.onchange = () => {
		切換職業();
		列出怪物隻數();
	};
	群體.onchange = () => {
		切換職業();
		列出怪物隻數();
	};
	職業.onchange = () => {
		列出怪物隻數();
	};
	區域.onchange = () => {
		列出怪物隻數();
	};
	玩家等級.onchange = () => {
		顯示經驗總值();
	};

	let tr = document.createElement('tr');
	tr.append(createth('樓層', null, 70));
	tr.append(createth('職業', null, 90));
	tr.append(createth('區域', null, 120, () => {
		排序('區域');
	}));
	tr.append(createth('地圖', null, 200, () => {
		排序('地圖');
	}));
	tr.append(createth('擊殺數', null, 100, () => {
		排序('擊殺數');
	}));
	tr.append(createth('經驗值', null, 100, () => {
		排序('經驗值');
	}));
	tr.append(createth('幽暗', null, 60));
	tr.append(createth('影片', null, 60));
	tr.append(createth('測試者', null, 150));
	tr.append(createth('備註', null, 170));
	tr.append(createth('版本', null, 200));
	tr.append(createth('巴哈連結', null, 100));
	怪物隻數表thead.append(tr);
	怪物隻數表.append(資料載入中);

	let htmlstr = await promise(openfile, url);
	let bodystr = htmlstr.slice(htmlstr.indexOf('<body'), htmlstr.indexOf('</body>') + '</body>'.length);
	let tbodyls = text2html(bodystr).getElementsByTagName('body')[0].getElementsByTagName('tbody');
	// console.log(bodystr);

	let trls = tbodyls[3].getElementsByTagName('tr');
	for (let i = 0; i < trls.length; i++) {
		let tdls = trls[i].getElementsByTagName('td');
		職業表[i] = {
			'職業': tdls[0].innerHTML,
			'類型': tdls[1].innerHTML,
			'群體': tdls[2].innerHTML
		};
		類型表[職業表[i].類型] = true;
		群體表[職業表[i].群體] = true;
	}
	職業表.shift();
	// console.log(JSON.stringify(職業表));
	// console.log(JSON.stringify(類型表));
	// console.log(JSON.stringify(群體表));
	for (let key in 類型表) {
		if (key == '類型') key = '全部';
		if (key == '傑諾') continue;
		let op = document.createElement('option');
		op.value = key;
		op.innerHTML = key;
		類型.append(op);
	}
	for (let key in 群體表) {
		if (key == '群體') key = '全部';
		let op = document.createElement('option');
		op.value = key;
		op.innerHTML = key;
		群體.append(op);
	}

	trls = tbodyls[2].getElementsByTagName('tr');
	for (let i = 0; i < trls.length; i++) {
		let tdls = trls[i].getElementsByTagName('td');
		地圖經驗表[i] = {
			'區域': tdls[0].innerHTML,
			'地圖': tdls[1].innerHTML,
			'A怪': {
				'等級': tdls[2].innerHTML,
				'經驗': tdls[3].innerHTML
			}
		};
		if (tdls[4].innerHTML != '') {
			地圖經驗表[i].B怪 = {
				'等級': tdls[4].innerHTML,
				'經驗': tdls[5].innerHTML
			}
		}
		區域表[地圖經驗表[i].區域] = true;
	}
	地圖經驗表.shift();
	// console.log(JSON.stringify(地圖經驗表));
	for (let key in 區域表) {
		if (key == '區域') key = '全部';
		let op = document.createElement('option');
		op.value = key;
		op.innerHTML = key;
		區域.append(op);
	}

	trls = tbodyls[4].getElementsByTagName('tr');
	for (let i = 0; i < trls.length; i++) {
		let tdls = trls[i].getElementsByTagName('td');
		等差經驗增量[i] = {
			'等級': tdls[0].innerHTML,
			'經驗': tdls[1].innerHTML
		};
	}
	等差經驗增量.shift();

	trls = tbodyls[0].getElementsByTagName('tr');
	for (let i = 0; i < trls.length; i++) {
		let tdls = trls[i].getElementsByTagName('td');
		資料表[i] = {
			'樓層': tdls[0].innerHTML,
			'職業': tdls[1].innerHTML,
			'地圖': tdls[2].innerHTML,
			'擊殺數': tdls[3].innerHTML * 1,
			'幽暗': tdls[4].innerHTML,
			'影片': tdls[5].innerHTML,
			'測試者': tdls[6].innerHTML,
			'備註': tdls[7].innerHTML,
			'版本': tdls[8].innerHTML
		};

		資料表[i].地圖經驗 = 地圖經驗表.find((e) => {
			return e.地圖 == 資料表[i].地圖;
		});

		let r = 資料表[i];
		if (typeof r.地圖經驗 == 'undefined')
			r.區域 = '資料庫未設置區域';
		else
			r.區域 = r.地圖經驗.區域;
		let tr = document.createElement('tr');
		tr.append(creatediv(r.樓層, null, 70));
		tr.append(creatediv(r.職業, null, 90));
		tr.append(creatediv(r.區域, null, 120));
		tr.append(creatediv(r.地圖, null, 200));
		tr.append(creatediv(r.擊殺數, null, 100));

		r.經驗html = creatediv('', null, 100);
		tr.append(r.經驗html);

		tr.append(creatediv(r.幽暗, null, 60));
		tr.append(creatediv(r.影片, null, 60));
		tr.append(creatediv(r.測試者, null, 150));
		tr.append(creatediv(r.備註, null, 170));
		tr.append(creatediv(r.版本, null, 200));
		tr.append(createa(r.樓層, null, 100));
		r.html = tr;
	}
	// console.log(JSON.stringify(資料表));

	怪物隻數隱藏表.append(資料載入中);
	切換職業();
	列出怪物隻數();
};