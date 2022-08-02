
const miModulo = (() => {
    'use strict'

    let deck = [];
    const   tipos = ['C','D','H','S'],
            especiales = ['A','J','Q','K'];

    let puntosJugadores = [];

    //REFERENCIAS DEL HTML
    const   btnNuevoJuego = document.querySelector('#btnNuevoJuego'),
            btnPedir = document.querySelector('#btnPedir'),
            btnDetener = document.querySelector('#btnDetener');

    const   divCartasJugadores = document.querySelectorAll('.divCartas'),
            puntosHTML = document.querySelectorAll('small');

    //Esta función inicializa el juego;
    const inicializarJuego = (numJugadores = 2) => {
        deck = crearDeck();
        puntosJugadores = [];
        for( let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach( elem => elem.innerHTML = '');
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }

    //Esta función crea una nueva baraja;
    const crearDeck = () => {

        deck = [];
        for (let i = 2; i <= 10; i++){
            for (let tipo of tipos) {
                deck.push( i + tipo );
            }
        }

        for (const tipo of tipos) {
            for (const esp of especiales) {
                deck.push( esp + tipo);
            }
        }

        return _.shuffle(deck);
    }

    //Esta función me permite tomar una carta;
    const pedirCarta = () => {

        if (deck.length === 0) {
            throw 'Ya no quedan cartas en la baraja';
        }
        return deck.pop();
    }

    // esta función sirve para cambiar los valores de las cartas y quite la letra;
    const valorCarta = ( carta ) => {
        const valor = carta.substring(0,carta.length - 1);  // sirve para sacar el ultimo caracter
        return ( isNaN(valor) )
        ? (valor === 'A') ? 11 : 10
        : valor * 1 ;
    }

    // Turno: 0 = Primer jugador y el ultimo será la computadora;
    const acumularPuntos = (carta,turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerHTML = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    //Turno de la computadora;
    const turnoComputadora = (puntosMinimos) => {

        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    }


    //Esta función evalúa quien es el ganador comparando puntaje;
    const determinarGanador = () => {

        const [ puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos) {
                Swal.fire(
                    'Hey!',
                    '¡Ámbos han empatado!',
                    'warning'
                )
            } else if (puntosMinimos > 21) {
                Swal.fire(
                    '¡Opss!',
                    'Te ha vencido la computadora',
                    'error'
                )
            } else if (puntosComputadora > 21) {
                Swal.fire(
                    '¡Bien Hecho!',
                    '¡Haz vencido a la computadora!',
                    'success'
                )
            } else {
                Swal.fire(
                    '¡Opss!',
                    'Te ha vencido la computadora',
                    'error'
                )
            }
        }, 100);
    }

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0);
        crearCarta(carta,0);

        //no sobrepasar los 21 puntos jugador
        if (puntosJugador > 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if ( puntosJugador === 21 ) {
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener('click', () => {

        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    return {
        nuevoJuego: inicializarJuego
    };

})();