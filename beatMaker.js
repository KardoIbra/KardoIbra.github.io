class Drumkit {
  //lager en constructor funksjon, hvor man kan generere nye objeter fra den.
  constructor() {
    //henter alle divenene som skal spilles.
    this.diver = document.querySelectorAll(".pad");
    //Henter knappen
    this.spilleKnapp = document.querySelector(".spill");
    this.currentKick = "./sounds/kick-classic.wav";
    this.currentSnare = "./sounds/snare-acoustic01.wav";
    this.currentHihat = "./sounds/hihat-acoustic01.wav";
    //henter all audio
    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");
    //vil spore etter hverandre. Dette er for en slags loop over diver.
    this.index = 0;
    //hastighet på lyd
    this.bpm = 150;
    //default
    this.isPlaying = null;
    //henter alle tre selectene som er uten klasse
    this.selects = document.querySelectorAll("select");
    this.stumKnapp = document.querySelectorAll(".mute");
    this.tempoSkyveKnapp = document.querySelector(".tempo-slider");
  }
  activePad() {
    this.classList.toggle("active");
  }
  repeat() {
    /*lager på en måte en loop. Når vi er i den 8ende, vil index-en bli til 0. altså starte igjen.
    Fordi her bruker vi modolus.
 */
    let step = this.index % 8;
    /*Nå har vi en slags spor fra 0 - 7 når den når 8 resettes det til 1. 
    vi kan bruke dette til å velge klassene vi lagde. step er som sagt fra 0- 7
    men vi setter det til en del av klassen vi lagde slik at denne loopen looper over 
    alle divene som har klasse som tilsvarer .b${step}. på den måten kav vi loope over 
    alle divene. Man kan godt lage mange andre diver også, samtidig som vi må øke indexen til 
    loopen. På den måten kan vi loope over hvor mange diver vi ønsker.  */
    let aktiverteDiver = document.querySelectorAll(`.b${step}`);
    //Looper over diver
    aktiverteDiver.forEach((divv) => {
      /* her lager vi en animasjon til hver div når vi looper over dem. animasjonensverdier ligger i CSS, med navn divAnimasjon*/
      divv.style.animation = `divAnimasjon 0.3s alternate ease-in-out 2`;
      //Sjekker hvis diver er active
      if (divv.classList.contains("active")) {
        //sjekk hvilken lyd er aktiv. hvis alle lyder er aktive, vil vi at alle skal spilles.
        if (divv.classList.contains("forsteDiver")) {
          //Sørger for at alle diver spilles når som helst og ikke til en lyd er ferdig.
          this.kickAudio.currentTime = 0;
          this.kickAudio.play();
        }
        if (divv.classList.contains("andreDiver")) {
          //Sørger for at alle diver spilles når som helst og ikke til en lyd er ferdig.
          this.snareAudio.currentTime = 0;
          this.snareAudio.play();
        }
        if (divv.classList.contains("tredjeDiver")) {
          //Sørger for at alle diver spilles når som helst og ikke til en lyd er ferdig.
          this.hihatAudio.currentTime = 0;
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }
  start() {
    /* ønsker å lage noe som kan loope over en funksjon flere ganger.*/
    //ganger med 1000, fordi intervalet regner det som ms.
    let interval = (60 / this.bpm) * 1000;
    //Sjekker hvis det ikke spilles
    if (!this.isPlaying) {
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      /*Fjern intervalet*/
      clearInterval(this.isPlaying);
      //resetter isPlaying til null. ellers vil den ikke fungere. Man må resette det til null.
      this.isPlaying = null;
    }
  }
  oppdaterKnappen() {
    //Hvis det ikke spilles
    if (!this.isPlaying) {
      //bytter vi ut Spill med Stop
      this.spilleKnapp.innerText = "Stop";
      //legger til en klasse
      this.spilleKnapp.classList.add("active");
    } else {
      //skal det være spill for å spille
      this.spilleKnapp.innerText = "Spill";
      //Fjerner klassen
      this.spilleKnapp.classList.remove("active");
    }
  }
  lydEndring(e) {
    //henter selecten vi klikker på
    let selectionNavn = e.target.name;
    //henter verdien
    let selectionVerdi = e.target.value;
    switch (selectionNavn) {
      //hvis det er kick-select som er selected
      case "kick-select":
        // setter vi lydkilden til hva vi har som verdi i inputet man velger.
        this.kickAudio.src = selectionVerdi;
        break;
      case "snare-select":
        // setter lydkilden til hva vi har som verdi i inputet man velger.
        this.snareAudio.src = selectionVerdi;
        break;
      case "hihat-select":
        // setter lydkilden til hva vi har som verdi i inputet man velger.
        this.hihatAudio.src = selectionVerdi;
        break;
      /*man kan forresten legge til så mange lyd man har, så lenge man har en kilde til den i html-option-value. 
      Vi kan legge til mer options med value som peker på kilden til lyden.
      */
    }
  }
  mute(e) {
    //henter indexen til data-track for å vite hvilken har vi klikket på.
    let stumIndex = e.target.getAttribute("data-track");
    //legger til toggle active til muten, for kunne gjøre den dynamisk.
    e.target.classList.toggle("active");
    //sjekker hvilken er aktiv, hvis det er, betyr det at vi muter den.
    if (e.target.classList.contains("active")) {
      switch (stumIndex) {
        //hvis stumIndex er case 0, som er aktiv
        case "0":
          //fjerner vi lyden
          this.kickAudio.volume = 0;
          break;
        //hvis stumIndex er case 1 som er aktiv
        case "1":
          //fjerner vi lyden
          this.snareAudio.volume = 0;
          break;
        //hvis stumIndex er case 2 som er aktiv
        case "2":
          //fjerner vi lyden
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      //hvis stumIndex ikke er aktiv
      switch (stumIndex) {
        //hvis case 0 er ikke aktiv
        case "0":
          //legger vi til lyden tilbake
          this.kickAudio.volume = 1;
          break;
        case "1":
          this.snareAudio.volume = 1;
          break;
        case "2":
          this.hihatAudio.volume = 1;
          break;
      }
    }
  }
  endreTempo(e) {
    //henter span-en som vi lagde
    let tempoTekst = document.querySelector(".tempo-nr");
    //Setter tempo/bpm til å bli valgt av brukeren.  
    this.bpm = e.target.value;
    //Bytter ut innholdet i span med verdien brukeren velger. 
    tempoTekst.innerText = e.target.value;
  }
  oppdaterTempo() {
    //Resetter alt.
    //fjerner interval. 
    clearInterval(this.isPlaying);
     //Restarter den igjen, dersom spilleknappen er aktiv. 
    /* Hvis spilleknappen ikke er aktiv, vil funksjonen ikke starte. det som 
    oppdateres er bare bpm. */
    this.isPlaying = null;
    let spilleKnapp = document.querySelector(".spill");
    //hvis man er i spill. 
    if (spilleKnapp.classList.contains("active")) {
      //så vil vi aktivere start-funksjonen igjen. 
      /* Dette gjør man fordi bpm ovenfor oppdateres ikke. 
    derfor må vi restarte den, slik at bpm oppdatere. */ 
      this.start();
    }
  }
}
//lager en tom objekt, den vil automatisk generere alle objektene og metodene som er laget.
const drumkit = new Drumkit();

//Her er det samling av EventListeners.

drumkit.diver.forEach((pad) => {
  pad.addEventListener("click", drumkit.activePad);
  /* Stopper animasjonen vi lage ovenfor når den er ferdig
  slik at den starter på nytt */
  pad.addEventListener("animationend", function () {
    this.style.animation = ""; //This.style.animation refererer til pad som er classen til div-ene
  });
});

drumkit.spilleKnapp.addEventListener("click", function () {
  //kaller tilbake funksjonene
  drumkit.oppdaterKnappen();
  drumkit.start();
});

drumkit.selects.forEach((select) => {
  select.addEventListener("change", function (e) {
    drumkit.lydEndring(e);
  });
});
drumkit.stumKnapp.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    drumkit.mute(e);
  });
});

/*Forskjellen mellom å bruke input og change er at hvis man bruker
input, vil funksjonen aktiveres veldig mange ganger når man f.eks. endrer tempo-slider
mens change gjør at man verdien etter å ha sluppet tempo-slideren. */
drumkit.tempoSkyveKnapp.addEventListener("input", function (e) {
  drumkit.endreTempo(e);
});

drumkit.tempoSkyveKnapp.addEventListener("change", function (e) {
  //change henter verdien etter å ha sluppet tempoSkyveKnapp. Det er det change gjør.
  drumkit.oppdaterTempo(e);
});
