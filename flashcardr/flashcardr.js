// Våra glosor.
var capitals = ["Amsterdam", "Andorra la Vella", "Ankara", "Aten", "Baku", "Belgrad", "Berlin", "Bern", "Bratislava", "Bryssel", "Budapest", "Bukarest", "Chişinău", "Dublin", "Helsingfors", "Jerevan", "Kiev", "Köpenhamn", "Lissabon", "Ljubljana", "London", "Luxemburg", "Madrid", "Minsk", "Monaco", "Moskva", "Nicosia", "Oslo", "Paris", "Podgorica", "Prag", "Pristina", "Reykjavik", "Riga", "Rom", "San Marino", "Sarajevo", "Skopje", "Sofia", "Stockholm", "Tallinn", "Tbilisi", "Tirana", "Vaduz", "Valletta", "Vatikanstaden", "Vilnius", "Warszawa", "Wien", "Zagreb"];
var countries = ["Nederländerna", "Andorra", "Turkiet", "Grekland", "Azerbajdzjan", "Serbien", "Tyskland", "Schweiz", "Slovakien", "Belgien", "Ungern", "Rumänien", "Moldavien", "Irland", "Finland", "Armenien", "Ukraina", "Danmark", "Portugal", "Slovenien", "Storbritannien", "Luxemburg", "Spanien", "Vitryssland", "Monaco", "Ryssland", "Cypern", "Norge", "Frankrike", "Montenegro", "Tjeckien", "Kosovo", "Island", "Lettland", "Italien", "San Marino", "Bosnien och Hercegovina", "Makedonien", "Bulgarien", "Sverige", "Estland", "Georgien", "Albanien", "Liechtenstein", "Malta", "Vatikanstaten", "Litauen", "Polen", "Österrike", "Kroatien"];

// Hit stoppar vi glosorna efter vi valt hur många
var fronts = [];
var backs = [];

// I denna array sparas svaren som man matar in.
var svar = [];
// Vilket index i arrayen med glosord vi är på.
var currIdx = 0;

/**
 * Updaterar kortet med datan från våra glosor givet ett visst index.
 * @param idx Indexet för ordet som vi vill ska visas.
 */
var showCard = function(idx) {
  $(".front").text(fronts[idx]);
  $(".back").text(backs[idx]);
};

/**
 * Gå till nästa kort. När denna funktion körs, räknar vi ut vilket som är det
 * nästa kort som ska visas, och visar det. När alla kort gåtts igenom så
 * börjar vi om från det första kortet.
 */
var nextCard = function() {
  // Låt aldrig currIdx överstiga antalet element i arrayen fronts.
  currIdx = (currIdx+1) % fronts.length;
  showCard(currIdx);
};

/**
 * Startar glosföhöret. Här ändrar vi funktioner på knapparna så att man kan
 * mata in svar, inte vänta på kortet (inget fusk!). När man matar in orden
 * i svarsrutan så sparar vi undan svaren i en separat array.
 */
var startTest = function() {
  // Visa svars-rutan när denna funktion körs.
  $(".answer").show();
  // Göm test-knappen.
  $(".test").hide();
  // Det ska ej gå att kolla på baksidan med svaren på.
  $(".flipper").removeClass("flipper");
  // Istället för att köra nextCard funktionen, så kör vi saveAndClear
  // funktionen istället.
  $(".next").off("click", nextCard);
  $(".next").on("click", saveAndClear);
  
  // Börja om, så att testet alltid börjar på det första kortet
  currIdx = 0;
  showCard(currIdx);

  // Gör att det går att skriva på en gång, istället för att först trycka i rutan.
  $(".answer").focus();

  // Koppla enter-knappen till saveAndClear funktionen, så att man kan trycka
  // enter när man skrivit klart, och inte behöver trycka på next.
  $(".answer").keypress(function(event) {
    // 13 är charCode för "Enter"
    if (event.charCode == 13) {
      saveAndClear();
    }
  });
}

/**
 * Räknar ut poängen för testet.
 * @returns Poängen
 */
var calculateScore = function() {
  var score = 0;
  for (var i = 0; i < fronts.length; i++) {
    if (isCorrect(svar[i], backs[i])) {
      score++;
    }
  }
  return score;
};

