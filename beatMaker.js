class Drumkit {
   //lager en constructor funksjon, hvor man kan generere nye objeter fra den.
  constructor() {
    //henter alle pad
    this.pads = document.querySelectorAll(".pad"); 
    this.playBtn = document.querySelector(".play");
    this.currentKick = "./sounds/kick-classic.wav";
    this.currentSnare = "./sounds/snare-acoustic01.wav";
    this.currentHihat = "./sounds/hihat-acoustic01.wav";
    this.kickAudio = document.querySelector(".kick-sound");
    this.snareAudio = document.querySelector(".snare-sound");
    this.hihatAudio = document.querySelector(".hihat-sound");
    //vil spore etter hverandre
    this.index = 0; 
    //hastighet på lyd
    this.bpm = 150; 
     //default
    this.isPlaying = null; 
    this.selects = document.querySelectorAll("select");
    this.muteBtns = document.querySelectorAll(".mute");
    this.tempoSlider = document.querySelector(".tempo-slider");
  }
  activePad() {
    this.classList.toggle("active");
  }
  repeat() {
    //lager på en måte en loop. Når vi er i den 8ende, vil index-en bli til 0. altså starte igjen. 
    let step = this.index % 8;
    let activBars = document.querySelectorAll(`.b${step}`);
    //Loop Over the Bars/pads
    activBars.forEach((bar) => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
      //Check if pads are active
      if (bar.classList.contains("active")) {
        //sjekk hvilken lyd er aktiv. hvis alle lyder er aktive, vil alle spilles.
        if (bar.classList.contains("kick-pad")) {
          //Sørger for at alle pads spilles og ikke til en lyd er ferdig.
          this.kickAudio.currentTime = 0; 
          this.kickAudio.play();
        }
        if (bar.classList.contains("snare-pad")) {
          //Sørger for at alle pads spilles og ikke til en lyd er ferdig.
          this.snareAudio.currentTime = 0; 
          this.snareAudio.play();
        }
        if (bar.classList.contains("hihat-pad")) {
          //Sørger for at alle pads spilles og ikke til en lyd er ferdig.
          this.hihatAudio.currentTime = 0; 
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }
  start() {
    let interval = (60 / this.bpm) * 1000;
    //Sjekker hvis det ikke spilles
    if (!this.isPlaying) {
      //sjekker at det ikke spilles.
      this.isPlaying = setInterval(() => {
        this.repeat();
      }, interval);
    } else {
      //hvis det allerede er satt
      //Fjern intervalet
      clearInterval(this.isPlaying); 
      //resetter isPlaying til null. ellers vil den ikke fungere. Man må resette det til null.
      this.isPlaying = null; 
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
  changeSound(e) {
    let selectionName = e.target.name;
    //henter verdien
    let selectionValue = e.target.value; 
    switch (selectionName) {
      case "kick-select":
        // setter lydkilden til hva vi har som verdi i inputet man velger.
        this.kickAudio.src = selectionValue; 
        break;
      case "snare-select":
        // setter lydkilden til hva vi har som verdi i inputet man velger.
        this.snareAudio.src = selectionValue; 
        break;
      case "hihat-select":
        // setter lydkilden til hva vi har som verdi i inputet man velger.
        this.hihatAudio.src = selectionValue; 
        break;
      /*man kan forresten legge til så mange lyd man har, så lenge man har en kilde til den i html-option-value. 
      Vi kan legge til mer options med value som peker på kilden til lyden.
      */
    }
  }
  mute(e) {
    //henter indexen
    let muteIndex = e.target.getAttribute("data-track");
    //adderer toggle active til muten
    e.target.classList.toggle("active");
    //sjekker hvilken er aktiv, altså inneholder active, hvis ja, betyr det at vi muter den.
    if (e.target.classList.contains("active")) {
      switch (muteIndex) {
        //hvis det er case 0, som er aktiv
        case "0":
          //fjerner vi lyden
          this.kickAudio.volume = 0;
          break;
        case "1":
          this.snareAudio.volume = 0;
          break;
        case "2":
          this.hihatAudio.volume = 0;
          break;
      }
    } else {
      //hvis det ikke er aktiv
      switch (muteIndex) {
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
  changeTempo(e) {
    let tempoText = document.querySelector(".tempo-nr");
    this.bpm = e.target.value;
    tempoText.innerText = e.target.value;
  }
  updateTempo() {
    clearInterval(this.isPlaying);
    this.isPlaying = null;
    let playBtn = document.querySelector(".play");
    if (playBtn.classList.contains("active")) {
      this.start( );
    }
  }
}
//lager en tom objekt, den vil automatisk generere alle objektene og metodene som er laget.
const drumkit = new Drumkit(); 

//Her er det samling av EventListeners.

drumkit.pads.forEach((pad) => {
  pad.addEventListener("click", drumkit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = ""; //This.style.animation refererer til pad
  });
});

drumkit.playBtn.addEventListener("click", function () {
  drumkit.updateBtn();
  drumkit.start();
});

drumkit.selects.forEach((select) => {
  select.addEventListener("change", function (e) {
    drumkit.changeSound(e);
  });
});
drumkit.muteBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
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
