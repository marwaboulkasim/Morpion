$(document).ready(function() {
    // DÃ©finition d'un plugin jQuery `morpion`
    $.fn.morpion = function(options = {}) {
        // Gestion des options par dÃ©faut du plugin
        options = $.extend({}, { replayButton: '#replay' }, options);

        // RÃ©fÃ©rence Ã  `this` (la grille)
        const self = this;

        // Liste de toutes les lignes
        const rows = $(this).find('.row');

        // Liste de toutes les cases
        const cells = $(this).find('.cell');

        // Zone d'affichage du gagnant
        const winnerDisplay = $(this).find('.win-display');

        // Bouton pour relancer la partie
        const replay = $(options.replayButton);

        // Joueur en cours
        let currentPlayer = 1;

        // Pour chaque ligne de la grille...
        $(rows).each(function(y, row) {
            // ...et chaque case dans la ligne
            $(row)
                .find('.cell')
                .each(function(x, cell) {
                    // On assigne les coordonnÃ©es xy (rÃ©utilisÃ©es plus tard)
                    $(cell).data('y', y);
                    $(cell).data('x', x);
                });
        });

        // Au clic sur le bouton replay
        $(replay).click(function() {
            $(cells).each(function(_, cell) {
                // On supprime les donnÃ©es du jeu prÃ©cÃ©dent
                $(cell).removeData('player');
                $(cell).text('');
            });

            // On enlÃ¨ve la classe .won pour cacher l'affichage des rÃ©sultats
            $(self).removeClass('won');
        });

        /**
         * DÃ©tecte si un joueur a rempli toutes les cases dans une ligne donnÃ©e
         * Fonctionne avec les lignes, colonnes et diagonales en fonction des paramÃ¨tres passÃ©s
         *
         * @param x  - Position en X de la ligne
         * @param y  - Position en Y de la ligne
         * @param dx - Mouvement Ã  faire en X Ã  chaque boucle
         * @param dy - Mouvement Ã  faire en Y Ã  chaque boucle
         */
        function checkLine(x, y, dx, dy) {
            let current = null;

            for (let i = 0; i < 3; i++) {
                /*
                 * RÃ©cupÃ©ration de la case en cours depuis ses coordonÃ©es XY
                 *
                 * Position = Largeur * Y + X
                 * Exemple : Y = 1, X = 2, Position = 1 * 3 + 2 = 5
                 *
                 * |0|1|2|
                 * |3|4|5| <- La case est bien ici
                 * |6|7|8|
                 */
                const cell = cells[y * 3 + x];

                if (current === null) {
                    // On rÃ©cupÃ¨re le joueur de la premiÃ¨re case
                    // (Si current est null alors on a pas encore trouvÃ© de joueur)
                    current = $(cell).data('player');
                }

                // Si le joueur de la case en cours n'est pas le mÃªme que current,
                // personne n'a gagnÃ© dans la ligne en cours
                if ($(cell).data('player') !== current) {
                    return null;
                }

                /*
                 * On ajoute dx et dy aux coordonÃ©es
                 * dx et dy permettent de dÃ©terminer les dÃ©placements dans la grille
                 *
                 * dx=0;  dy=1 -> DÃ©placement vertical
                 * dx=1;  dy=0 -> DÃ©placement horizontal
                 * dx=1;  dy=1 -> DÃ©placement diagonal (vers la droite)
                 * dx=-1; dy=1 -> DÃ©placement diagonal (vers la gauche)
                 */
                x += dx;
                y += dy;
            }

            // On retourne le joueur trouvÃ©
            return current;
        }

        // Fonction pour vÃ©rifier s'il y a un gagnant
        function checkWin(cell) {
            // On rÃ©cupÃ¨re les coordonÃ©es de la case cliquÃ©e
            const x = $(cell).data('x');
            const y = $(cell).data('y');

            /*
             * checkLine retoune le numÃ©ro du gagnant un NULL si personne n'a gagnÃ© dans la ligne
             * null || null || 1 || null === 1
             *
             * Ordre de vÃ©rification:
             *  - Vertical
             *  - Horizontal
             *  - Diagonale droite
             *  - Diagonale gauche
             */
            const result =
                checkLine(x, 0, 0, 1) ||
                checkLine(0, y, 1, 0) ||
                checkLine(0, 0, 1, 1) ||
                checkLine(2, 0, -1, 1);

            // Si on a un rÃ©sultat, alors on a trouvÃ© un joueur gagnant
            if (result) {
                // Affichage du gagnant
                $(winnerDisplay).text(`Joueur ${result} a gagnÃ© !`);
                $(self).addClass('won');
            }

            return result;
        }

        // Permet de vÃ©rifier si la grille est pleine
        function checkFull() {
            for (let i = 0; i < $(cells).length; i++) {
                // Si la case n'a pas Ã©tÃ© jouÃ©e, la grille n'est pas pleine
                if (!$(cells[i]).data('player')) return false;
            }

            return true;
        }

        // Au clic sur les cases
        $(cells).click(function() {
            // Si un joueur a dÃ©jÃ  jouÃ© ici, on ne fait rien
            if ($(this).data('player')) return;

            // Affichage du X ou O et ajout du numÃ©ro du joueur dans data('player')
            $(this).text(currentPlayer === 1 ? 'X' : 'O');
            $(this).data('player', currentPlayer);

            // Alternance entre les joueurs
            currentPlayer = currentPlayer === 1 ? 2 : 1;

            // VÃ©rification des gagnants
            //
            // S'il n'y a pas de gagnants et que la grille est vide
            if (!checkWin(this) && checkFull()) {
                // Affichage du match nul
                $(winnerDisplay).text('Match nul');
                $(self).addClass('won');
            }
        });
    };

    // Appel du plugin
    $('#grid').morpion({ replayButton: '#replay' });
});