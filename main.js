let url = 'https://script.google.com/macros/s/AKfycbyyRfcTGy6wZPm5AWonzjdYwW1b1w-uvTnNvjs-GsRIyFSKqtJTB5Uz18fTnUkS8IUm/exec';
let 巴哈討論串 = 'https://forum.gamer.com.tw/C.php?bsn=7650&snA=995533&to=';

let creatediv = str => text2html(`<td><div title="${str}">${str}</div></td>`);
let createa = str => text2html(`<td><div><a title="移至${str}樓" href="${巴哈討論串 + str}">移至${str}樓</a></div></td>`);
let createop = str => text2html(`<option value="${str}">${str}</option>`);
let createlongtd = str => text2html(`<tr><td colspan="14">${str}</td></tr>`);

function createshow(obj, name) {
	let td = creatediv('');
	let div = td.querySelector('div');
	Object.defineProperty(obj, name, { set: str => div.title = div.innerHTML = str });
	return td;
}

let 職業表 = [];
let 職業隱藏 = document.createElement('select');
let 顯示職業 = [];
let 沒有符合職業 = { html: createop('沒有符合條件的職業') };
function 切換職業() {
	let 類型名稱 = 類型.value;
	let 群體名稱 = 群體.value;
	顯示職業 = [];
	職業表.forEach(v => {
		if (v.職業 == '全部' || ((類型名稱 == '全部' || v.類型 == 類型名稱 || (v.類型 == '傑諾' && (類型名稱 == '盜賊' || 類型名稱 == '海盜')))
			&& (群體名稱 == '全部' || v.群體 == 群體名稱))) {
			職業.append(v.html);
			顯示職業.push(v);
		} else {
			職業隱藏.append(v.html);
		}
	});
	if (顯示職業.length == 1) {
		職業.append(沒有符合職業.html);
		顯示職業 = [沒有符合職業];
		職業隱藏.append(職業表[0].html);
	} else {
		職業隱藏.append(沒有符合職業.html);
	}
	職業.value = 顯示職業[0].html.value;
	列出怪物隻數();
}

let 資料表 = [];
let 地圖經驗表 = [];
let 資料載入中 = createlongtd('資料載入中......');
let 沒有資料列 = createlongtd('暫無資料');

let 顯示 = [];
let 怪物隻數隱藏表 = document.createElement('tbody');
function 列出怪物隻數() {
	let 職業名稱 = 職業.value;
	let 區域名稱 = 區域.value;
	let 版號名稱 = 版號.value;
	顯示 = [];
	資料表.forEach(v => {
		if ((v.職業 == 職業名稱 || (職業名稱 == '全部' && 顯示職業.find(e => e.職業 == v.職業) !== undefined))
			&& (區域名稱 == '全部' || 區域名稱 == v.區域)
			&& (版號名稱 == '全部' || (版號名稱 == '舊版本' && v.版號 == "") || 版號名稱 == v.版號)) {
			怪物隻數表.append(v.html);
			顯示.push(v);
		} else {
			怪物隻數隱藏表.append(v.html);
		}
	});
	if (顯示.length == 0) {
		怪物隻數表.append(沒有資料列);
	} else {
		怪物隻數隱藏表.append(沒有資料列);
	}
	順序.forEach((v, k) => 順序[k] = true);
	顯示經驗與楓幣();
}

function 顯示經驗與楓幣() {
	let 等級 = 玩家等級.value;
	if (isNaN(等級) || 等級 < 200) {
		玩家等級錯誤.innerHTML = '玩家等級錯誤';
		return;
	}
	玩家等級錯誤.innerHTML = '';
	let 小時 = 時間小時.value;
	if (isNaN(小時) || 小時 < 0) {
		時間小時錯誤.innerHTML = '小時錯誤';
		return;
	}
	時間小時錯誤.innerHTML = '';
	let 分鐘 = 時間分鐘.value;
	if (isNaN(分鐘) || 分鐘 < 0) {
		時間分鐘錯誤.innerHTML = '分鐘錯誤';
		return;
	}
	時間分鐘錯誤.innerHTML = '';
	顯示擊殺總值();
	顯示經驗總值();
	顯示楓幣總值();
}

function 顯示擊殺總值() {
	let 時間倍率 = (時間小時.value * 60 + 時間分鐘.value * 1) / 10;
	顯示.forEach(v => v.擊殺數顯示 = v.時間擊殺數 = (v.擊殺數 * 時間倍率).toFixed(0));
}

