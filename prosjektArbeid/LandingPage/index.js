const navSlide = () => {
      const menulinjer =document.querySelector('.menulinjer');
      const nav = document.querySelector('.navigasjons_linker');
      const navLinker = document.querySelectorAll('.navigasjons_linker li');


      menulinjer.addEventListener('click' , ()=>{

                        //toggle nav

            nav.classList.toggle('navigasjons_hendleser');

                  //linkens animasjon
            navLinker.forEach((link, index)=>{
            if(link.style.animation){
                  link.style.animation = ``;
            }
            else {
                  link.style.animation = `navigasjonslinkensfade 0.5s ease forwards ${index / 7 + 0.4}s`
            }
      });
      //menulinjens animation
      menulinjer.classList.toggle('linjemenu');


      });
}
navSlide();