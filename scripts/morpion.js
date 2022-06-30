$(document).ready(function() {
    $.fn.morpion = function(options = {}) {
       
        options = $.extend({}, { replayButton: '#replay' }, options);
       let player = 1;
       let self = this;
       let rows = $(this).find('.row');
       let cells = $(this).find('.cell');
       let winnerDisplay = $(this).find('.win-display');

       
       let replay = $(options.replayButton);  // Bouton pour relancer la partie

        let currentPlayer = 1;   // Joueur en cours

        // Pour chaque ligne de la grille...
        $(rows).each(function(y, row) {
        
            $(row)
                .find('.cell')
                .each(function(x, cell) {
                    
                    $(cell).data('y', y);
                    $(cell).data('x', x);
                });
        });

        // Au clic sur le bouton replay
        $(replay).click(function() {
            $(cells).each(function(_, cell) {
                // On supprime les données du jeu précedent
                $(cell).removeData('player');
                $(cell).text('');
            });

           
        });

       
        function checkLine(x, y, dx, dy) {
            let current = null;

            for (let i = 0; i < 3; i++) {
              
               let cell = cells[y * 3 + x];

                if (current === null) {
                   
                    current = $(cell).data('player');
                }

             
                if ($(cell).data('player') !== current) {
                    return null;
                }

                /*
                 dx et dy permettent de déterminer les déplacements dans la grille
                 L'attribut dx indique un décalage sur l'axe x de la position d'un élément ou de son contenu. */
                x += dx; 
                y += dy;
            }

        
            return current;
        }

        // Fonction pour  verification s'il y a un gagnant
        function checkWin(cell) {
            
           let x = $(cell).data('x');
           let y = $(cell).data('y');

             // vérification:- Vertical,Horizontal,Diagonale droite,Diagonale gauche */  function checkHori() {

           let result =
                checkLine(x, 0, 0, 1) ||
                checkLine(0, y, 1, 0) ||
                checkLine(0, 0, 1, 1) ||
                checkLine(2, 0, -1, 1);

            if (result) {
                // Affichage du gagnant
                $(winnerDisplay).text(`Joueur ${result} a gagné !`);
                $(self).addClass('won');
            }

            return result;
        }

        
        function checkFull() {
            for (let i = 0; i < $(cells).length; i++) {
                if (!$(cells[i]).data('player')) return false;
            }

            return true;
        }

        // Au clic sur les cases
        $(cells).click(function() {
           

            // Affichage du X ou O et ajout du numÃ©ro du joueur dans data('player')
            $(this).text(currentPlayer === 1 ? 'X' : 'O');
            $(this).data('player', currentPlayer);

            // Alternance entre les joueurs
            currentPlayer = currentPlayer === 1 ? 2 : 1;

            // Vérification des gagnants
            
            if (!checkWin(this) && checkFull()) {
                // Affichage du match nul
                $(winnerDisplay).text('Match nul');
                $(self).addClass('won');
            }
        });
    };

    $('#grid').morpion({ replayButton: '#replay' });

    
});