let 等差經驗增量 = [];
function 顯示經驗總值() {
	let 等級 = 玩家等級.value;
	let 經驗百分比 = 經驗量.value;
	if (isNaN(經驗百分比) || 經驗百分比 < 0) {
		經驗量錯誤.innerHTML = '經驗量錯誤';
		return;
	}
	經驗量錯誤.innerHTML = '';
	顯示.forEach(v => {
		if (v.地圖經驗 === undefined) {
			v.經驗值顯示 = '未有地圖經驗';
			v.經驗值 = 0;
			return;
		}
		let 等級差 = 等級 - v.地圖經驗.A怪.等級;
		let 經驗 = v.地圖經驗.A怪.經驗 * 等差經驗增量.find(e => 等級差 >= e.等級).經驗;
		if (v.地圖經驗.B怪 !== undefined) {
			等級差 = 等級 - v.地圖經驗.B怪.等級;
			經驗 = (經驗 + v.地圖經驗.B怪.經驗 * 等差經驗增量.find(e => 等級差 >= e.等級).經驗) / 2;
		}
		v.經驗值 = 經驗 * v.時間擊殺數 * (1 + 經驗百分比 / 100) / 1E8;
		v.經驗值顯示 = (v.經驗值).toFixed(2) + '億';
	});
}

let 等差楓幣增量 = [];
function 顯示楓幣總值() {
	let 等級 = 玩家等級.value;
	let 掉寶百分比 = 掉寶率.value;
	if (isNaN(掉寶百分比) || 掉寶百分比 < 0) {
		掉寶率錯誤.innerHTML = '掉寶率錯誤';
		return;
	}
	掉寶率錯誤.innerHTML = '';
	let 實際掉寶率 = 0.6 * (1 + 掉寶百分比 / 100);
	if (實際掉寶率 > 1)
		實際掉寶率 = 1;
	let 楓幣百分比 = 楓幣量.value;
	if (isNaN(楓幣百分比) || 楓幣百分比 < 0) {
		楓幣量錯誤.innerHTML = '楓幣量錯誤';
		return;
	}
	楓幣量錯誤.innerHTML = '';
	顯示.forEach(v => {
		if (v.地圖經驗 === undefined) {
			v.楓幣量顯示 = '未有怪物等級';
			v.楓幣量 = 0;
			return;
		}
		let 等級差 = 等級 - v.地圖經驗.A怪.等級;
		let 楓幣 = 7.5 * v.地圖經驗.A怪.等級 * 等差楓幣增量.find(e => 等級差 >= e.等級).楓幣;
		if (v.地圖經驗.B怪 !== undefined) {
			等級差 = 等級 - v.地圖經驗.B怪.等級;
			楓幣 = (楓幣 + 7.5 * v.地圖經驗.B怪.等級 * 等差楓幣增量.find(e => 等級差 >= e.等級).楓幣) / 2;
		}
		v.楓幣量 = 楓幣 * 實際掉寶率 * (1 + 楓幣百分比 / 100) * v.時間擊殺數 / 1E4;
		v.楓幣量顯示 = (v.楓幣量).toFixed(0) + '萬';
	});
}

let 順序 = {};
function createth(name, 排序按鈕) {
	let th = text2html(`<th>${name}</th>`);
	if (排序按鈕 === true) {
		let bb = true;
		let btn = text2html(`<button>▲</button>`);
		btn.onclick = () => 排序(name);
		Object.defineProperty(順序, name, {
			set: b => btn.innerHTML = (bb = b) ? '▲' : '▼',
			get: () => bb,
			enumerable: true
		});
		th.append(' ', btn);
	}
	return th;
}

function 排序(key) {
	順序.forEach((v, k) => 順序[k] = k == key ? !順序[k] : true);
	if (順序[key]) {
		顯示.sort((a, b) => a[key] == b[key] ? 0 : a[key] > b[key] ? 1 : -1);
	} else {
		顯示.sort((a, b) => b[key] == a[key] ? 0 : b[key] > a[key] ? 1 : -1);
	}
	顯示.forEach(e => 怪物隻數表.append(e.html));
}

