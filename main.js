var url = 'https://script.google.com/macros/s/AKfycbyyRfcTGy6wZPm5AWonzjdYwW1b1w-uvTnNvjs-GsRIyFSKqtJTB5Uz18fTnUkS8IUm/exec';
var 巴哈討論串 = 'https://forum.gamer.com.tw/C.php?bsn=7650&snA=995533&to=';

function creatediv(str) {
	let td = document.createElement('td');
	let div = document.createElement('div');
	div.innerHTML = str;
	td.append(div);
	return td;
}

function createa(str) {
	let td = creatediv('');
	let div = td.getElementsByTagName('div')[0];
	let a = document.createElement('a');
	a.href = 巴哈討論串 + str.replace('★', '');
	a.innerHTML = '移至' + str.replace('★', '') + '樓';
	div.append(a);
	return td;
}

function createop(str) {
	let op = document.createElement('option');
	op.value = str;
	op.innerHTML = str;
	return op;
}

var 職業表 = [];
var 職業隱藏 = document.createElement('select');
var 顯示職業 = [];
var 沒有符合職業 = { html: createop('沒有符合條件的職業') };
function 切換職業() {
	let 類型名稱 = 類型.value;
	let 群體名稱 = 群體.value;
	顯示職業 = [];
	for (let i = 0; i < 職業表.length; i++) {
		if (職業表[i].職業 == '全部顯示' || ((類型名稱 == '全部' || 職業表[i].類型 == 類型名稱 || (職業表[i].類型 == '傑諾' && (類型名稱 == '盜賊' || 類型名稱 == '海盜')))
			&& (群體名稱 == '全部' || 職業表[i].群體 == 群體名稱))) {
			職業.append(職業表[i].html);
			顯示職業.push(職業表[i]);
		} else {
			職業隱藏.append(職業表[i].html);
		}
	}
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

var 資料表 = [];
var 地圖經驗表 = [];
var 資料載入中 = (() => {
	let tr = document.createElement('tr');
	let td = document.createElement('td');
	td.colSpan = 13;
	td.innerHTML = '資料載入中......';
	tr.append(td);
	return tr;
})();
var 沒有資料列 = (() => {
	let tr = document.createElement('tr');
	let td = document.createElement('td');
	td.colSpan = 13;
	td.innerHTML = '暫無資料';
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
		if ((資料表[i].職業 == 職業名稱 || (職業名稱 == '全部顯示' && (() => {
			for (let v of 顯示職業)
				if (資料表[i].職業 == v.職業) return true;
			return false;
		})())) && (區域名稱 == '全部' || 區域名稱 == 資料表[i].區域)) {
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
	for (let i = 0; i < 顯示.length; i++) {
		顯示[i].擊殺html.innerHTML = 顯示[i].時間擊殺數 = 顯示[i].擊殺數 * 時間倍率;
	}
}

var 等差經驗增量 = [];
function 顯示經驗總值() {
	let 等級 = 玩家等級.value;
	let 經驗百分比 = 經驗量.value;
	if (isNaN(經驗百分比) || 經驗百分比 < 0) {
		經驗量錯誤.innerHTML = '經驗量錯誤';
		return;
	}
	經驗量錯誤.innerHTML = '';
	for (let i = 0; i < 顯示.length; i++) {
		if (顯示[i].地圖經驗 === undefined) {
			顯示[i].經驗html.innerHTML = '未有地圖經驗';
			顯示[i].經驗值 = 0;
			continue;
		}
		let 等級差 = 等級 - 顯示[i].地圖經驗.A怪.等級;
		let j;
		for (j = 0; j < 等差經驗增量.length; j++) {
			if (等級差 >= 等差經驗增量[j].等級) {
				break;
			}
		}
		let 經驗 = 顯示[i].地圖經驗.A怪.經驗 * 等差經驗增量[j].經驗;
		if (顯示[i].地圖經驗.B怪 !== undefined) {
			等級差 = 等級 - 顯示[i].地圖經驗.B怪.等級;
			for (j = 0; j < 等差經驗增量.length; j++) {
				if (等級差 >= 等差經驗增量[j].等級) {
					break;
				}
			}
			經驗 = (經驗 + 顯示[i].地圖經驗.B怪.經驗 * 等差經驗增量[j].經驗) / 2;
		}
		顯示[i].經驗值 = 經驗 * 顯示[i].時間擊殺數 * (1 + 經驗百分比 / 100) / 1E8;
		顯示[i].經驗html.innerHTML = (顯示[i].經驗值).toFixed(2) + '億';
	}
}

var 等差楓幣增量 = [];
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

	for (let i = 0; i < 顯示.length; i++) {
		if (顯示[i].地圖經驗 === undefined) {
			顯示[i].楓幣html.innerHTML = '未有怪物等級';
			顯示[i].楓幣量 = 0;
			continue;
		}
		let 等級差 = 等級 - 顯示[i].地圖經驗.A怪.等級;
		let j;
		for (j = 0; j < 等差楓幣增量.length; j++) {
			if (等級差 >= 等差楓幣增量[j].等級) {
				break;
			}
		}
		let 楓幣 = 7.5 * 顯示[i].地圖經驗.A怪.等級 * 等差楓幣增量[j].楓幣;
		if (顯示[i].地圖經驗.B怪 !== undefined) {
			等級差 = 等級 - 顯示[i].地圖經驗.B怪.等級;
			for (j = 0; j < 等差楓幣增量.length; j++) {
				if (等級差 >= 等差楓幣增量[j].等級) {
					break;
				}
			}
			楓幣 = (楓幣 + 7.5 * 顯示[i].地圖經驗.B怪.等級 * 等差楓幣增量[j].楓幣) / 2;
		}
		顯示[i].楓幣量 = 楓幣 * 實際掉寶率 * (1 + 楓幣百分比 / 100) * 顯示[i].時間擊殺數 / 1E4;
		顯示[i].楓幣html.innerHTML = (顯示[i].楓幣量).toFixed(0) + '萬';
	}
}

function 重新顯示() {
	for (let i = 0; i < 顯示.length; i++) {
		怪物隻數表.append(顯示[i].html);
	}
}

let 順序 = {};
let 按鈕 = {};
function createth(name, 排序按鈕) {
	let th = document.createElement('th');
	th.innerHTML = name;
	if (排序按鈕 === true) {
		th.innerHTML += ' ';
		let btn = document.createElement('button');
		btn.innerHTML = '▲';
		btn.onclick = () => 排序(name);
		按鈕[name] = btn;
		順序[name] = true;
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

function 表格寬度設定() {
	let 寬度 = [70, 90, 120, 200, 100, 100, 100, 40, 40, 150, 170, 200, 100];
	let outstr = '';
	for (let i = 0; i < 寬度.length; i++) {
		outstr += `#主要表 table th:nth-child(${i + 1}),`
			+ `#主要表 table tr td:nth-child(${i + 1}) div`
			+ `{width:${寬度[i]}px;}\n`;
	}
	let style = document.createElement('style');
	style.innerHTML = outstr;
	document.head.append(style);
}

window.onload = async () => {
	表格寬度設定();
	類型.onchange = 切換職業;
	群體.onchange = 切換職業;
	職業.onchange = 列出怪物隻數;
	區域.onchange = 列出怪物隻數;
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
	tr.append(createth('版本'));
	tr.append(createth('巴哈連結'));
	怪物隻數表thead.append(tr);
	怪物隻數表.append(資料載入中);

	let obj = JSON.parse(await promise(openfile, url));
	// console.log(obj);

	let page = obj[3];
	let 類型表 = {};
	let 群體表 = {};
	for (let i = 0; i < page.length; i++) {
		let row = page[i];
		職業表[i] = {
			'職業': row[0],
			'類型': row[1],
			'群體': row[2]
		};
		if (職業表[i].職業 == '職業') 職業表[i].職業 = '全部顯示';
		職業表[i].html = createop(職業表[i].職業);
		類型表[職業表[i].類型] = true;
		群體表[職業表[i].群體] = true;
	}
	// console.log(JSON.stringify(職業表));
	// console.log(JSON.stringify(類型表));
	// console.log(JSON.stringify(群體表));
	for (let key in 類型表) {
		if (key == '類型') key = '全部';
		if (key == '傑諾') continue;
		類型.append(createop(key));
	}
	for (let key in 群體表) {
		if (key == '群體') key = '全部';
		群體.append(createop(key));
	}

	page = obj[2];
	let 區域表 = {};
	for (let i = 0; i < page.length; i++) {
		let row = page[i];
		地圖經驗表[i] = {
			'區域': row[0],
			'地圖': row[1],
			'A怪': {
				'等級': row[2],
				'經驗': row[3]
			}
		};
		if (row[4] != '') {
			地圖經驗表[i].B怪 = {
				'等級': row[4],
				'經驗': row[5]
			}
		}
		區域表[地圖經驗表[i].區域] = true;
	}
	地圖經驗表.shift();
	// console.log(JSON.stringify(地圖經驗表));
	for (let key in 區域表) {
		if (key == '區域') key = '全部';
		區域.append(createop(key));
	}

	page = obj[4];
	for (let i = 0; i < page.length; i++) {
		let row = page[i];
		等差經驗增量[i] = {
			'等級': row[0],
			'經驗': row[1]
		};
	}
	等差經驗增量.shift();

	page = obj[1];
	for (let i = 0; i < page.length; i++) {
		let row = page[i];
		等差楓幣增量[i] = {
			'等級': row[0],
			'楓幣': row[1]
		};
	}
	等差楓幣增量.shift();

	page = obj[0];
	for (let i = 0; i < page.length; i++) {
		let row = page[i];
		資料表[i] = {
			'樓層': row[0],
			'職業': row[1],
			'地圖': row[2],
			'擊殺數': row[3] * 1,
			'幽暗': row[4],
			'影片': row[5],
			'測試者': row[6],
			'備註': row[7],
			'版本': row[8]
		};

		資料表[i].地圖經驗 = 地圖經驗表.find((e) => {
			return e.地圖 == 資料表[i].地圖;
		});

		let r = 資料表[i];
		if (r.地圖經驗 === undefined)
			r.區域 = '資料庫未設置區域';
		else
			r.區域 = r.地圖經驗.區域;
		let tr = document.createElement('tr');
		tr.append(creatediv(r.樓層));
		tr.append(creatediv(r.職業));
		tr.append(creatediv(r.區域));
		tr.append(creatediv(r.地圖));

		r.擊殺html = creatediv('');
		tr.append(r.擊殺html);

		r.經驗html = creatediv('');
		tr.append(r.經驗html);

		r.楓幣html = creatediv('');
		tr.append(r.楓幣html);

		tr.append(creatediv(r.幽暗));
		tr.append(creatediv(r.影片));
		tr.append(creatediv(r.測試者));
		tr.append(creatediv(r.備註));
		tr.append(creatediv(r.版本));
		tr.append(createa(r.樓層));
		r.html = tr;
	}
	資料表.shift();
	// console.log(JSON.stringify(資料表));

	怪物隻數隱藏表.append(資料載入中);
	切換職業();
};