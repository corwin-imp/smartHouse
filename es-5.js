function Devices(name){ 
  this.name = name;
  this._power = false;
  this._choose = 0;
  this._list = [];
}

Devices.prototype.choose = function(choose){
	if(!this._power){throw new Error("powerError");}
	if(choose ===undefined){
		return this._choose;
	}else{	
		 if(this._list.indexOf(choose) != -1){
			this._choose = choose;
		 }else{
			throw new Error("not in list");
		 }
	}
}

Devices.prototype.list = function(list){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	if(list ===undefined){
		return this._choose;
	}else{
		if(Array.isArray(list)){ 
			this._list = list;
		}else{
			throw new Error("list must be array");
		}
	} 
}

Devices.prototype.toString = function(){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	var strList = this._list.join(',');
	return    " /текущий выбор: " + this._choose + " /cписок: ("+ strList +" )";
}

Devices.prototype.power = function(power){ // тут уже все методы
	if(power ===undefined){
		throw new Error(" power must be bool");
	}else{
		if(typeof power =="boolean"){
			this._power = power;
		}
	}
}

function GamePlayer(name,sysReq, volumeM){
	Devices.call(this,name);
	this.Mvol = volumeM;
	this._saves = [];  
	this._saveCount = 0;
	this._playing = false;
	this._sysReq = sysReq;
}

GamePlayer.prototype = Object.create(Devices.prototype);
GamePlayer.prototype.constructor = GamePlayer;

GamePlayer.prototype.choose = function(choose, reqGame){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	if(reqGame > this._sysReq){
		throw new Error("sysReq");
	}else{
		this._sysReq = true;
		Devices.prototype.choose.call(this,choose);  
	}	
}

GamePlayer.prototype.play = function(){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	if(this._choose && this._sysReq){
		this._playing = true;	
	}
}

GamePlayer.prototype.stopGame = function(){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	if(this._playing){
		var key = this._choose;
		
		if(this._saves[key]){
		  this._saves[key] = ++this._saves[key] ;
		}else{
		  this._saves[key] = 1 ;
		} 	
		
		++this._saveCount; 
		this._playing = false;
		
	}else{
  		throw new Error("game not start");
	}
}

GamePlayer.prototype.toString = function(){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
		var messD = Devices.prototype.toString.call(this); 
		var messV = this.Mvol.toString();  
		var strSaves = '';
		for (var prop in this._saves) {
			strSaves += prop + " : " + this._saves[prop] + ",";
    	}
		strSaves = strSaves.slice(0, -1);
		return " /sysReq: " + this._sysReq + " " + " /is playing: " +  this._playing +
		" /saves: " + " ( " + strSaves + " )" + messD + this.Mvol;
}

GamePlayer.prototype.volume = function(volume){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	this.Mvol.volume(volume);
}

function AudioPlayer(name,volumeM){
	Devices.call(this,name);
	this._volumeM = volumeM;
	this._playing = false;
}

AudioPlayer.prototype = Object.create(Devices.prototype);
AudioPlayer.prototype.constructor = AudioPlayer;

AudioPlayer.prototype.volume = function(volume){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	this._volumeM.volume(volume);
	
}

AudioPlayer.prototype.choose = function(choose){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	this._playing = true;
	Devices.prototype.choose.call(this,choose); 
	
}

AudioPlayer.prototype.play = function(choose){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	if(this._choose){
	  	this._playing = true;
	}else{ 
		throw new Error("choose song");
	}
}

AudioPlayer.prototype.pause = function(choose){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	if(this._playing){
	  this._playing = false;
	}
} 

AudioPlayer.prototype.toString = function(){ // тут уже все методы
	if(!this._power){throw new Error("powerError");}
	var messD = Devices.prototype.toString.call(this); 
	return  messD + this._volumeM + ' /isPlaying:  ' +  this._playing; 
	// где он подхватывает, что надо выхвать toString y this._volumeM.
}

function VolumeM(){
	//tv,audio,game
	this._volume = 0;
}

VolumeM.prototype.volume = function(volume){ // тут уже все методы
	if(volume === undefined){
		return this._volume;
	}else{
		this._volume = volume;
	}
}

VolumeM.prototype.toString = function(){ // тут уже все методы
	return " /volume:  " + this._volume;
}

var volumeModule = new VolumeM();

var gamePlayer = new GamePlayer("SonyGame",3,volumeModule);
//gamePlayer.volume(20); // --> power off
//console.log(gamePlayer);  
gamePlayer.power(true);  
gamePlayer.volume(20); // power on
var listGames = ['dota', 'nfs'];
gamePlayer.list(listGames); // power on
gamePlayer.choose('dota',1);  
gamePlayer.play(); 
gamePlayer.stopGame();  
gamePlayer.play(); 
gamePlayer.choose('nfs',1); 
gamePlayer.stopGame();   
//console.log(gamePlayer.toString());   


var player = new AudioPlayer("SonyPlayer",volumeModule);

//player.volume(20); // --> power off
player.power(true);    
var listMusic = ['Muse', 'RHCP', 'RATM'];
player.list(listMusic); 
console.log(player);  
player.choose('Muse');  
player.pause();  
console.log(player.toString()); 


player.power(false);  
//console.log(player.toString()); 
 