document.head.append(text2html(`<style>${[50, 100, 120, 200, 100, 100, 100, 40, 40, 120, 180, 80, 150, 100]
	.reduce((a, v, i) => a + `#主要表 table th:nth-child(${i + 1}),#主要表 table tr td:nth-child(${i + 1}) div{width:${v}px;}\n`, '')}</style>`));

類型.onchange = 切換職業;
群體.onchange = 切換職業;
職業.onchange = 列出怪物隻數;
區域.onchange = 列出怪物隻數;
版號.onchange = 列出怪物隻數;
時間小時.onchange = 顯示經驗與楓幣;
時間分鐘.onchange = 顯示經驗與楓幣;
玩家等級.onchange = 顯示經驗與楓幣;
經驗量.onchange = 顯示經驗與楓幣;
掉寶率.onchange = 顯示經驗與楓幣;
楓幣量.onchange = 顯示經驗與楓幣;

let tr = document.createElement('tr');
tr.append(createth('樓層'));
tr.append(createth('職業'));
tr.append(createth('區域', true));
tr.append(createth('地圖', true));
tr.append(createth('擊殺數', true));
tr.append(createth('經驗值', true));
tr.append(createth('楓幣量', true));
tr.append(createth('幽暗'));
tr.append(createth('影片'));
tr.append(createth('測試者'));
tr.append(createth('備註'));
tr.append(createth('版號', true));
tr.append(createth('版本'));
tr.append(createth('巴哈連結'));
怪物隻數表thead.append(tr);
怪物隻數表.append(資料載入中);

let obj = await loadfile('json', url);
// console.log(obj);

職業表 = obj[3].map(row => ({
	'職業': row[0],
	'類型': row[1],
	'群體': row[2]
}));
let 類型表 = {};
let 群體表 = {};
職業表.forEach(v => {
	if (v.職業 == '職業') v.職業 = '全部';
	v.html = createop(v.職業);
	類型表[v.類型] = true;
	群體表[v.群體] = true;
});
// console.log(職業表);
// console.log(類型表);
// console.log(群體表);
類型表.forEach((v, key) => {
	if (key == '類型') key = '全部';
	if (key == '傑諾') return;
	類型.append(createop(key));
});
群體表.forEach((v, key) => {
	if (key == '群體') key = '全部';
	群體.append(createop(key));
});

let 區域表 = {};
地圖經驗表 = obj[2].map(row => {
	let r = {
		'區域': row[0],
		'地圖': row[1],
		'A怪': {
			'等級': row[2],
			'經驗': row[3]
		}
	};
	if (row[4] != '') {
		r.B怪 = {
			'等級': row[4],
			'經驗': row[5]
		}
	}
	區域表[r.區域] = true;
	return r;
});
地圖經驗表.shift();
// console.log(地圖經驗表);
// console.log(區域表);
區域表.forEach((v, key) => {
	if (key == '區域') key = '全部';
	區域.append(createop(key));
});

等差經驗增量 = obj[4].map(row => ({
	'等級': row[0],
	'經驗': row[1]
}));
等差經驗增量.shift();
// console.log(等差經驗增量);

等差楓幣增量 = obj[1].map(row => ({
	'等級': row[0],
	'楓幣': row[1]
}));
等差楓幣增量.shift();
// console.log(等差楓幣增量);

let 版號表 = {};
資料表 = obj[0].map(row => {
	let r = {
		'樓層': row[0],
		'職業': row[1],
		'地圖': row[2],
		'擊殺數': row[3],
		'幽暗': row[4],
		'影片': row[5],
		'測試者': row[6],
		'備註': row[7]
	};
	r.地圖經驗 = 地圖經驗表.find(e => e.地圖 == r.地圖);
	r.區域 = r.地圖經驗 === undefined ? '資料庫未設置區域' : r.地圖經驗.區域;
	let 版本說明 = row[8].replace(/ \/ /g, '/').split('/');
	r.版號 = 版本說明[0];
	版號表[r.版號] = true;
	r.版本 = 版本說明.length == 2 ? 版本說明[1] : '';

	let tr = document.createElement('tr');
	tr.append(creatediv(r.樓層));
	tr.append(creatediv(r.職業));
	tr.append(creatediv(r.區域));
	tr.append(creatediv(r.地圖));
	tr.append(createshow(r, '擊殺數顯示'));
	tr.append(createshow(r, '經驗值顯示'));
	tr.append(createshow(r, '楓幣量顯示'));
	tr.append(creatediv(r.幽暗));
	tr.append(creatediv(r.影片));
	tr.append(creatediv(r.測試者));
	tr.append(creatediv(r.備註));
	tr.append(creatediv(r.版號));
	tr.append(creatediv(r.版本));
	tr.append(createa(r.樓層));
	r.html = tr;
	return r;
});
資料表.shift();
// console.log(資料表);
let 版號arr = [];
版號表.forEach((v, key) => {
	if (key == "版本") return;
	if (key == "") return;
	版號arr.push(key);
});
版號arr.sort();
版號arr.unshift("全部", "舊版本");
版號arr.forEach(v => 版號.append(createop(v)));
// console.log(版號表);

怪物隻數隱藏表.append(資料載入中);
切換職業();
