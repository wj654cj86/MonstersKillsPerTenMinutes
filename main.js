function createth(str, style, width, cb) {
	let th = document.createElement('th');
	th.innerHTML = str;
	if (typeof style != 'undefined')
		th.className = style;
	if (typeof width != 'undefined')
		th.style.width = width + 'px';
	if (typeof cb != 'undefined')
		th.onclick = cb;
	return th;
}

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

var job = {
	'劍士': ['英雄', '聖騎士', '黑騎士', '聖魂劍士', '米哈逸', '狂狼勇士', '爆拳槍神', '惡魔殺手', '惡魔復仇者', '凱薩', '神之子', '阿戴爾', '劍豪', '皮卡啾'],
	'法師': ['火毒', '冰雷', '主教', '烈焰巫師', '龍魔導士', '夜光', '煉獄巫師', '凱內西斯', '伊利恩', '陰陽師', '幻獸師'],
	'弓箭手': ['箭神', '神射手', '開拓者', '破風使者', '精靈遊俠', '狂豹獵人', '卡音'],
	'盜賊': ['夜使者', '暗影神偷', '影武者', '暗夜行者', '幻影俠盜', '傑諾', '卡蒂娜', '虎影'],
	'海盜': ['拳霸', '槍神', '重砲指揮官', '閃雷悍將', '隱月', '機甲戰神', '傑諾', '天使破壞者', '亞克', '墨玄', '雪吉拉', '傑特']
};

function 切換職業(jobname) {
	職業.innerHTML = '';
	if (jobname in job) {
		let jobls = job[jobname];
		for (let val of jobls) {
			let op = document.createElement('option');
			op.value = val;
			op.innerHTML = val;
			職業.append(op);
		}
	}
}

var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSplDOktwi4lBhEY3JqBbs5tdF4MrX_wBJ4u28c6IiO8xnhWPOc2FeSVBr7aNlfg4fVzdORQQ-qX0K-/pubhtml';
var 巴哈討論串 = 'https://forum.gamer.com.tw/C.php?page=1&bsn=7650&snA=995533&to=';

function createa(str, style, width) {
	let td = creatediv('', style, width);
	let div = td.getElementsByTagName('div')[0];
	let a = document.createElement('a');
	a.href = 巴哈討論串 + str.replace('★', '');
	a.innerHTML = str;
	div.append(a);
	return td;
}

var 資料表 = [];
var 地圖經驗表 = [];
var 資料載入中 = (() => {
	let tr = document.createElement('tr');
	let td = document.createElement('td');
	td.colSpan = 10;
	td.innerHTML = '資料載入中......';
	td.className = '偶數行';
	tr.append(td);
	return tr;
})();
var 沒有資料列 = (() => {
	let tr = document.createElement('tr');
	let td = document.createElement('td');
	td.colSpan = 10;
	td.innerHTML = '暫無資料';
	td.className = '偶數行';
	tr.append(td);
	return tr;
})();

var 顯示 = [];
var 怪物隻數隱藏表 = document.createElement('tbody');
function 列出怪物隻數(jobname) {
	顯示 = [];
	for (let i = 0; i < 資料表.length; i++) {
		if (資料表[i].職業 == jobname) {
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
	奇偶數行顏色設定();
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

function 排序(key) {
	順序[key] = !順序[key];
	if (順序[key]) {
		顯示.sort((a, b) => {
			if (a[key] < b[key])
				return -1;
			else if (a[key] > b[key])
				return 1;
			else
				return 0;
		});
	} else {
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
	for (let key in job) {
		let op = document.createElement('option');
		op.value = key;
		op.innerHTML = key;
		職業群.append(op);
	}
	切換職業(職業群.value);

	職業群.onchange = () => {
		切換職業(職業群.value);
		列出怪物隻數(職業.value);
	};
	職業.onchange = () => {
		列出怪物隻數(職業.value);
	};

	let tr = document.createElement('tr');
	tr.append(createth('巴哈連結', null, 100));
	tr.append(createth('職業', null, 80));
	tr.append(createth('地圖', null, 150, () => {
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
	tr.append(createth('備註', null, 200));
	tr.append(createth('版本', null, 200));
	怪物隻數表thead.append(tr);
	怪物隻數表.append(資料載入中);

	let htmlstr = await promise(openfile, url);
	let loadtrls = (n) => {
		let tbodybegin, tbodyend = 0;
		for (let i = 0; i < n; i++) {
			tbodyend = htmlstr.indexOf('</tbody>', tbodyend) + '</tbody>'.length;
		}
		tbodybegin = htmlstr.indexOf('<tbody>', tbodyend);
		tbodyend = htmlstr.indexOf('</tbody>', tbodyend) + '</tbody>'.length;
		return text2xml(htmlstr.slice(tbodybegin, tbodyend)).getElementsByTagName('tbody')[0].getElementsByTagName('tr');
	};
	let trls = loadtrls(1);

	for (let i = 0; i < trls.length; i++) {
		let tdls = trls[i].getElementsByTagName('td');
		地圖經驗表[i] = {
			'地圖': tdls[0].innerHTML,
			'經驗': tdls[1].innerHTML
		};
	}
	// console.log(JSON.stringify(地圖經驗表));

	trls = loadtrls(0);
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

		let ef = 地圖經驗表.find((e) => {
			return e.地圖 == 資料表[i].地圖;
		});

		if (typeof ef == 'undefined')
			資料表[i].經驗值 = '未有平均經驗'
		else {
			資料表[i].經驗值 = (ef.經驗 * 資料表[i].擊殺數 / 1E8).toFixed(2) * 1;
		}

		let r = 資料表[i];
		let tr = document.createElement('tr');
		tr.append(createa(r.樓層, null, 100));
		tr.append(creatediv(r.職業, null, 80));
		tr.append(creatediv(r.地圖, null, 150));
		tr.append(creatediv(r.擊殺數, null, 100));
		tr.append(creatediv(typeof r.經驗值 == 'number' ? r.經驗值.toFixed(2) + '億' : r.經驗值, null, 100));
		tr.append(creatediv(r.幽暗, null, 60));
		tr.append(creatediv(r.影片, null, 60));
		tr.append(creatediv(r.測試者, null, 150));
		tr.append(creatediv(r.備註, null, 200));
		tr.append(creatediv(r.版本, null, 200));
		r.html = tr;
	}
	// console.log(JSON.stringify(資料表));

	怪物隻數隱藏表.append(資料載入中);
	列出怪物隻數(職業.value);
};