/**
 * Jämför det inmatade värdet med det rätta svaret.
 * @param answer Det inmatade värdet
 * @param correctAnswer Det rätta värdet
 * @returns true om answer är samma som correctAnswer
 */
var isCorrect = function(answer, correctAnswer) {
  // Vi sänker bokstäverna, så vi blir oberoende av att det är små eller
  // stora bokstäver. 
  return answer.toLowerCase() == correctAnswer.toLowerCase();
};

/**
 * Visar resultattabllen.
 */
var generateResultList = function() {
  // Skapar kolumnrubrikerna i tabllen.
  $(".resultList").append(
    "<tr>"+
      "<th>Question</th>"+
      "<th>Answer</th>"+
      "<th>Your Answer</th>"+
      "<th></th>"+
    "</tr>"
  );

  // Loopar över alla glosor och genererar HTML för en rad i resultattabellen. 
  for (var i = 0; i < fronts.length; i++) {
    var rightWrong; 
    if (isCorrect(svar[i], backs[i])) {
      rightWrong="&check;";
    } else {
      rightWrong="&cross;";
    }
    $(".resultList").append(
      "<tr>"+
        "<td>"+fronts[i]+"</td>"+
        "<td>"+backs[i]+"</td>"+
        "<td>"+svar[i]+"</td>"+
        "<td>"+rightWrong+"</td>"+
      "</tr>"
    );
  }
};

/**
 * Visar resultatet av glosförhöret. Vi gömmer även korten.
 */
var showResultPage = function() {
  // Gömmer saker vi inte längre behöver
  $(".next").hide();
  $(".flip-container").hide();
  $(".answer").hide();

  // Visar resultatprylar
  $(".resultBoard").show();
  $(".testAgain").show();

  // Räkna ut poängen
  var score = calculateScore();

  // Visa hur många rätt man hade
  $(".score").text("Correct answers: " + score + "/" + fronts.length);
  
  // När man trycker på "Test Again" så laddar vi om sidan så allt körs igen.
  $(".testAgain").on("click", function() {
    window.location.reload();
  });

  // Skapar och visar resultat-tabellen
  generateResultList();
}

/**
 * Sparar inmatningen från svarsrutan, tömmer svarsrutan och går till nästa
 * kort. När man kommit till slutet av gloslistan så går vi till resultat-
 * sidan istället.
 */
var saveAndClear = function() {
  // Hämta användares svar från inmatingsrutan och spara det in svars-arrayen
  // med det nuvarande indexet.
  svar[currIdx] = $(".answer").val();

  // Töm inmatningsrutan.
  $(".answer").val("");

  // När testet är på sista kortet, så går vi vidare till resultatsidan.
  if (currIdx == (fronts.length-1)) {
    showResultPage();
  }
  // Annars fortsätter vi till nästa 'kort'
  else {
    nextCard();
  }
  // Ge fokus till inmatningsrutan.
  $(".answer").focus();
}

/**
 * Kollar om n är ett nummer.
 * Från http://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
 * @param n nånting som vi vill veta om det är ett nummer
 * @returns true om det är ett nummer, annars false
 */
var isNumber = function(n) {
  return !isNaN(parseFloat(n));
}

// HÄR BÖRJAR PROGRAMMET

// Anropar nextCard-funktionen när "Next-knappen" trycks.
$(".next").on("click", nextCard);

// Anropar startTest-funktionen när 'Start-knappen' trycks.
$(".test").on("click", startTest);

// Göm saker vi inte behöver just nu.
$(".answer").hide();
$(".testAgain").hide();
$(".resultBoard").hide();

// Fråga hur många länder som ska testas. 
var count = prompt("How many cards?");

// Om count är mindre än 3 eller om det inte är en bokstav.
if (count < 3 || !isNumber(count)) {
  alert("Input must be a number greater than 3");
  window.location.reload();
}

// Slumpa ut count antal kort
for (var i = 0; i < count; i++) {
  // Slumpmässigt index från 0 till så många länder vi har
  var idx = Math.floor(Math.random() * countries.length);
  fronts.push(countries[idx]);
  backs.push(capitals[idx]);
}

// Visar första kortet. Let the games begin!
showCard(0);
