
// Disable right click
document.addEventListener('contextmenu', event => event.preventDefault());

// Declare card symbols
let cards = ["1", "1", "2", "2", "3", "3", "4", "4", "5", "5", "6", "6", "7", "7", "8", "8", "9", "9", "10", "10", "11", "11", "12", "12"]; //

// Create array to hold opened cards
let openCard = [];
let moves = 0;
let starts = 3;
let matchFound = 0;
let startGame = false;
let starRating = "3";
let timer;
let toplistSaved=false;
let thisPlace=1000;

// Shuffle cards (function from http://stackoverflow.com/a/2450976)
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Create each card's HTMl
function createCard() {
  let cardList = shuffle(cards);
  cardList.forEach(function(card) {
    $(".deck").append('<li><i class="card fa ' + card + '"><img src="img/' + card + '.png" style="max-width:90%;max-height:90%;"></i></li>');
  })
}

// Logic to find matching cards
function findMatch() {
  // Show cards on click
  $(".card").on("click", function() {
    if ($(this).hasClass("open show")) { return; }
    $(this).toggleClass("flipInY open show");
    openCard.push($(this));
    startGame = true;
   // Check if classlist matches when openCard length == 2
    if (openCard.length === 2) {
      if (openCard[0][0].classList[2] === openCard[1][0].classList[2]) {
      openCard[0][0].classList.add("bounceIn", "match");
      openCard[1][0].classList.add("bounceIn", "match");
      $(openCard[0]).off('click');
      $(openCard[1]).off('click');
      matchFound += 1;
      moves++;
      removeOpenCards();
      findWinner();
      } else {
      // If classes don't match, add "wrong" class
      openCard[0][0].classList.add("shake", "wrong");
      openCard[1][0].classList.add("shake", "wrong");
      // Set timeout to remove "show" and "open" class
      moves++;
      }
    }
    if (openCard.length === 3) {
      // Close open cards
      removeClasses();
      // Open new card
      $(this).toggleClass("flipInY open show");
    }
  updateMoves();
  })
}

// Update HTML with number of moves
function updateMoves() {
/*  if (moves === 1) {
    $("#movesText").text(" Move");
  } else {
    $("#movesText").text(" Moves");
  }
*/
  $("#moves").text(moves.toString());
/*
  if (moves > 0 && moves < 16) {
    starRating = starRating;
  } else if (moves >= 16 && moves <= 20) {
    $("#starOne").removeClass("fa-star");
    starRating = "2";
  } else if (moves > 20) {
    $("#starTwo").removeClass("fa-star");
    starRating = "1";
  }
  */
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays=15) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function saveTopList(toplistArray){
	setCookie("toplist",JSON.stringify(toplistArray));
}

function fillToplistTable(toplistArray,thisPlace){
	for (i = 0; i < toplistArray.length; i++) { 
		if(thisPlace!=i){
  			$('#toplist-table tr:last').after('<tr><td>'+(i+1)+'.</td><td>'+toplistArray[i].split("|")[0]+'</td><td>'+toplistArray[i].split("|")[1]+'</td></tr>');
		}else{
			$('#toplist-table tr:last').after('<tr><td>'+(i+1)+'.</td><td><input type="text" name="thisname" id="thisname" /></td><td>'+toplistArray[i].split("|")[1]+'</td></tr>');
			
			$("#play-again-btn").on("click", function() {
				if(toplistSaved==false){
					toplistSaved=true;
			   		toplistArray.splice(thisPlace, 1, $("#thisname").val()+'|'+thisScore);
					saveTopList(toplistArray);
				}
			});
	    	
	    	$('#thisname').on('keypress', function (e) {
		        if(e.which === 13){
		            //Disable textbox to prevent multiple submit
		            $(this).attr("disabled", "disabled");
		            if(toplistSaved==false){
		            toplistSaved=true;
		            toplistArray.splice(thisPlace, 1, $(this).val()+'|'+thisScore);
		            saveTopList(toplistArray);
		        	}
				}
			});
		}
	}
}

function restart() {
   location.reload();
}

// Open popup when game is complete source: www.w3schools.com
function findWinner() {

  if (matchFound === 12) {

	thisScore=(moves*2)+parseInt(winSeconds, 10);

  	if(getCookie("toplist")!=""){
  		toplistArray=JSON.parse(getCookie("toplist"));

  		for (i = 0; i < toplistArray.length; i++) { 
  			if(thisScore<toplistArray[i].split("|")[1]){
  				thisPlace=i;
				toplistArray.splice(i, 0, 'Névtelen|'+thisScore);
				toplistArray=toplistArray.slice(0, 10);
				break;
  			}
			if(i==toplistArray.length-1&&toplistArray.length<10){
				thisPlace=i+1;
				toplistArray.splice(i+1, 0, 'Névtelen|'+thisScore);
				break;
			}
  		}
  		fillToplistTable(toplistArray,thisPlace);
  	}else{
  		toplistArray=['Névtelen|'+thisScore]
  		fillToplistTable(toplistArray,0);
  	}

    var modal = document.getElementById('win-popup');
    var span = document.getElementsByClassName("close")[0];

    $("#total-moves").text(moves);
    $("#total-stars").text(starRating);

    modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

   $("#play-again-btn").on("click", function() {
   		setTimeout(restart, 100);
   });

   clearInterval(timer);

 }
}

// Reset openCard.length to 0
function removeOpenCards() {
  if (openCard.length === 3) {
    openCard = [openCard[2]];
  }else{
    openCard = [];
  }
}

// Remove all classes except "match"
function removeClasses() {
  $(".card").removeClass("show open flipInY bounceIn shake wrong");
  removeOpenCards();
}

// Disable clicks
function disableClick() {
 openCard.forEach(function (card) {
   card.off("click");
  })
}

// Start timer on the first card click
function startTimer() {
  let clicks = 0;
  $(".card").on("click", function() {
    clicks += 1;
    if (clicks === 1) {
      var sec = 0;
      function time ( val ) { return val > 9 ? val : "0" + val; }
      timer = setInterval( function(){
        $(".seconds").html(time(++sec % 60));
        $(".minutes").html(time(parseInt(sec / 60, 10)));
        $(".win-seconds").html(parseInt(time(sec),10));
        winSeconds=parseInt(time(sec),10);
      }, 1000);
    }
  })
 }

// Call functions
shuffle(cards);
createCard();
findMatch();
startTimer();

// Function to restart the game on icon click
function restartGame() {
  $("#restart").on("click", function() {
      location.reload()
  });
  }

restartGame();





/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
