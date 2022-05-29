// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOVU88HBPNfJZiRPSjtLmiWClyxzpyFMs",
  authDomain: "beatsdatabase.firebaseapp.com",
  projectId: "beatsdatabase",
  storageBucket: "beatsdatabase.appspot.com",
  messagingSenderId: "778755516458",
  appId: "1:778755516458:web:98e21e734765d7f1f8fb53",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();

class Drumkit {
  /*Lager en constructor funksjon, hvor man kan genere nye objekter fra den. */
  constructor() {
/*Henter alle divene som skal spilles, ved å bruke i tillegg "this"-keyword
slik at den blir lagt inn som et nytt objekt i det tome objektet når vi kaller
construction funksjonen ved bruk av "new"-operatoren nedenfor */
    this.pads = document.querySelectorAll(".pad"); //henter alle pad
    this.playBtn = document.querySelector(".play");
    this.currentKick = "./sounds/kick-classic.wav";
    this.currentSnare = "./sounds/snare-acoustic01.wav";
    this.currentHihat = "./sounds/hihat-acoustic01.wav";
    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");
    this.index = 0; //vil spore etter hverandre
    this.bpm = 150; //hastighet på lyd
    this.isPlaying = null; //default
    //henter alle selectene
    this.selects = document.querySelectorAll("select");
    this.muteBtns = document.querySelectorAll(".mute");
    this.tempoSlider = document.querySelector(".tempo-slider");
  }
  activePad() {
    //Aktiverer divene med lyd. Diven som blir farget.
    this.classList.toggle("active");
  }
  repeat() {
    /*lager en slags loop med en metode start(){} som starter loopen. Når vi er i den 8ende, vil index-en bli til 0. altså starte igjen.
    Fordi her bruker vi modolus.*/
      /*Nå har vi en slags spor fra 0 -7. Når loppen altså index blir 8 % 8, resettes det
    til 1 pga modulusen. vi kan kan bruke dette til å velge klassene vi lagde, siden vi har 
    en spor/steps som er fra 0 - 7, kan vi hente klassene til divene som har .b1 - .b7 slik: (`.b${step}`)  */
    let step = this.index % 8; 
  
    // henter alle .b klassene til hver beat
    const activBars = document.querySelectorAll(`.b${step}`);
    //Loop Over the Bars/pads og radene/index
    // index-en her, henter hvilken rad som er aktiv.
    activBars.forEach((bar, index) => {
     /* her lager vi en animasjon med @keyframes til hver div/bar/pad når vi looper over dem. animasjonensverdier ligger i CSS, med navn playTrack
     Her adder vi alternate 2, slik at animasjonen ikke bare er for utvidelsen, men også for kontraksjonen*/
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
      //Check if pads are active
      if (bar.classList.contains("active")) {
        //sjekk hvilken pad/div/bar er aktiv. 
        if (bar.classList.contains("kick-pad")) {
          /*Sørger for at alle pads/bars spilles og ikke til en lyd er ferdig.
          vi resetter tiden til lydene til å være 0, hver gang vi spiller en lyd 
          Det gjør at man kan spiller på alle lydene uansett hva tempoen.*/
          this.kickAudio.currentTime = 0; 
          //spiller på lyd
          this.kickAudio.play();
          db.collection("beat")
            .doc("kick" + step)
            .set({
              //lager en collection med objekt
              Rad: index,
              Box: `${step}`,
              userClick: bar.classList.contains("kick-pad"),
              active: true,
            });
        }

        if (bar.classList.contains("snare-pad")) {
          this.snareAudio.currentTime = 0; //Sørger for at alle pads spilles og ikke til en lyd er ferdig.
          this.snareAudio.play();
          db.collection("beat")
            .doc("snare" + step)
            .set({
              //Lager en collection.
              Rad: index,
              Box: `${step}`,
              userClick: bar.classList.contains("snare-pad"),
              active: true,
            });
        }
        if (bar.classList.contains("hihat-pad")) {
          this.hihatAudio.currentTime = 0; //Sørger for at alle pads spilles og ikke til en lyd er ferdig.
          this.hihatAudio.play();
          db.collection("beat")
            .doc("hihat" + step)
            .set({
              Rad: index,
              Box: `${step}`,
              userClick: bar.classList.contains("hihat-pad"),
              active: true,
            });
        }
      }
    });
    this.index++;
  }
  //setter en interval for å loope over divene flere ganger
  start() {
    /*Her deler vi 60 med beats per minutt/60 for å få bpm, og så
    ganger vi med 1000, fordi intervalet regner med milisekunder. 
    Dette gjør vi for å altså gjøre om til sekunder. */
    const interval = (60 / this.bpm) * 1000;
    //Sjekker hvis det ikke spilles
    if (!this.isPlaying) {
      //sjekker at det ikke spilles.
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      //hvis det allerede er satt
      //Fjern intervalet
      clearInterval(this.isPlaying); //fjerner vi den
      this.isPlaying = null; //resetter isPlaying til null. ellers vil den ikke fungere. Man må resette det til null.
    }
  }
  updateBtn() {
    //Hvis det ikke spilles
    if (!this.isPlaying) {
      //bytter vi ut Spill med Stop
      this.playBtn.innerText = "Stop"; //
      this.playBtn.classList.add("active");
    } else {
      this.playBtn.innerText = "Spill";
      this.playBtn.classList.remove("active");
    }
  }

