set = {}; known = [];

// settings here:

set[147] = [
	{r: 0.5},
	{r: 2, iv: -3}
]

set[148] = [
	{r: 0.5},
	{r: 2, iv: -3}
]

set[149] = [
	{r: 1},
	{r: 5, iv: -6}
]

set[143] = [
	{r: 1},
	{r: 2, iv: -3},
	{r: 2, cp: 2500}
]

set[113] = [
	{r: 1},
	{r: 2, iv: -3},
	{r: 2, cp: 1000}
]

perfect_r = 0.5;
home_lat = 0; home_lng = 0;
access_token = '0';

// 1) converts timecodes into legible times (call with no parameter for time now)
function time(timecode) {
    if (typeof timecode == 'undefined') {var date = new Date();} else {var date = new Date(timecode);};
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

// 2) converts Pokemon spawns into notifications
function tell(pokemon) {
	var url = 'http://www.google.com/maps/place/' + pokemon.center.lat + ',' + pokemon.center.lng;
	var iv_text = ''; var cp_text = ''; var moves_text = '';
	if (pokemon.attack != -1 && pokemon.defence != -1 && pokemon.stamina != -1){
		iv_text = Math.round(((pokemon.attack + pokemon.defence + pokemon.stamina)/45)*100) + '% | ';
	}
	if (pokemon.cp != -1) {cp_text = pokemon.cp + 'CP | '};
	if (pokemon.move1 != -1 && pokemon.move2 != -1) {moves_text = '; ' + movesDict[pokemon.move1] + ' / ' + movesDict[pokemon.move2]};
	var expiry_time = time(pokemon.despawn*1000);
	var rem_time = timeToString(pokemon.remainingTime());
	var notif = pokeDict[pokemon.id].name+' | ' + iv_text + cp_text + item.r.toFixed(2)+'km | '+rem_time+' (until '+expiry_time+')';
	return [notif, url + moves_text]
}

// 3) sends messages to Pushbullet
function notifyPB(title, body) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', "https://api.pushbullet.com/v2/pushes", true);
    xhr.setRequestHeader('Access-Token', access_token);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send('{"body":"' + body + '","title":"' + title + '","type":"note"}');
    console.log(title);
}

// 4) polls the map for relevant Pokemon
function poll() {
	active = [];
	for (i = 0, len1 = this.pokemons.length; i < len1; i++) {
		test = this.pokemons[i];
		test.x = Math.abs(test.center.lat - home_lat) * 110.574;
		test.y = Math.abs(test.center.lng - home_lng) * 69.298;
		test.r = Math.sqrt(test.x*test.x + test.y*test.y);
		test.iv = test.attack + test.defence + test.stamina - 45;
		
		if (test.r < perfect_r && test.iv == 0) {active.push(test); continue};
		
		if (!!set[test.id]) {
			for (j = 0, len2 = set[test.id].length; j < len2; j++) {
				filter = set[test.id][j];
				if (!filter.r) {filter.r = 100}; if (!filter.iv) {filter.iv = -48};	if (!filter.cp) {filter.cp = -1};
				if (test.r < filter.r && test.iv >= filter.iv && test.cp >= filter.cp) {active.push(test); break}
			}
		}
	}
	
	output = [];
	for (i = 0, len = active.length; i < len; i++) {
		test = active[i];
		if (indexOfPokemons(test,known) == -1) {
			known.push(test);
			output.push(test);
		}
	}
	return output
}

// 5) sends lists of Pokemon out
function mail(list) {
	if (list.length != 0) {
		item = list.pop();
		notif = tell(item);
		notifyPB(notif[0],notif[1]);
		setTimeout(function(){mail(list)}, 1.2*1000);
	}
}

// A) main code
notifyPB('Percy is go!', 'Home: http://www.google.com/maps/place/'+home_lat+','+home_lng);
function loop() {
	mail(poll());
	console.log('Ran at '+time()+' | Home: '+home_lat+','+home_lng);
}
setTimeout(loop, 5 * 1000); var timer = setInterval(loop, 30 * 1000);
