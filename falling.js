// GLOBAIS
var TELA_LARGURA	= 700;
var TELA_ALTURA	= 400;
var TAXA_ATUALIZACAO = 1;

// Constantes para o desenrolar do jogo
var COLIDIU = false; //indica se o jogador pegou a Elemento
var FIM_DE_JOGO = false; //indica fim de jogo
// Controla a dificuldade do jogo 
var DIFICULDADE = 1; //é a taxa de dificuldade, funciona de forma inversamente proporcional, quanto menor mais dificil fica
var FACILIDADE  = 0; //é a taxa de facilidade do jogo, funciona de forma inversa tambem

// Gloabl animation holder
var player = new Array();

// Função para reiniciar o jogo
function reiniciar(){
	window.location.reload();
};

//JOGADOR
function Jogador( nodo ){

	this.nodo = nodo; //Instancia atual
	this.vidas = 3; //Numero de aceitação de Elementos podres 
	this.pontos = 0;
	
	//Usada para decrementar a vidas 
	this.dano = function(){
		this.vidas--;
		if (this.vidas == 0){
			FIM_DE_JOGO = true;
			return true;
		}			
		return false;
	};
	
	//Pontua os pontos de cada Elemento coletada
	this.pontua = function( pontos ){
		this.pontos += pontos;
	}
	
	//Recomeça o jogo 
	this.recomecar = function(){
		this.vidas = 3;
		$(this.nodo).fadeTo(0, 0.5); 
		return false;
	};
	
	return true;
}

//Elemento
function Elemento( nodo ){
	this.speedx	= 0; //velocidade eixo x
	this.speedy	= -5; //velocidade eixo y
	this.nodo = $(nodo); //Instancia atual
	this.pontos = 10; //quantidades de pontos fornecidos ao ser coletada (padrão 10)
	this.tipo = 'bom';
	
	//Atualização
	this.updateX = function(){
		this.nodo.x(this.speedx, true);
	};
	
	this.updateY= function(){
		var newpos = parseInt(this.node.css("top"))+this.speedy;
		this.nodo.y(this.speedy, true);
	};
}

//Elementos Bons
function ElementoBom( nodo ){
	this.nodo = $(nodo); //Instancia atual
}
ElementoBom.prototype = new Elemento(); //Herança do elemento
ElementoBom.prototype.tipo = 'bom'; //Reescrevendo o tipo

//Elementos ruins
function ElementoRuim( nodo ){
	this.nodo = $(nodo); //Instancia atual
}
ElementoRuim.prototype = new Elemento();// Herança de Elemento
ElementoRuim.prototype.tipo = 'ruim';//Reescrevendo o tipo
ElementoRuim.prototype.pontos = -30;