  //metoden for lydbytting
  changeSound(e) {
    const selectionName = e.target.name;//henter navnet til lyden
    const selectionValue = e.target.value; //henter verdien/value lyden
    /*Lager en switch statment. 
    Basert på (selectionName), altså navnet til lyden:  */
    switch (selectionName) {
      //hvis kick-select som er valgt
      case "kick-select":
        //setter kickAudio.src som er defualt til å være lydVerdien til option i select-elementet, altså lydens value som er valgt.
        this.kickAudio.src = selectionValue; 
        /*Lagrer lydens value i set dokument som heter KickLyd i en collection som heter "beat" */
        db.collection("beat").doc("KickLyd").set({
          LydKilde: selectionValue,
        });
        //bryter dette case-et, og så repeterer vi det to ganger til.
        break;
      case "snare-select":
        this.snareAudio.src = selectionValue; // setter lydkilden til hva vi har som verdi i inputet man velger.
        db.collection("beat").doc("SnareLyd").set({
          LydKilde: selectionValue,
        });
        break;
      case "hihat-select":
        this.hihatAudio.src = selectionValue; // setter lydkilden til hva vi har som verdi i inputet man velger.
        db.collection("beat").doc("HihatLyd").set({
          LydKilde: selectionValue,
        });
        break;
      //man kan forresten legge til så mange lyd man har, så lenge man har en kilde til den i html-option-value. Vi kan legge til mer options med value som peker på kilden til lyden.
    }
  }
  mute(e) {
    //henter attributet "data-track" som  er indexen til mutenen til radene 0, 1 0g 2. 
    let muteIndex = e.target.getAttribute("data-track");
    //adderer toggle active til muten
    e.target.classList.toggle("active");
    /*Sjekker hvis det vi trykker på har klassen "active", hvis ja den har active, muter vi raden */
    if (e.target.classList.contains("active")) {
      //basert på muteindexene 0, 1, 2, lager vi en switch statement
      switch (muteIndex) {
        //hvis det er case 0, u dette tilfelle er 0 = kickAudio
        case "0":
          //vi muter lyden ved å sette volumet til kickAudio til å være 0. 
          this.kickAudio.volume = 0;
          //lagrer også at lyden er av på databasen i et dokument som heter KickMute, med lit info som objekt.
          db.collection("beat").doc("KickMute").set({
            active: true,
            HeleRad: 0,
            lyd: "av",
          });
          break;
        case "1":
          this.snareAudio.volume = 0;
          db.collection("beat").doc("SnareMute").set({
            active: true,
            HeleRad: 1,
            lyd: "av",
          });
          break;
        case "2":
          this.hihatAudio.volume = 0;
          db.collection("beat").doc("HihatMute").set({
            active: true,
            HeleRad: 2,
            lyd: "av",
          });
          break;
      }
            //hvis det ikke er aktiv, altså at brukeren ikke har trukket på mutenButtonen.
    } else {
      //lager en annen switch statement basert på muteIndex.
            switch (muteIndex) {
        //her vil case-ene være var inaktive, noe som betyr at vi legger lyden tilbake
        case "0":
          //legger til lyden tilbake, ved å la volumet være = 1
          this.kickAudio.volume = 1;
          //oppdaterer i samme dokument at lyden er på. Active: false, i stedenfor true.
          db.collection("beat").doc("KickMute").set({
            active: false,
            lyd: "på",
          });
          break;
        case "1":
          this.snareAudio.volume = 1;
          db.collection("beat").doc("SnareMute").set({
            active: false,
            lyd: "på",
          });
          break;
        case "2":
          this.hihatAudio.volume = 1;
          db.collection("beat").doc("HihatMute").set({
            active: false,
            lyd: "på",
          });
          break;
      }
    }
  }
  changeTempo(e) {
    // let tempoText = document.querySelector(".tempo-nr");

    //henter tempovalue
    this.bpm = e.target.value;
    // tempoText.innerText = e.target.value;
     /*db.collection("beat").doc("Tempo").set({
      Tempo: e.target.value,
    });*/
    let besokEl = document.querySelector(".besok"); 
    /*Lagrer Tempo på localStorage som string med keyvalue "Tempo*/
    localStorage.setItem("Tempo", this.bpm);
        /*henter Tempo fra localStorage og gjør den om til Number*/
    let hentTempo = Number(localStorage.getItem("Tempo"))
    //legger tempo-tall på nettsiden
    besokEl.innerHTML = `Din Tempo: ${hentTempo}`
  }
  updateTempo() {
    //setter intervall til å være null
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    let playBtn = document.querySelector(".play");
    //hvis playBtn er active, lar vi metoden start() starte hele prosessen
    if (playBtn.classList.contains("active")) {
      this.start();
    }
  }
}




