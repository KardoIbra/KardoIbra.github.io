class Drumkit {
  constructor() { //lager en constructor funksjon, hvor man kan generere nye objeter fra den.
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
    this.selects = document.querySelectorAll("select");
    this.muteBtns = document.querySelectorAll(".mute");
    this.tempoSlider = document.querySelector(".tempo-slider");
  }
  activePad() {
    this.classList.toggle("active");
  }
  repeat() {
    let step = this.index % 8;//lager på en måte en loop. Når vi er i den 8ende, vil index-en bli til 0. altså starte igjen. 
    const activBars = document.querySelectorAll(`.b${step}`);
    //Loop Over the Bars/pads
    activBars.forEach((bar) => {
      bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
      //Check if pads are active
      if (bar.classList.contains("active")) {
        //sjekk hvilken lyd er aktiv. hvis alle lyder er aktive, vil alle spilles.
        if (bar.classList.contains("kick-pad")) {
          this.kickAudio.currentTime = 0; //Sørger for at alle pads spilles og ikke til en lyd er ferdig.
          this.kickAudio.play();
        }
        if (bar.classList.contains("snare-pad")) {
          this.snareAudio.currentTime = 0; //Sørger for at alle pads spilles og ikke til en lyd er ferdig.
          this.snareAudio.play();
        }
        if (bar.classList.contains("hihat-pad")) {
          this.hihatAudio.currentTime = 0; //Sørger for at alle pads spilles og ikke til en lyd er ferdig.
          this.hihatAudio.play();
        }
      }
    });
    this.index++;
  }
  start() {
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
  changeSound(e) {
    const selectionName = e.target.name;
    const selectionValue = e.target.value; //henter verdien
    switch (selectionName) {
      case "kick-select":
        this.kickAudio.src = selectionValue; // setter lydkilden til hva vi har som verdi i inputet man velger.
        break;
      case "snare-select":
        this.snareAudio.src = selectionValue; // setter lydkilden til hva vi har som verdi i inputet man velger.
        break;
      case "hihat-select":
        this.hihatAudio.src = selectionValue; // setter lydkilden til hva vi har som verdi i inputet man velger.
        break;
      //man kan forresten legge til så mange lyd man har, så lenge man har en kilde til den i html-option-value. Vi kan legge til mer options med value som peker på kilden til lyden.
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

const drumkit = new Drumkit(); //lager en tom objekt, den vil automatisk generere alle objektene og metodene som er laget.

//Her er det samling av EventListeners.

drumkit.pads.forEach((pad) => {
  pad.addEventListener("click", drumkit.activePad);
  pad.addEventListener("animationend", function () {
    this.style.animation = ""; //This refererer til pad
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