//MOTOR DO GAME
$(function(){
	//DECLARAÇÕES
	
	// O fundo do game
	var fundo = new $.gQ.Animation({imageURL: "sprites/background.jpg"});
	//player
	player["spin_idle"] = new $.gQ.Animation({imageURL: "sprites/spin_waiting.png", numberOfFrame: 2, delta: 47, rate: 1, type: $.gQ.ANIMATION_VERTICAL});
	player["spin_turn_right"] = new $.gQ.Animation({imageURL: "sprites/spin_turn_right.png", numberOfFrame: 2, delta: 47, rate: 1, type: $.gQ.ANIMATION_VERTICAL});
	player["spin_turn_left"] = new $.gQ.Animation({imageURL: "sprites/spin_turn_left.png", numberOfFrame: 2, delta: 47, rate: 1, type: $.gQ.ANIMATION_VERTICAL});
	player["ball_turn_right"] = new $.gQ.Animation({imageURL: "sprites/ball_turn_right.png", numberOfFrame: 3, delta: 26, rate: 60, type: $.gQ.ANIMATION_VERTICAL});
	player["ball_turn_left"] = new $.gQ.Animation({imageURL: "sprites/ball_turn_left.png", numberOfFrame: 3, delta: 26, rate: 60, type: $.gQ.ANIMATION_VERTICAL});
	//Elemento bom
	var elementobom = new $.gQ.Animation({imageURL: "sprites/ElementoBom.png"});
	//Elemento ruim
	var elementoruim = new $.gQ.Animation({imageURL: "sprites/ElementoRuim.png"});
	
	// Inicialização do espaço amostral do jogo:
	$("#espaco").playground({ width: TELA_LARGURA, height: TELA_ALTURA, keyTracker: true});
	
	// Inicialização das camadas	
	$.playground().addGroup("fundo", {width: TELA_LARGURA, height: TELA_ALTURA})
						.addSprite("fundo", {animation: fundo, width: TELA_LARGURA, height: TELA_ALTURA})
					.end()
					.addGroup("jogador", {posx: TELA_LARGURA/2, posy: TELA_ALTURA-100, width: TELA_LARGURA, height: TELA_ALTURA})
						.addSprite("player", {animation: player["spin_idle"], posx: 0, posy: 0, width: 33, height: 47})
					.end()
					.addGroup("elementos", {width: TELA_LARGURA, height: TELA_ALTURA})
					.end()
					.addGroup("alerta",{width: TELA_LARGURA, height: TELA_ALTURA});
						
	//Quando o botão de novo jogo for clicado
	$("#novojogo").click(function(){
		$.playground().startGame(function(){
			$('#menuinicial').children().remove();
			$("#menuinicial").fadeTo(500,0,function(){$(this).remove();});
		});
	})
	
	//Instancia o novo jogador
	$("#jogador")[0].jogador = new Jogador($("#jogador"));	
	
	//Contador de pontos
	$("#alerta").append("<div id='contadorvidas'style='color: #000; width: 100px; position: absolute; font-family: verdana, sans-serif;'></div><div id='contadorpontos'style='color: #000; width: 100px; position: absolute; right: 0px; font-family: verdana, sans-serif;'></div>");
	
	//Método que controla o loop principal
	$.playground().registerCallback(function(){
		if(!FIM_DE_JOGO){
			$("#contadorvidas").html("Vidas: "+$("#jogador")[0].jogador.vidas);
			$("#contadorpontos").html("Pontos: "+$("#jogador")[0].jogador.pontos);
			
			//Movimentação do jogador
			if(jQuery.gameQuery.keyTracker[65]){ //FOI PARA ESQUERDA! apertou letra (a)
				var proxpos = $("#jogador").x()-5;
				if(proxpos > 0){
					$("#jogador").x(proxpos);
				}
			}
			if(jQuery.gameQuery.keyTracker[68]){ //FOI PARA DIREITA! apertou letra (d)
				var proxpos = $("#jogador").x()+5;
				if(proxpos < TELA_LARGURA - 100){
					$("#jogador").x(proxpos);
				}
			}
		}
		
		//Atualiza a movimentação das Elementos
		$(".elemento").each(function(l, j){
			var objeto = j;  //pega a instancia da Elemento em questão
			
			var posy = $(this).y();
			if(posy > 300){ //Remove as Elementos que ultrapassarem do final da tela
				$(this).remove();
				return;
			}
			$(this).y(+5+parseInt(10*FACILIDADE), true);//realiza a movimentação no eixo y
			
			//Teste de colisão
			var colidiu = $(this).collision("#player,."+$.gQ.groupCssClass);
			if(colidiu.length > 0){
				//O player pegou uma Elemento
				tipo = objeto.elemento.tipo;
				//verifica se foi Elemento ruim
				if( tipo == 'ruim' ){
					if( $("#jogador")[0].jogador.dano() ){		//causa o dano no jogador
						$("#contadorvidas").html("Vidas: "+$("#jogador")[0].jogador.vidas);	//atualiza o contador de vidas
						//apresenta tela de fim de jogo
						$("#espaco").append('<div style="position: absolute; top: 50px; width: 700px; color: #fff; font-family: verdana, sans-serif;"><center><h1>Fim de Jogo</h1><br><a style="cursor: pointer;" id="btnreiniciar">Recomeçar</a></center></div>');
						$("#btnreiniciar").click( reiniciar );
						//remove os elementos anteriores
						$("#jogador,#Elementos").fadeTo(1000,0);
						$("#fundo").fadeTo(5000,0);
					}
				}
				
				$("#jogador")[0].jogador.pontua( j.elemento.pontos );
				
				$(this).remove();
			}
		});
	}, TAXA_ATUALIZACAO);
	
	//Chamada de teclado em background
	$(document).keyup(function(e){
		if(!FIM_DE_JOGO){
			switch(e.keyCode){
				case 65: //this is left! (a)
					$("#player").setAnimation(player["spin_idle"]);
					break;
				case 68: //this is right (d)
					$("#player").setAnimation(player["spin_idle"]);
					break;
			}
		}
	});
	
	//this is where the keybinding occurs
	$(document).keydown(function(e){
		if(!FIM_DE_JOGO){
			switch(e.keyCode){
				case 65: //this is left! (a)
					$("#player").setAnimation(player["spin_turn_left"]);
					break;
				case 68: //this is right (d)
					$("#player").setAnimation(player["spin_turn_right"]);
					break;
			}
		}
	});
	//Criação das Elementos
	$.playground().registerCallback(function(){
		if(!FIM_DE_JOGO){ //se não for fim de jogo
			if(Math.random().toFixed(2) > FACILIDADE.toFixed(2)){// criação de Elementos bons
				var name = "elemento_"+Math.ceil(Math.random()*1000);
				//inicia a criação sempre no topo do espaço, apenas mudando a posição horizontal
				$("#elementos").addSprite(name, {animation: elementobom, posx: Math.random()*TELA_LARGURA, posy: -50,width: 44, height: 37});
				$("#"+name).addClass("elemento");
				$("#"+name)[0].elemento = new ElementoBom($("#"+name));
			} else if (Math.random().toFixed(2) > DIFICULDADE.toFixed(2)){// criação de Elementos ruins
				var name = "elemento_"+Math.ceil(Math.random()*1000);
				//inicia a criação sempre no topo do espaço, apenas mudando a posição horizontal
				$("#elementos").addSprite(name, {animation: elementoruim, posx: Math.random()*TELA_LARGURA, posy: -50,width: 64, height: 59});
				$("#"+name).addClass("elemento");
				$("#"+name)[0].elemento = new ElementoRuim($("#"+name));
			}
		}
	}, 500);
	
	//A cada 10segundos aumenta a dificuldade 
	$.playground().registerCallback(function(){
		if( DIFICULDADE > 0.1 && FACILIDADE < 0.9 ){
			DIFICULDADE = DIFICULDADE - 0.1;
			FACILIDADE = FACILIDADE + 0.1;		
		}
	}, 10000);
});