if (localStorage.antallBesok) {
  //alt lagres som tekst i localStorage, derfor gjør vi om til tall i dette tilfelle
  localStorage.antallBesok = Number(localStorage.antallBesok) + 1;
} else {
  localStorage.antallBesok = 1;
}




//lager en tom objekt, den vil automatisk generere alle objektene og metodene som er laget.
const drumkit = new Drumkit(); 

//Her er det samlingen av EventListeners.
/* Nedenfor lager vi lytter sammen med callback funksjoner
som igjen starter metodene ovenfor */

/*Looper over alle divene som har klassen pad.
aktiverer activePad, som har en toggle på padene/divene.
aktiverer animasjonens end på padene/divene, slik at 
den starter på nytt */
drumkit.pads.forEach((pad) => {
  pad.addEventListener("click", drumkit.activePad);
  pad.addEventListener("animationend", function () {
    //This refererer til paden, som har en lytter 
    this.style.animation = ""; 
  });
});

/*Lager en lytter for playBtn for å starte metoden start() som starter
igjen repeat(). 
vi starter også updateBtn. */
drumkit.playBtn.addEventListener("click", function () {
  drumkit.updateBtn();
  drumkit.start();
});

drumkit.selects.forEach((select) => {
  select.addEventListener("change", function (e) {
    /*Grunnen til at vi passerer event (e) til callbak funksjonen 
    er at vi ønsker å vite hva som blir trukket på...*/
    drumkit.changeSound(e);
  });
});
drumkit.muteBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    /*Samme grunn. eventen, e, er veldig godt egnet for å ha toggle på noe
    dette bruker vi på muteBtns */
    drumkit.mute(e);
  });
});

drumkit.tempoSlider.addEventListener("input", function (e) {
  drumkit.changeTempo(e);
});

drumkit.tempoSlider.addEventListener("change", function (e) {
  //change henter verdien etter å ha slippet tempoSlider
  drumkit.updateTempo(e);
});
