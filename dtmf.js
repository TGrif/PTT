/**
 * 
 *  dtmf.js
 * 
 * tribute to Phreakers
 * @TGrif 2015 GPL
 */



    var    
    
            
            audioCtx        = new AudioContext(),
                    
                    
                BPM = 120,
                beatsPerSecond = 60 / BPM,
                timer = beatsPerSecond / 8,
                    
                    
                    
            hgf = [ 1209, 1336, 1477, 1633 ],   // High-Group DTMF Frequencies            
            lgf = [ 697, 770, 852, 941 ],       // Low-Group DTMF Frequencies     
            
            
            freqDTMF = {

                    '1': [ lgf[0], hgf[0] ],
                    "2": [ lgf[0], hgf[1] ],
                    "3": [ lgf[0], hgf[2] ],
                    "A": [ lgf[0], hgf[3] ],                  
                    
                    "4": [ lgf[1], hgf[0] ],
                    "5": [ lgf[1], hgf[1] ],
                    "6": [ lgf[1], hgf[2] ],
                    "B": [ lgf[1], hgf[3] ],
                    
                    "7": [ lgf[2], hgf[0] ],
                    "8": [ lgf[2], hgf[1] ],
                    "9": [ lgf[2], hgf[2] ],
                    "C": [ lgf[2], hgf[3] ],
                    
                    "*": [ lgf[3], hgf[0] ],
                    "0": [ lgf[3], hgf[1] ],
                    "#": [ lgf[3], hgf[2] ],                    
                    "D": [ lgf[3], hgf[3] ]

            },
                
  
  

                masterGain = createNewVCA(audioCtx, { gain: 0.1 });






        function getAudioContextCurrentTime(Ctx) {
            return Ctx.currentTime;
        }



        function createNewVCA(Ctx, vca) {

            var VCA = Ctx.createGain();

                if (vca.gain) { VCA.gain.value = vca.gain; }


          return VCA;

        }



        function createNewOSC(Ctx, osc) {

            var OSC = Ctx.createOscillator();

                if (osc.frequency) { OSC.frequency.value = osc.frequency; }

                if (osc.type) { OSC.type = osc.type; }
                if (osc.detune) { OSC.detune = osc.detune; }


          return OSC;

        }

    
    
        function generateDualTone(audioCtx, time, dualTone) {   
            
            var           
            
                osc = createNewOSC(audioCtx, {
                            type: "sine",
                            frequency: dualTone.hgf
                        }),


                osc2 = createNewOSC(audioCtx, {
                            type: "sine",
                            frequency: dualTone.lgf
                        });



                osc.connect(dualTone.gain);
                osc2.connect(dualTone.gain);
                dualTone.gain.connect(audioCtx.destination);



            osc.start(time);
            osc2.start(time);

            osc.stop(time + 0.3 + timer);
            osc2.stop(time + 0.3 + timer);
        
        }
        




            function playSound(touch, time) {

                 generateDualTone(audioCtx, time, {
                                    gain: masterGain,
                                    hgf: freqDTMF[touch][1],
                                    lgf: freqDTMF[touch][0]
                              }
                      );

            }






    window.onload = function() {


        var btn_compose = document.getElementsByTagName('input')[1];
        
        
        
            btn_compose.addEventListener('click', function() {             


                    var

                        startTime = getAudioContextCurrentTime(audioCtx),          


                        input_telephone_number = document.getElementsByTagName('input')[0],                                                

                        telephone_number = (input_telephone_number.value) ?
                                                input_telephone_number.value :
                                                        input_telephone_number.placeholder,                


                        numbersWithoutSpaces = telephone_number.replace(/\s/g, ""),
                        numbers = numbersWithoutSpaces.split("");

    


                for (var i = 0; i < numbers.length; i++) {

                    var touch = numbers[i];
                    var time = startTime + i * 10 * timer;



                        try {

                            playSound(touch, time);


                        } catch(e) {

                            alert("There is a problem with this number [" + e + "]");

                                break;
                        }

                }
                

            });
        
    };




