PennController.ResetPrefix(null);
PennController.DebugOff() // use for the final version
    PennController.AddHost("https://amor.cms.hu-berlin.de/~petrenca/Hist_LE_stimuliV/"); // loads pictures from external server

// --------------------------------------------------------------------------------------------------------------
// Preamble

const replacePreloadingMessage = ()=>{   //Changes the Preloading Message
    const preloadingMessage = $(".PennController-PennController > div");
if (preloadingMessage.length > 0 && preloadingMessage[0].innerHTML.match(/^<p>Please wait while the resources are preloading/))
    preloadingMessage.html("<p>Please wait while the resources are preloading. This may take up to a minute.</p>");
window.requestAnimationFrame( replacePreloadingMessage );
};
window.requestAnimationFrame( replacePreloadingMessage );

// create cumulative function
cumulative = (sentence, remove) => {
    let words = sentence.split('*'),  blanks = words.map(w=>w.split('').map(c=>'_').join('') ); // 'sentence.split('*')' = '*' defines the chunk boundaries (in the .csv)
    let textName = 'cumulative'+words.join('');
    // We'll return cmds: the first command consists in creating (and printing) a Text element with dashes
    let cmds = [ newText(textName, blanks.join(' '))
    //.print()
    //.css({"font-family":"courier","font-size":"20px","white-space":"pre-line"})
    .settings.css("font-family","courier")
    .settings.css("font-size", "20px")
    //.cssContainer({"width": "78vw"})
    .print("15vw","40vh")
    //.settings.css("font-size", "0.5em")  
    //.cssContainer({"width": "10vw"})
    ];
    // COURIER as font
    // We'll go through each word, and add two command blocks per word
    for (let i = 0; i <= words.length; i++)
    cmds = cmds.concat([ newKey('cumulative'+i+'_'+words[i], " ").log().wait() , // Wait for (and log) a press on Space; will log "cumulative"+number-of-region_sentence-chunk
    getText(textName).text(blanks.map((w,n)=>(n<=i?words[n]:w)).join(' ')) ]); // Show word; to make cumulative changed n==i?words to n<=i?words (print words less than or equal to i-region)
    if (remove)  // Remove the text after the last key.wait() is parameter specified
    cmds.push(getText(textName).remove());
    return cmds;
};

// --------------------------------------------------------------------------------------------------------------
//Create picking function
function Pick(set,n) {
    assert(set instanceof Object, "First argument of pick cannot be a plain string" );
    n = Number(n);
    if (isNaN(n) || n<0)
        n = 0;
    this.args = [set];
    this.runSet = null;
    set.remainingSet = null;
    this.run = arrays => {
        if (this.runSet!==null) return this.runSet;
        const newArray = [];
        if (set.remainingSet===null) {
        if (set.runSet instanceof Array) set.remainingSet = [...set.runSet];
        else set.remainingSet = arrays[0];
    }
        for (let i = 0; i < n && set.remainingSet.length; i++)
            newArray.push( set.remainingSet.shift() );
    this.runSet = [...newArray];
    return newArray;
}
}
    function pick(set, n) { return new Pick(set,n); }
        
        critical = randomize("critical")
        fillers = randomize("filler");

// --------------------------------------------------------------------------------------------------------------
// sequence
// test run:
//PennController.Sequence( "instructions2", subsequence(repeat(randomize("critical_trials"), 40) , "break"), "post_instructions", "post_ques", "post_task_intro", "post_task_prac", "post_task_start", "post_task", "send", "final");
//PennController.Sequence("preloadPractice","preloadFillers", "preloadCritical", "post_task", "send");


// FOR REAL PARTICIPANTS; check: # of trials, DebugOff, DELETE results file
PennController.Sequence( "demographics","requirements", "instructions1","preloadPractice","preloadFillers", "preloadCritical", "practice", "instructions2",
                         rshuffle(pick(critical,8),pick(fillers,11)),"break",
                         rshuffle(pick(critical,8),pick(fillers,11)),"break",
                         rshuffle(pick(critical,8),pick(fillers,11)),
                         "post_instructions", "post_ques", "post_task_intro", "post_task_prac", "post_task_start", "post_task", "send", "final");

//====================================================================================================================================================================================================================
// 1. Welcome page/demographics

PennController("demographics",
               // ENTER PROLIFIC ID
               newText("welcometext", "<p><b>Welcome to our experiment!</b><p>")
               .settings.css("font-size", "30px")
               ,
               newCanvas("welcomecanvas", 1000, 125)
               .settings.add("center at 50%", 0, getText("welcometext") )
               .print()
               ,
               newTextInput("proID", "")
               .before(newText("proID", "Before we begin, please enter your Prolific ID: ")
                       .settings.css("font-size", "20px"))
               .size(100, 20)
               .settings.center()
               .print()
               ,
               newText("blank","<p>")
               .print()
               ,
               newButton("start", "Continue")
               .settings.center()
               .print()
               .wait(getTextInput("proID")
                     .test.text(/[^\s]+/)
                     .success()
                     .failure(
                         newText("IDerror","Please enter your Prolific ID in order to continue.")
                         .settings.color("red")
                         .settings.center()
                         .print()
                     )  
                    )
               ,   
               getCanvas("welcomecanvas")
               .remove()
               ,
               getTextInput("proID")
               .remove()
               ,
               getButton("start")
               .remove()
               ,
               getText("IDerror")
               .remove()
               ,
               // ENTER DEMOGRAPHICS
               newText("demo", "<p>Before you continue to the instructions, we need to know a few things about you."
                       +" This information will remain anonymous. You can read more about how we handle your data in our Information Sheet below.<p>")              
               .settings.css("font-size", "20px")
               ,
               newCanvas("democanvas", 1000, 95)
               .settings.add(0, 0, getText("demo") )
               .print()
               ,
               newDropDown("age", "")
               .settings.add( "26 or younger" , "27" , "28" , "29", "30" , "31" , "32 or older" )
               ,
               newText("agetext", "Age:")
               .settings.css("font-size", "20px")
               .settings.bold()
               //.settings.after( getDropDown("age") )    
               ,
               newCanvas("agecanvas", 1000, 45)
               .settings.add(0, 10, getText("agetext") )
               .settings.add(100, 8, getDropDown("age") )
               .print()    
               ,
               newText("sex", "Gender:")
               .settings.css("font-size", "20px")
               .settings.bold()
               ,
               newDropDown("sex", "" )
               .settings.add( "female", "male", "other")
               ,
               newCanvas("sexcanvas", 1000, 40)
               .settings.add(0, 0, getText("sex") )
               .settings.add(120, 3, getDropDown("sex") )
               .print()
               ,
               newText("nativeEng", "<b>Were you raised monolingually in English?</b><br>(i.e., in English and only English?)")
               .settings.css("font-size", "20px")
               ,
               newTextInput("L2", "")
               .settings.hidden()
               ,
               newText("label input", "")
               .settings.after( getTextInput("L2") )
               ,
               newDropDown("language", "")
               .settings.log()
               .settings.add(  "yes", "no, I was (also) raised in:")    
               .settings.after(  getText("label input") )
               .settings.callback(                                             //whenever an option is selected, do this:
                   getDropDown("language")
                   .test.selected("no, I was (also) raised in:")                             //reveal the input box
                   .success( getTextInput("L2").settings.visible() )     //hide the input box
                   .failure( getTextInput("L2").settings.hidden()  )   
               )        
               ,
               newCanvas("languagecanvas", 1000, 25)
               .settings.add(0, 0, getText("nativeEng") )
               .settings.add(400, 2, getDropDown("language") )
               .print()
               ,
               newText("<p> ")
               .print()
               ,    
               newText("information", "<p>Before continuing the experiment, please read our"
                       +" <a href='https://amor.cms.hu-berlin.de/~petrenca/Hist_LE/EN_info_sheet_ONLINE.pdf' target='_blank' >Participant's Information Sheet</a> and"
                       +" <a href='https://amor.cms.hu-berlin.de/~petrenca/Hist_LE/EN_consentAgreement_ONLINE.pdf' target='_blank'>Consent Form</a>.<p>")    
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvastwo", 1000, 70)
               .settings.add(0, 0, getText("information") )
               .print()
               ,
               newText("browser_info", "<p>Please note that this experiment should only be run on <b>Mozilla Firefox</b> or <b>Google Chrome</b> and should <i>not</i> be run on a mobile phone.<p>")
               .settings.css("font-size", "20px")
               ,
               newCanvas("infocanvasthree", 1000, 105)
               .settings.add(0, 0, getText("browser_info") )
               .print()
               ,
               newText("consent", "By ticking the button below, I declare I have fully read and <br>understood the Participant's Information Sheet and Consent Form.<p>")
               .settings.css("font-size", "15px")  
               .settings.center()      
               .print()
               ,
               newButton("consent","Yes, I have read them.")
               .settings.center()
               .print()
               .wait()
               ,
               getDropDown("age")
               .test.selected()
               .success()
               .failure(
                   newText("ageerror","Please enter your age.")
                   .settings.color("red")
                   .print())   
               ,
               getDropDown("sex")
               .test.selected()
               .success()
               .failure(
                   newText("sexerror","Please ender your gender.")
                   .settings.color("red")
                   .print())
               ,
               getDropDown("language")
               .test.selected()
               .success()
               .failure(
                   newText("langerror","Please answer the question about your language history.")                   
                   .settings.color("red")
                   .print())      
               ,
               getDropDown("age").wait("first")
               ,
               getDropDown("sex").wait("first")
               ,
               getDropDown("language").wait("first")
               ,
               newButton("continue", "Continue to experiment")
               .settings.center()
               .print()
               .wait()
               
               ,
               getButton("consent")
               .remove()
               ,
               getButton("continue")
               .remove()
               ,
               getText("consent")
               .remove()
               ,
               getCanvas("infocanvastwo")
               .remove()
               ,
               newText("<p> ")
               .print()  
               ,
               // Create new variables from input
               newVar("IDage")
               .settings.global()
               .set( getDropDown("age") )
               ,
               newVar("IDsex")
               .settings.global()
               .set( getDropDown("sex") )
               ,
               newVar("IDling")
               .settings.global()
               .set( getDropDown("language") )
               ,
               newVar("whichL2")
               .settings.global()
               .set( getTextInput("L2") )
               ,
               newVar("proID")
               .settings.global()
               .set( getTextInput("proID") )
               ,
               // set 'yes' and 'no' keys
               newVar("yes_key")
               .settings.global()
               .set( "F" ) // for F-version
               // .set( "J" ) // for J-version
               ,
               // set 'no' key; this is necessary for the conditional in the practice round (for feedback)
               newVar("no_key")
               .settings.global()
               .set( "J" ) // for F-version
               // .set( "F" ) // for J-version
              )                                 //end of welcome screen
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "demo" )
    .log("type", "demo")
    .log("life_status" , "demo")
    .log("lifetime" , "demo")
    .log("died" , "demo")
    
    .log("tense", "demo")  
    .log("mismatch", "demo")
    .log("match", "demo") 
    .log( "condition" , "demo")
    .log("rating", "demo")
    .log("photo_rating", "demo")
    .log("sentence_rating", "demo")
    
    .log("occupation" , "demo")  
    .log("occupation_distractor" , "demo")
    .log("nationality" , "demo")
    .log("nationality_distractor" , "demo")   
    
    .log( "sentence" , "demo")
    .log("list", "demo")
    .log("name" , "demo")
    //.log( "real_name" , "demo")  
    //.log( "wrong_name" , "demo")  
    //.log( "name_match" , "demo")   
    
    .log("bare_verb", "demo")  
    .log("life_status_year_verb", "demo")
    .log("life_status_year_before", "demo")
    .log("life_status_year_after", "demo")
    .log("life_status_year_before_match", "demo")
    .log("life_status_year_correct", "demo")   
    
    .log( "notice", "demo")  
    .log( "about", "demo")     
    .log( "easyhard", "demo")  
    .log( "strategy", "demo")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
//2. Participants who don’t meet the pre-determined criteria, get an‘exclude’value in ‘demo_req’

PennController( "requirements"
                ,
                newVar("demo_req")
                .settings.global()
                ,
                getVar("IDage")
                .testNot.is("26 or younger")  // if particpant is NOT under 17
                .and( getVar("IDage")
                      .testNot.is("32 or older")  // AND if particpant is NOT over 32
                     )
                .and(getVar("IDling")
                     .testNot.is("no, I was (also) raised in:")   // AND participant is NOT bi-lingual
                    )
                
                .success(getVar ("demo_req").set(newText("include")))  
                .failure(getVar ("demo_req").set(newText("exclude")))  
               )// END
    
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "requirements" )
    .log("type", "requirements")
    .log("life_status" , "requirements")
    .log("lifetime" , "requirements")
    .log("died" , "requirements")
    
    .log("tense", "requirements")  
    .log("mismatch", "requirements")
    .log("match", "requirements") 
    .log( "condition" , "requirements")
    .log("photo_rating", "requirements")
    .log("sentence_rating", "requirements")
    
    .log("occupation" , "requirements")  
    .log("occupation_distractor" , "requirements")
    .log("nationality" , "requirements")
    .log("nationality_distractor" , "requirements")   
    
    .log( "sentence" , "requirements")
    .log("list", "requirements")
    .log("name" , "requirements")
    //.log( "real_name" , "requirements")  
    //.log( "wrong_name" , "requirements")  
    //.log( "name_match" , "requirements")   
    
    .log("bare_verb", "requirements")  
    .log("life_status_year_verb", "requirements")
    .log("life_status_year_before", "requirements")
    .log("life_status_year_after", "requirements")
    .log("life_status_year_before_match", "requirements")
    .log("life_status_year_correct", "requirements")   
    
    .log( "notice", "requirements")  
    .log( "about", "requirements")     
    .log( "easyhard", "requirements")  
    .log( "strategy", "requirements")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


//====================================================================================================================================================================================================================
// 2. Intro/instructions

PennController( "instructions1",
                
                getVar("IDage")
                .testNot.is("26 or younger")   // if particpant is NOT under 17
                .and( getVar("IDage")
                      .testNot.is("32 or older")   // AND if particpant is NOT over 32
                     )
                .and(getVar("IDling")
                     .testNot.is("no, I was (also) raised in:")    // AND participant is NOT bi-lingual
                    )
                .success()   // continue as normal
                .failure(    // otherwise, send results and end prematurely
                    SendResults()  // for this to work within a PC, I changed the PC.js file (Edit your file PennController.js and replace occurrences of e=window.items.indexOf(n); (there should be 2) with e=window.items&&window.items.indexOf(n);)
                    ,
                    newText("bye", "<p>You are ineligible for this study, as you have provided information which is inconsistent with your Prolific prescreening responses. "
                            + "<p>Please return your submission on Prolific by selecting the 'Stop without completing' button."
                           )
                    .settings.css("font-size", "20px")
                    .settings.color("red")
                    .settings.bold()
                    .print()
                    ,
                    newText("bye2", "<p><b>Why was I excluded?</b><p>We used Prolific's prescreening options in order to recruit participants who are "
                            + "between the <b>ages of 27-31</b>, whose <b>first/native language is English</b>,<br> and who <b>grew up speaking only "
                            + "their native language</b> (which in this case should be English).<p> You must have indicated on the previous "
                            + "page that one of these is not true. If you think there has been a mistake, please let the researchers know via Prolific. <br>We have saved "
                            + "your responses and will gladly check them and pay you if there has been an error!"
                           )
                    .center()
                    .print()
                    .wait()
                )
                
                ,
                newText("intro", "<p><b>Thank you for taking part in our experiment!</b><p> The experiment consists of four parts: a short practice round, the experiment itself, and then two short post-experiment questionnaires. The whole process should take around 15 minutes.<p><p> Press the <b>spacebar</b> to continue to the instructions.<p><p>")
                .settings.css("font-size", "20px")
                ,
                newCanvas("introcanvas",900, 450)
                .settings.add(0,0, getText("intro"))
                .print()   
                ,
                newKey("intro"," ")
                .wait()
                ,
                getCanvas("introcanvas")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,                
                newText("set-up", "<p>Because <b>this is an experiment</b>, we would appreciate if you could take the following steps to ensure concentration:<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; <b>turn off any music/audio</b> you may be listening to<p>&nbsp;&nbsp;&nbsp;&nbsp;&bull; <b>refrain from Googling</b> or looking up information during the experiment<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; put your <b>phone on silent</b> and leave it face down or out of reach<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; <b>attend to the experiment until it is over</b> (it consists of three blocks with two short breaks in between)<p><t>&nbsp;&nbsp;&nbsp;&nbsp;&bull; in general behave as if you were in our laboratory!<p>These steps will help ensure the data we collect from you is high quality. Please <b>press the spacebar</b> if you agree to take these steps.")
                .settings.css("font-size", "20px")
                ,
                newCanvas("set-upcanvas",900, 450)
                .settings.add(0,0, getText("set-up"))
                .print()   
                ,
                newKey("set-up"," ")
                .wait()
                ,     
                getCanvas("set-upcanvas")
                .remove()
                ,
                newTimer("intro", 500)
                .start()
                .wait()
                ,
                newButton("fullscreen","Start the experiment and go fullscreen")
                .center()
                .print()
                .wait()
                ,
                fullscreen()
                ,
                getButton("fullscreen")
                .remove()
                ,    
                newText("instructions_a", "<b>Description of the experiment</b><p>"
                        + "In this experiment, you will be looking at photos of and reading sentences about cultural figures."
                        + "<br>You may be very familiar with some of them, and not very familiar with others."
                        + "<p>(1) First, you will be presented with <b>a photo introducing the cultural figure.</b> "
                        + "Indicate whether you are familiar with them by pressing <b>'F'</b>= <i>'yes, I am'</i> or <b>'J'</b>=<i>'no, I am not'<i>.<br>"  //F-Version
                        //+ "Indicate whether you are familiar with them by pressing <b>'F'</b> = <i>'no, I am not'</i> or <b>'J'</b> = <i>'yes, I am'</i>.<br>" //J-Version
                       )
                .settings.css("font-size", "20px")
                ,
                newCanvas("instruccanvas",900, 170)
                .settings.add(0,0, getText("instructions_a"))
                .print()   
                ,
                newImage("ex_photo", "https://amor.cms.hu-berlin.de/~petrenca/Hist_LE_stimuliV/Sir_David_Attenborough.png")
                .settings.size(400)                                                      
                .center()
                .print()
                ,
                newKey("ex_rating", "FJ")
                .log()
                .wait()             
                ,
                getCanvas("instruccanvas")
                .remove(getText("instructions_a"))
                ,
                getImage("ex_photo")
                .remove()
                ,
                getKey("ex_rating")
                .disable()
                ,
                
                newText("instructions_b", "<p>(2) You will then be presented with a <b>sentence revealed chunk-by-chunk.</b> "
                        + "Hit the <b>spacebar</b> to reveal the next sentence chunk.<br>"
                       )
                .settings.css("font-size", "20px")
                ,
                newText("example1",  "<p><i>'He ____________ ____ _____________________.'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example2", "<p><i>'He has narrated ____ _____________________.'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example3", "<p><i>'He has narrated many _____________________.'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example4", "<p><i>'He has narrated many nature documentaries.'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example4", "<p><i>'He has narrated many nature documentaries, according to __________'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                newText("example5", "<p><i>'He has narrated many nature documentaries, according to Wikipedia.'</i>")
                .settings.css("font-size", "15px")
                .settings.css("font-family","courier")
                ,
                getCanvas("instruccanvas")
                .settings.add(0,0, getText("instructions_b"))
                .settings.add(70,300, getText("example1"))
                .print()  
                ,
                newKey("ex1"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example1"))
                .settings.add(70,300, getText("example2"))
                ,
                newKey("ex2"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example2"))
                .settings.add(70,300, getText("example3"))
                .print()  
                ,                
                newKey("ex3"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example3"))
                .settings.add(70,300, getText("example4"))
                ,
                newKey("ex4"," ")
                .wait()
                ,
                getCanvas("instruccanvas")
                .remove(getText("example4"))
                .remove(getText("instructions_b"))
                ,
                newText("instructions_c", "<p>(3) After this sentence, you will decide whether it fits "
                        + " the preceding photo."
                        + " The <b>'F' key</b> for <i>'yes, it fits'</i>, or the <b>'J' key</b> for <i>'no, it doesn't'</i>." // F-version
                        // + "The 'F' key for 'no, it doesn't', or the 'J' key for 'yes, it fits'." // J-version
                        + " However, during the experiment the sentences will disappear before you can make a selection, so consider this when you reach the end of the sentences."
                        + "<p>Once you've made your decision, you will continue to the next cultural figure."
                        + "<br> You only have a few seconds to make this selection, otherwise it will time out."
                        + "<p>You’ll now start a practice round with instructions in red to help you. When you’re ready to start, press the <b>spacebar</b>. <p>")
                .settings.css("font-size", "20px")
                ,
                getCanvas("instruccanvas")
                .settings.add(0,0, getText("instructions_c"))
                .print()  
                ,
                newKey("prac_start"," ")
                .wait()
                
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "instructions1" )
    .log("type", "instructions1")
    .log("life_status" , "instructions1")
    .log("lifetime" , "instructions1")
    .log("died" , "instructions1")
    
    .log("tense", "instructions1")  
    .log("mismatch", "instructions1")
    .log("match", "instructions1") 
    .log( "condition" , "instructions1")
    .log("photo_rating","instructions1")
    .log("sentence_rating", "instructions1")
    
    .log("occupation" , "instructions1")  
    .log("occupation_distractor" , "instructions1")
    .log("nationality" , "instructions1")
    .log("nationality_distractor" , "instructions1")   
    
    .log( "sentence" , "instructions1")
    .log("list", "instructions1")
    .log("name" , "instructions1")
    //.log( "real_name" , "instructions1")  
    //.log( "wrong_name" , "instructions1")  
    //.log( "name_match" , "instructions1")   
    
    .log("bare_verb", "instructions1")  
    .log("life_status_year_verb", "instructions1")
    .log("life_status_year_before", "instructions1")
    .log("life_status_year_after", "instructions1")
    .log("life_status_year_before_match", "instructions1")
    .log("life_status_year_correct", "instructions1")   
    
    .log( "notice", "instructions1")  
    .log( "about", "instructions1")     
    .log( "easyhard", "instructions1")  
    .log( "strategy", "instructions1")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 0. Preloading

CheckPreloaded( "practice",5000)
    .label( "preloadPractice" )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "preload1" )
    .log("type", "preload1")
    .log("life_status" , "preload1")
    .log("lifetime" , "preload1")
    .log("died" , "preload1")
    
    .log("tense", "preload1")  
    .log("mismatch", "preload1")
    .log("match", "preload1")
    .log( "condition" , "preload1")
    .log("photo_rating", "preload1")
    .log("sentence_rating", "preload1")
    
    .log("occupation" , "preload1")  
    .log("occupation_distractor" , "preload1")
    .log("nationality" , "preload1")
    .log("nationality_distractor" , "preload1")   
    
    .log( "sentence" , "preload1")
    .log("list", "preload1")
    .log("name" , "preload1")
    //.log( "real_name" , "preload1")  
    //.log( "wrong_name" , "preload1")  
    //.log( "name_match" , "preload1")   
    
    .log("bare_verb", "preload1")  
    .log("life_status_year_verb", "preload1")
    .log("life_status_year_before", "preload1")
    .log("life_status_year_after", "preload1")
    .log("life_status_year_before_match", "preload1")
    .log("life_status_year_correct", "preload1")   
    
    .log( "notice", "preload1")  
    .log( "about", "preload1")     
    .log( "easyhard", "preload1")  
    .log( "strategy", "preload1")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


CheckPreloaded( "critical", 20000)
    .label( "preloadCritical" )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "preload2" )
    .log("type", "preload2")
    .log("life_status" , "preload2")
    .log("lifetime" , "preload2")
    .log("died" , "preload2")
    
    .log("tense", "preload2")  
    .log("mismatch", "preload2")
    .log("match", "preload2")
    .log( "condition" , "preload2")
    .log("photo_rating", "preload2")
    .log("sentence_rating", "preload2")
    
    .log("occupation" , "preload2")  
    .log("occupation_distractor" , "preload2")
    .log("nationality" , "preload2")
    .log("nationality_distractor" , "preload2")   
    
    .log( "sentence" , "preload2")
    .log("list", "preload2")
    .log("name" , "preload2")
    //.log( "real_name" , "preload2")  
    //.log( "wrong_name" , "preload2")  
    //.log( "name_match" , "preload2")   
    
    .log("bare_verb", "preload2")  
    .log("life_status_year_verb", "preload2")
    .log("life_status_year_before", "preload2")
    .log("life_status_year_after", "preload2")
    .log("life_status_year_before_match", "preload2")
    .log("life_status_year_correct", "preload2")   
    
    .log( "notice", "preload2")  
    .log( "about", "preload2")     
    .log( "easyhard", "preload2")  
    .log( "strategy", "preload2")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


CheckPreloaded( "filler", 30000)
    .label( "preloadFillers" )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "preload3" )
    .log("type", "preload3")
    .log("life_status" , "preload3")
    .log("lifetime" , "preload3")
    .log("died" , "preload3")
    
    .log("tense", "preload3")  
    .log("mismatch", "preload3")
    .log("match", "preload3")
    .log( "condition" , "preload3")
    .log("photo_rating", "preload3")
    .log("sentence_rating", "preload3")
    
    .log("occupation" , "preload3")  
    .log("occupation_distractor" , "preload3")
    .log("nationality" , "preload3")
    .log("nationality_distractor" , "preload3")   
    
    .log( "sentence" , "preload3")
    .log("list", "preload3")
    .log("name" , "preload3")
    //.log( "real_name" , "preload3")  
    //.log( "wrong_name" , "preload3")  
    //.log( "name_match" , "preload3")   
    
    .log("bare_verb", "preload3")  
    .log("life_status_year_verb", "preload3")
    .log("life_status_year_before", "preload3")
    .log("life_status_year_after", "preload3")
    .log("life_status_year_before_match", "preload3")
    .log("life_status_year_correct", "preload3")   
    
    .log( "notice", "preload3")  
    .log( "about", "preload3")     
    .log( "easyhard", "preload3")  
    .log( "strategy", "preload3")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// Practice items

PennController.Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")// change this line for the appropriate experimental list
                         .filter("type" , "practice")
                         ,                                      
                         variable => ["practice",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          
                                          // NEW PHOTO and TEXT
                                          newImage("prac_photo", variable.file_name)
                                          ,
                                          newText("F_text", "F")
                                          ,
                                          newText("J_text", "J")
                                          ,
                                          newText("yes_text", "<i>(yes)")
                                          .settings.css("font-size", "20px") .settings.color("green")          
                                          ,
                                          newText("no_text", "<i>(no)")
                                          .settings.css("font-size", "20px") .settings.color("red")
                                          ,                                          
                                          // dots
                                          newText("dots", "...")
                                          .bold()
                                          .center()
                                          .print("50vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          // PHOTO 
                                          newCanvas("prac_photo", "70vw" , "70vh")
                                          .add("center at 50%", "center at 1%", newText("<i>Are you familiar with this person?</i><p>").settings.css("font-size", "18px") .settings.color("red") )
                                          .add("center at 50%", "center at 40%", getImage("prac_photo").size(400))                                                                                    
                                          .add( "center at 23%", "center at 40%", getText("F_text").settings.css("font-size", "20px"))
                                          .add( "center at 77%", "center at 40%", getText("J_text").settings.css("font-size", "20px"))
                                          .add("center at 22%", "center at 44%", getText("yes_text").settings.css("font-size", "20px"))// F-version
                                          //.add("center at 22%", "center at 44%", getText("no_text").settings.css("font-size", "20px"))// J-version
                                          .add("center at 77%", "center at 44%", getText("no_text").settings.css("font-size", "20px"))// F-version
                                          //.add("center at 77%", "center at 44%", getText("yes_text").settings.css("font-size", "20px"))// J-version                                                                                   
                                          .print()
                                          ,                                          
                                          newKey("photo_rating", "FJ")                                          
                                          .callback( getTimer("time_out").stop() )
                                          .log("all")  
                                          ,
                                          newTimer("time_out", 7000)
                                          .start()
                                          .log()
                                          .wait()
                                          ,     
                                          // clear everything
                                          getCanvas("prac_photo").remove()
                                          ,                                 
                                          getKey("photo_rating")
                                          .disable()
                                          ,
                                          // create variable for rating response
                                          newVar("photo_rating")
                                          .settings.global()
                                          .set(getKey("photo_rating") )
                                          ,
                                          // check if timedout
                                          getKey("photo_rating")
                                          .test.pressed()
                                          .failure(
                                              newText("time-out", "Oops! Try to be faster.")
                                              .settings.css("font-size", "20px")
                                              .settings.css("font-family","times new roman")
                                              .settings.color("red")
                                              .settings.center()
                                              .print("40vh")
                                              ,
                                              newText("spacebar", "Press the spacebar to continue.")
                                              .settings.css("font-size", "15px")
                                              .settings.css("font-family","times new roman")
                                              .settings.center()
                                              .settings.color("red")
                                              .print("55vh")
                                              ,
                                              newKey("time-out", " ")
                                              .wait()
                                              ,
                                              getText("time-out")
                                              .remove()
                                              ,
                                              getText("spacebar")
                                              .remove()
                                          )
                                          .success(
                                          )
                                          ,
                                          // context sentence instructions
                                          newText ("crit_instru","<i>Read the follow-up sentence sentence.")
                                          .settings.css("font-size", "15px")
                                          .settings.center()
                                          .settings.css("font-family","times new roman")
                                          .settings.color("red")
                                          .print("20vw","32vh")
                                          , 
                                          newText ("crit_instru_2","<i><b>Press the spacebar</b> to reveal the next chunk.</i>")
                                          .settings.css("font-size", "15px")
                                          .settings.center()
                                          .settings.css("font-family","times new roman")
                                          .settings.color("red")
                                          .print("20vw","47vh")
                                          ,                                  
                                          //critical sentence
                                          ...cumulative(variable.critical_spr, "remove")    
                                      ,
                                      // clear bio and crit sentences
                                      getText("crit_instru")
                                      .remove()
                                      ,
                                      getText("crit_instru_2") 
                                      .remove()         
                                      ,
                                      // present judgement task instructions
                                      newCanvas("sentence_instru", "70vw" , "70vh")
                                      .add("center at 50%", "center at 33%", newText("<i>Did the last sentence fit with the preceding photo?</i><p>").settings.css("font-size", "18px") .settings.color("red") )                                                                                    
                                      .add( "center at 23%", "center at 40%", getText("F_text").settings.css("font-size", "20px"))
                                      .add( "center at 77%", "center at 40%", getText("J_text").settings.css("font-size", "20px"))
                                      .add("center at 22%", "center at 44%", getText("yes_text").settings.css("font-size", "20px"))// F-version
                                      //.add("center at 22%", "center at 44%", getText("no_text").settings.css("font-size", "20px"))// J-version
                                      .add("center at 77%", "center at 44%", getText("no_text").settings.css("font-size", "20px"))// F-version
                                      //.add("center at 77%", "center at 44%", getText("yes_text").settings.css("font-size", "20px"))// J-version                                                                                   
                                      .print()
                                      ,
                                      newKey("sentence_rating", "FJ")
                                      .callback( getTimer("time_out1").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out1", 7000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,     
                                      // clear everything
                                      getCanvas("sentence_instru")
                                      .remove()
                                      ,                                 
                                      getKey("sentence_rating")
                                      .disable()
                                      ,
                                      // create variable for rating response
                                      newVar("sentence_rating") 
                                      .settings.global()
                                      .set(getKey("sentence_rating") )
                                      ,
                                      // check if timedout
                                      getKey("sentence_rating")
                                      .test.pressed()
                                      .failure(
                                          newText("time-out", "Oops! Try to be faster.")
                                          .settings.css("font-size", "20px")
                                          .settings.css("font-family","times new roman")
                                          .settings.color("red")
                                          .settings.center()
                                          .print("40vh")
                                          ,
                                          newText("spacebar", "Press the spacebar to continue.")
                                          .settings.css("font-size", "15px")
                                          .settings.css("font-family","times new roman")
                                          .settings.center()
                                          .settings.color("red")
                                          .print("55vh")
                                          ,
                                          newKey("time-out", " ")
                                          .wait()
                                      )
                                      .success(
                                      ))
                                      
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2"))   
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "no_key" , getVar("no_key"))
                                      
                                      .log("item_id" , variable.item_id )
                                      .log("type", variable.type)
                                      .log("life_status" , variable.life_status)
                                      .log("lifetime" , variable.lifetime)
                                      .log("died" , variable.died)
                                      
                                      .log("tense", variable.tense)  
                                      .log("mismatch", variable.mismatch)
                                      .log("match", variable.match) 
                                      .log( "condition" , variable.condition)
                                      .log("photo_rating", getVar("photo_rating"))
                                      .log("sentence_rating", getVar("sentence_rating"))
                                      
                                      .log("occupation" , variable.occupation)  
                                      .log("occupation_distractor" , variable.occupation_distractor)
                                      .log("nationality" , variable.nationality)
                                      .log("nationality_distractor" , variable.nationality_distractor)   
                                      
                                      .log( "sentence" , variable.critical)
                                      .log("list", variable.list)
                                      .log("name" , variable.name)
                                      //.log( "real_name" , variable.real_name)  
                                      //.log( "wrong_name" , variable.wrong_name)  
                                      //.log( "name_match" , variable.name_match)   
                                      
                                      .log("bare_verb", variable.bare_verb)  
                                      .log("life_status_year_verb", variable.life_status_year_verb)
                                      .log("life_status_year_before", variable.life_status_year_before)
                                      .log("life_status_year_after", variable.life_status_year_after)
                                      .log("life_status_year_before_match", variable.life_status_year_before_match)
                                      .log("life_status_year_correct", variable.life_status_year_correct)   
                                      
                                      .log( "notice", "practice")  
                                      .log( "about", "practice")      
                                      .log( "easyhard", "practice")    
                                      .log( "strategy", "practice") 
                                      
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") ) //logs what the URL version each participant used was.setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
                                      
                                     ]);


//====================================================================================================================================================================================================================
// 4. Post-practice Instructions
PennController( "instructions2" ,
                newCanvas("dots", 300, 100)
                .print()
                ,
                newText("intro_experiment", "<p>That's the end of the practice round. You can now start the actual experiment. <p> <p>The instructions that appeared during the practice round (e.g., <i>Press the spacebar to continue</i>) will no longer appear.<p> There will be two short breaks in between the three blocks.<p><b><i>Please attend to the experiment until you are finished. If you take too long, we won't be able to use your data!</i></b>")
                .settings.css("font-size", "20px")
                .print()
                ,
                newCanvas("instructions_canvas",900, 555)
                .settings.add(0, 0, getText("intro_experiment") )
                ,
                newButton("start_experiment3" ,"Continue to the experiment")
                .settings.center()
                .print()
                .wait()
                ,
                getCanvas("instructions_canvas")
                .remove()
                ,
                getButton("start_experiment3")
                .remove()
                ,
                newText("instructions_key", "<br><b>Press the spacebar to start the experiment.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                newKey("continue", " ")
                .wait()
                ,  
                getText("instructions_key")
                .remove()
                ,
                getText("intro_experiment")
                .remove()
                ,
                newTimer(1000)
                .start()
                .wait()                
               )                                 //end of experiment instructions screen   
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "instructions2" )
    .log("type", "instructions2")
    .log("life_status" , "instructions2")
    .log("lifetime" , "instructions2")
    .log("died" , "instructions2")
    
    .log("tense", "instructions2")  
    .log("mismatch", "instructions2")
    .log("match", "instructions2") 
    .log( "condition" , "instructions2")
    .log("rating", "instructions2")
    
    .log("occupation" , "instructions2")  
    .log("occupation_distractor" , "instructions2")
    .log("nationality" , "instructions2")
    .log("nationality_distractor" , "instructions2")   
    
    .log( "sentence" , "instructions2")
    .log("list", "instructions2")
    .log("name" , "instructions2")
    //.log( "real_name" , "instructions2")  
    //.log( "wrong_name" , "instructions2")  
    //.log( "name_match" , "instructions2")   
    
    .log("bare_verb", "instructions2")  
    .log("life_status_year_verb", "instructions2")
    .log("life_status_year_before", "instructions2")
    .log("life_status_year_after", "instructions2")
    .log("life_status_year_before_match", "instructions2")
    .log("life_status_year_correct", "instructions2")   
    
    .log( "notice", "instructions2")  
    .log( "about", "instructions2")     
    .log( "easyhard", "instructions2")  
    .log( "strategy", "instructions2")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") )
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// Critical items
PennController.Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")
                         .filter("type" , "critical")
                         ,  
                         //fullscreen()
                         //,
                         variable => ["critical",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          // NEW PHOTO and TEXT
                                          newImage("photo", variable.file_name)
                                          .size (400)
                                          ,
                                          newText("F_text", "F")
                                          .settings.css("font-size", "20px")
                                          ,
                                          newText("J_text", "J")
                                          .settings.css("font-size", "20px")
                                          ,
                                          newText("yes_text", "<i>(yes)")
                                          .settings.css("font-size", "20px") .settings.color("green")          
                                          ,
                                          newText("no_text", "<i>(no)")
                                          .settings.css("font-size", "20px") .settings.color("red")
                                          ,
                                          newText("yes_text_familiar", "<i>(familiar)")
                                          .settings.css("font-size", "20px") .settings.color("green")          
                                          ,
                                          newText("no_text_unfamiliar", "<i>(unfamiliar)")
                                          .settings.css("font-size", "20px") .settings.color("red")
                                          ,     
                                          // dots
                                          newText("dots", "...")
                                          .bold()
                                          .print("50vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          // context photo
                                          newCanvas("photo", "70vw" , "70vh")
                                          .add("center at 50%", "center at 35%", getImage("photo"))                                                                                    
                                          .add( "center at 23%", "center at 35%", getText("F_text"))
                                          .add( "center at 77%", "center at 35%", getText("J_text"))
                                          .add("center at 20%", "center at 39%", getText("yes_text_familiar"))// F-version
                                          //.add("center at 20%", "center at 39%", getText("no_text_unfamiliar"))// J-version
                                          .add("center at 81%", "center at 39%", getText("no_text_unfamiliar"))// F-version
                                          //.add("center at 81%", "center at 39%", getText("yes_text_familiar"))// J-version                                                                                   
                                          .print()
                                          ,
                                          newKey("photo_rating", "FJ")
                                          .callback( getTimer("time_out1").stop() )
                                          .log("all")  
                                          ,
                                          newTimer("time_out1", 7000)
                                          .start()
                                          .log()
                                          .wait()
                                          ,
                                          getCanvas("photo")
                                          .remove()
                                          ,                                  
                                          getKey("photo_rating")
                                          .disable()
                                          ,
                                          newVar("photo_rating") // this will create a new variable "photo_rating"
                                          .settings.global()
                                          .set(getKey("photo_rating") )
                                          ,
                                          
                                          //critical sentence
                                          ...cumulative(variable.critical_spr, "remove")    
                                      ,  
                                      newText("F_text", "F")
                                      .settings.css("font-size", "20px")
                                      .print("34vw","40vh")
                                      //.settings.color("green")
                                      ,
                                      newText("yes_text", "<i>(yes)")
                                      .settings.css("font-size", "20px")
                                      .print("32vw","45vh") // F-version
                                      //.print("64vw","45vh") // J-version
                                      .settings.color("green")
                                      ,
                                      newText("J_text", "J")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("65vw","40vh")
                                      //.settings.color("red")
                                      ,
                                      newText("no_text", "<i>(no)")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("64vw","45vh") // F-version
                                      //.print("32vw","45vh") // J-version
                                      .settings.color("red")
                                      ,
                                      newKey("sentence_rating", "FJ")
                                      .callback( getTimer("time_out2").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out2", 7000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,     
                                      getText("F_text")
                                      .remove()
                                      ,   
                                      getText("J_text")
                                      .remove()
                                      ,
                                      getText("no_text")
                                      .remove()
                                      ,
                                      getText("yes_text")
                                      .remove()
                                      ,                                  
                                      getKey("sentence_rating")
                                      .disable()
                                      ,
                                      newVar("sentence_rating") // this will create a new variable "photo_rating"
                                      .settings.global()
                                      .set(getKey("sentence_rating") )
                                      
                                      )
                                      
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2"))   
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "no_key" , getVar("no_key"))
                                      
                                      .log("item_id" , variable.item_id )
                                      .log("type", variable.type)
                                      .log("life_status" , variable.life_status)
                                      .log("lifetime" , variable.lifetime)
                                      .log("died" , variable.died)
                                      
                                      .log("tense", variable.tense)  
                                      .log("mismatch", variable.mismatch)
                                      .log("match", variable.match)
                                      .log( "condition" , variable.condition)
                                      .log("photo_rating", getVar("photo_rating"))
                                      .log("sentence_rating", getVar("sentence_rating"))
                                      
                                      .log("occupation" , variable.occupation)  
                                      .log("occupation_distractor" , variable.occupation_distractor)
                                      .log("nationality" , variable.nationality)
                                      .log("nationality_distractor" , variable.nationality_distractor)   
                                      
                                      .log( "sentence" , variable.critical)
                                      .log("list", variable.list)
                                      .log("name" , variable.name)
                                      //.log( "real_name" , variable.real_name)  
                                      //.log( "wrong_name" , variable.wrong_name)  
                                      //.log( "name_match" , variable.name_match)   
                                      
                                      .log("bare_verb", variable.bare_verb)  
                                      .log("life_status_year_verb", variable.life_status_year_verb)
                                      .log("life_status_year_before", variable.life_status_year_before)
                                      .log("life_status_year_after", variable.life_status_year_after)
                                      .log("life_status_year_before_match", variable.life_status_year_before_match)
                                      .log("life_status_year_correct", variable.life_status_year_correct)   
                                      
                                      .log( "notice", "critical")  
                                      .log( "about", "critical")      
                                      .log( "easyhard", "critical")    
                                      .log( "strategy", "critical")
                                      
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                     ]
                        );

//====================================================================================================================================================================================================================
// Filler items
PennController.Template( PennController.GetTable( "Fillers_HistLifetime.csv")
                         .filter("type" , "filler")
                         //, 
                         //fullscreen()
                         ,
                         variable => ["filler",
                                      "PennController", PennController(
                                          defaultText
                                          .settings.css("font-family","courier")
                                          ,
                                          // NEW PHOTO and TEXT
                                          newImage("photo", variable.file_name)
                                          .size (400)
                                          ,
                                          newText("F_text", "F")
                                          .settings.css("font-size", "20px")
                                          ,
                                          newText("J_text", "J")
                                          .settings.css("font-size", "20px")
                                          ,
                                          newText("yes_text", "<i>(yes)")
                                          .settings.css("font-size", "20px") .settings.color("green")          
                                          ,
                                          newText("no_text", "<i>(no)")
                                          .settings.css("font-size", "20px") .settings.color("red")
                                          ,
                                          newText("yes_text_familiar", "<i>(familiar)")
                                          .settings.css("font-size", "20px") .settings.color("green")          
                                          ,
                                          newText("no_text_unfamiliar", "<i>(unfamiliar)")
                                          .settings.css("font-size", "20px") .settings.color("red")
                                          ,     
                                          // dots
                                          newText("dots", "...")
                                          .bold()
                                          .print("50vw","40vh")
                                          ,
                                          newTimer("dots", 1000)
                                          .start()
                                          .wait()
                                          ,
                                          getText("dots")
                                          .remove()
                                          ,
                                          // context photo
                                          newCanvas("photo", "70vw" , "70vh")
                                          .add("center at 50%", "center at 35%", getImage("photo"))                                                                                    
                                          .add( "center at 23%", "center at 35%", getText("F_text"))
                                          .add( "center at 77%", "center at 35%", getText("J_text"))
                                          .add("center at 20%", "center at 39%", getText("yes_text_familiar"))// F-version
                                          //.add("center at 20%", "center at 39%", getText("no_text_unfamiliar"))// J-version
                                          .add("center at 81%", "center at 39%", getText("no_text_unfamiliar"))// F-version
                                          //.add("center at 81%", "center at 39%", getText("yes_text_familiar"))// J-version                                                                                   
                                          .print()
                                          ,
                                          newKey("photo_rating", "FJ")
                                          .callback( getTimer("time_out1").stop() )
                                          .log("all")  
                                          ,
                                          newTimer("time_out1", 7000)
                                          .start()
                                          .log()
                                          .wait()
                                          ,
                                          getCanvas("photo")
                                          .remove()
                                          ,                                  
                                          getKey("photo_rating")
                                          .disable()
                                          ,
                                          newVar("photo_rating") // this will create a new variable "photo_rating"
                                          .settings.global()
                                          .set(getKey("photo_rating") )
                                          ,
                                          
                                          //critical sentence
                                          ...cumulative(variable.critical_spr, "remove")    
                                      ,  
                                      newText("F_text", "F")
                                      .settings.css("font-size", "20px")
                                      .print("34vw","40vh")
                                      //.settings.color("green")
                                      ,
                                      newText("yes_text", "<i>(yes)")
                                      .settings.css("font-size", "20px")
                                      .print("32vw","45vh") // F-version
                                      //.print("64vw","45vh") // J-version
                                      .settings.color("green")
                                      ,
                                      newText("J_text", "J")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("65vw","40vh")
                                      //.settings.color("red")
                                      ,
                                      newText("no_text", "<i>(no)")
                                      .settings.css("font-size", "20px")
                                      .settings.center()
                                      .print("64vw","45vh") // F-version
                                      //.print("32vw","45vh") // J-version
                                      .settings.color("red")
                                      ,
                                      newKey("sentence_rating", "FJ")
                                      .callback( getTimer("time_out2").stop() )
                                      .log("all")  
                                      ,
                                      newTimer("time_out2", 7000)
                                      .start()
                                      .log()
                                      .wait()
                                      ,     
                                      getText("F_text")
                                      .remove()
                                      ,   
                                      getText("J_text")
                                      .remove()
                                      ,
                                      getText("no_text")
                                      .remove()
                                      ,
                                      getText("yes_text")
                                      .remove()
                                      ,                                 
                                      getKey("sentence_rating")
                                      .disable()
                                      ,
                                      newVar("sentence_rating") // this will create a new variable "photo_rating"
                                      .settings.global()
                                      .set(getKey("sentence_rating") )
                                      
                                      )
                                      
                                      .log("prolificID", getVar("proID"))
                                      .log("age", getVar("IDage"))
                                      .log("sex", getVar("IDsex"))
                                      .log("L2", getVar("IDling"))
                                      .log("whichL2", getVar("whichL2"))   
                                      .log( "yes_key" , getVar("yes_key"))
                                      .log( "no_key" , getVar("no_key"))
                                      
                                      .log("item_id" , variable.item_id )
                                      .log("type", variable.type)
                                      .log("life_status" , variable.life_status)
                                      .log("lifetime" , "filler")
                                      .log("died" , variable.died)
                                      
                                      .log("tense", variable.tense)  
                                      .log("mismatch", variable.mismatch)
                                      .log("match", variable.match)
                                      .log("condition" , variable.condition)
                                      .log("photo_rating", getVar("photo_rating"))
                                      .log("sentence_rating", getVar("sentence_rating"))
                                      
                                      .log("occupation" , variable.occupation)  
                                      .log("occupation_distractor" , "filler")
                                      .log("nationality" , variable.nationality)
                                      .log("nationality_distractor" , "filler")   
                                      
                                      .log( "sentence" , variable.critical)
                                      .log("list", variable.list)
                                      .log("name" , variable.name)
                                      //.log( "real_name" , variable.real_name)  
                                      //.log( "wrong_name" , variable.wrong_name)  
                                      //.log( "name_match" , variable.name_match)   
                                      
                                      .log("bare_verb", variable.bare_verb)  
                                      .log("life_status_year_verb", "filler")
                                      .log("life_status_year_before", "filler")
                                      .log("life_status_year_after", "filler")
                                      .log("life_status_year_before_match", "filler")
                                      .log("life_status_year_correct", "filler")   
                                      
                                      .log( "notice", "filler")  
                                      .log( "about", "filler")      
                                      .log( "easyhard", "filler")    
                                      .log( "strategy", "filler")
                                      
                                      .log( "withsquare", PennController.GetURLParameter("withsquare") )      
                                      
                                     ]);

//====================================================================================================================================================================================================================
// 6. Break

PennController( "break" ,
                newCanvas("dots", 300, 100)
                .print()
                ,
                newText("break_text", "<p><b>Time for a short break!</b> <br><p>This break will end after 20 seconds. If you'd like to skip the break and go straight back to the experiment, <b>press the spacebar</b>.<p>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()    
                ,
                newTimer("break_timer", 20000)
                .start()                
                ,
                newKey("continue_exp", " ")                 
                .callback( getTimer("break_timer").stop() )   
                ,
                getTimer("break_timer")
                .wait("first")
                ,
                getText("break_text")
                .remove()                
                ,
                getKey("continue_exp")
                .remove()   
                ,
                newText("instructions_key2", "<br><b>Press the spacebar to continue to the experiment.</b></br>")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                //F-Version:
                newKey("end_break", " ")
                //J-Version:
                //newKey("continue_Ja", "J")
                .wait()
                ,  
                getText("instructions_key2")
                .remove()                  
                ,
                newTimer(1000)
                .start()
                .wait()             
               )   
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "break" )
    .log("type", "break")
    .log("life_status" , "break")
    .log("lifetime" , "break")
    .log("died" , "break")
    
    .log("tense", "break")  
    .log("mismatch", "break")
    .log("match", "break") 
    .log( "condition" , "break")
    .log("rating", "break")
    
    .log("occupation" , "break")  
    .log("occupation_distractor" , "break")
    .log("nationality" , "break")
    .log("nationality_distractor" , "break")   
    
    .log( "sentence" , "break")
    .log("list", "break")
    .log("name" , "break")
    //.log( "real_name" , "break")  
    //.log( "wrong_name" , "break")  
    //.log( "name_match" , "break")   
    
    .log("bare_verb", "break")  
    .log("life_status_year_verb", "break")
    .log("life_status_year_before", "break")
    .log("life_status_year_after", "break")
    .log("life_status_year_before_match", "break")
    .log("life_status_year_correct", "break")   
    
    .log( "notice", "break")  
    .log( "about", "break")     
    .log( "easyhard", "break")  
    .log( "strategy", "break")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") )
    
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 2. Post-task instructions

PennController( "post_instructions",
                newText("post_instructions", "<p><b>That concludes the experiment!</b><p> <p>Before we let you go, we have two short tasks for you. <p>The first is a questionnaire about the experiment you just did.<p><p>Press the spacebar to continue to the questionnaire.")                         
                .settings.css("font-size", "20px")
                .print("center at 50%", "center at 35%")  
                ,
                newKey("post_start"," ")
                .wait()
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "post_instructions" )
    .log("type", "post_instructions")
    .log("life_status" , "post_instructions")
    .log("lifetime" , "post_instructions")
    .log("died" , "post_instructions")
    
    .log("tense", "post_instructions")  
    .log("mismatch", "post_instructions")
    .log("match", "post_instructions") 
    .log( "condition" , "post_instructions")
    .log("photo_rating", "post_instructions")
    .log("sentence_rating", "post_instructions")
    
    .log("occupation" , "post_instructions")  
    .log("occupation_distractor" , "post_instructions")
    .log("nationality" , "post_instructions")
    .log("nationality_distractor" , "post_instructions")   
    
    .log( "sentence" , "post_instructions")
    .log("list", "post_instructions")
    .log("name" , "post_instructions")
    //.log( "real_name" , "post_instructions")  
    //.log( "wrong_name" , "post_instructions")  
    //.log( "name_match" , "post_instructions")   
    
    .log("bare_verb", "post_instructions")  
    .log("life_status_year_verb", "post_instructions")
    .log("life_status_year_before", "post_instructions")
    .log("life_status_year_after", "post_instructions")
    .log("life_status_year_before_match", "post_instructions")
    .log("life_status_year_correct", "post_instructions")   
    
    .log( "notice", "post_instructions")  
    .log( "about", "post_instructions")     
    .log( "easyhard", "post_instructions")  
    .log( "strategy", "post_instructions")  
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") )
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);



// --------------------------------------------------------------------------------------------------------------
// 3. Post-experiment questionnaire

PennController("post_ques",
               newText("post-instruc", "Please answer the following questions about the experiment. <br>Try to be brief but informative.<p><p>")
               .settings.bold()
               .print()
               ,
               // Q1
               newText("notice", "(1) Was there anything about the experiment that stood out to you? Any patterns/regularities, anything strange or surprising?<p>")
               .print()
               ,
               newTextInput("notice")
               .size(600,50)
               .print()
               .log()
               ,
               newText("blank", "<p>")
               .print()
               ,
               newButton("next1", "Next Question")
               .print()
               .wait()
               ,
               getButton("next1")
               .remove()
               ,
               // Q2
               newText("about", "(2) What do you think the experiment might have been about? Make as many guesses as you like.<p>")
               .print()
               ,
               newTextInput("about")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next2", "Next Question")
               .print()
               .wait()
               ,
               getButton("next2")
               .remove()
               ,
               //Q3
               newText("easyhard", "(3) Was there anything you found particularly easy or difficult?<p>")
               .print()
               ,
               newTextInput("easyhard","")
               .size(600, 50)
               .print()
               .log()
               ,     
               newText("blank", "<p>")
               .print()
               ,            
               newButton("next3", "Next Question")
               .print()
               .wait()
               ,
               getButton("next3")
               .remove()
               ,
               // Q4
               newText("strategy", "(4) Did you use any strategies during the experiment? If so, what were they?<p>")
               .print()
               ,
               newTextInput("strategy","")
               .size(600, 50)
               .print()
               .log()
               ,   
               newText("blank", "<p>")
               .print()
               ,              
               newButton("next4", "Finished")
               .print()
               .wait()
               ,
               // create Vars
               newVar("notice") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("notice") )
               ,
               newVar("about") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("about") )
               ,
               newVar("easyhard") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("easyhard") )
               ,
               newVar("strategy") // this will create a new variable "ID"; MUST be after the 'Start' button click
               .settings.global()
               .set(getTextInput("strategy") )
              )  
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "post_ques" )
    .log("type", "post_ques")
    .log("life_status" , "post_ques")
    .log("lifetime" , "post_ques")
    .log("died" , "post_ques")
    
    .log("tense", "post_ques")  
    .log("mismatch", "post_ques")
    .log("match", "post_ques") 
    .log( "condition" , "post_ques")
    .log("photo_rating", "post_ques")
    .log("sentence_rating", "post_ques")
    
    .log("occupation" , "post_ques")  
    .log("occupation_distractor" , "post_ques")
    .log("nationality" , "post_ques")
    .log("nationality_distractor" , "post_ques")   
    
    .log( "sentence" , "post_ques")
    .log("list", "post_ques")
    .log("name" , "post_ques")
    //.log( "real_name" , "post_ques")  
    //.log( "wrong_name" , "post_ques")  
    //.log( "name_match" , "post_ques")   
    
    .log("bare_verb", "post_ques")  
    .log("life_status_year_verb", "post_ques")
    .log("life_status_year_before", "post_ques")
    .log("life_status_year_after", "post_ques")
    .log("life_status_year_before_match", "post_ques")
    .log("life_status_year_correct", "post_ques")   
    
    .log( "notice", getVar("notice"))  
    .log( "about", getVar("about"))      
    .log( "easyhard", getVar("easyhard"))    
    .log( "strategy", getVar("strategy"))
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") );

//====================================================================================================================================================================================================================
// 7. Comprehension test explanation screen //

PennController( "post_task_intro",
                newText("comp1_1", "<p>Thank you for your feedback! We have a final task for you to complete before you are presented with your Prolific validation link.</b>")
                .settings.css("font-size", "20px")
                ,        
                newText("comp1_2", "You will be presented with some prompts to which you respond using the <b>F</b> and <b>J</b> keys:"
                        + " <p>(1) You will see a <b> photo</b> from the experiment. Again, you press F or J to indicate if you're familiar with the person."
                        + " <p>(2) Next, you will see the words <b>'alive'</b> and <b>'dead'</b>. Press F or J to select the one that describes the person's current status."
                        + " <p>(3) Next, you will see <b>two nationalities</b>. Again, press F or J to select the one that describes the person."
                        +  "<p>(4) Lastly, you'll be presented <b>two occupations</b>. Select whichever you believe the person is best known for by pressing F or J."
                        + "<p><p> For photos that you said you don't recognise, you guess for these prompts."
                        +  "<p><p>Press the spacebar to continue to a short practice round.")
                .settings.css("font-size", "20px")
                ,
                newCanvas("compCanv", 900, 300)
                .settings.add(0,0, getText("comp1_1"))
                .settings.add(0,100, getText("comp1_2")  )
                .print()   
                ,
                newKey("compStart", " ")
                .wait()
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "post_task_intro" )
    .log("type", "post_task_intro")
    .log("life_status" , "post_task_intro")
    .log("lifetime" , "post_task_intro")
    .log("died" , "post_task_intro")
    
    .log("tense", "post_task_intro")  
    .log("mismatch", "post_task_intro")
    .log("match", "post_task_intro") 
    .log( "condition" , "post_task_intro")
    .log("photo_rating", "post_task_intro")
    .log("sentence_rating", "post_task_intro")
    
    .log("occupation" , "post_task_intro")  
    .log("occupation_distractor" , "post_task_intro")
    .log("nationality" , "post_task_intro")
    .log("nationality_distractor" , "post_task_intro")   
    
    .log( "sentence" , "post_task_intro")
    .log("list", "post_task_intro")
    .log("name" , "post_task_intro")
    //.log( "real_name" , "post_task_intro")  
    //.log( "wrong_name" , "post_task_intro")  
    //.log( "name_match" , "post_task_intro")   
    
    .log("bare_verb", "post_task_intro")  
    .log("life_status_year_verb", "post_task_intro")
    .log("life_status_year_before", "post_task_intro")
    .log("life_status_year_after", "post_task_intro")
    .log("life_status_year_before_match", "post_task_intro")
    .log("life_status_year_correct", "post_task_intro")   
    
    .log( "notice", getVar("notice"))  
    .log( "about", getVar("about"))      
    .log( "easyhard", getVar("easyhard"))    
    .log( "strategy", getVar("strategy")) 
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") )
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 11. Post task Practice

PennController. Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")// change this line for the appropriate experimental list
                          .filter("type" , "practice")
                          ,
                          variable => ["post_task_prac",
                                       "PennController", PennController(
                                           defaultText
                                           .css({"font-family":"courier","font-size":"20px"})
                                           .center()
                                           ,
                                           defaultSelector
                                           .once()
                                           .log()
                                           ,
                                           defaultCanvas
                                           .log()
                                           .center()
                                           ,
                                           // NEW PHOTO and TEXT
                                           newImage("post_photo",  variable.file_name)
                                           .size(400)
                                           ,
                                           newText("occupation_correct", variable.occupation)
                                           ,
                                           newText("occupation_incorrect", variable.occupation_distractor)
                                           ,
                                           newText("nationality_correct",  variable.nationality)
                                           ,
                                           newText("nationality_incorrect",  variable.nationality_distractor)
                                           ,
                                           newText("life_status_correct", variable.life_status)
                                           ,
                                           newText("life_status_incorrect", variable.life_status_distractor)
                                           ,
                                           newText("life_status_year1", variable.life_status_year_before)
                                           ,
                                           newText("life_status_year2", variable.life_status_year_after)
                                           ,
                                           newText("F_text", "F")
                                           ,
                                           newText("J_text", "J")
                                           ,
                                           newText("yes_text", "<i>(yes)")
                                           .settings.css("font-size", "20px") .settings.color("green")          
                                           ,
                                           newText("no_text", "<i>(no)")
                                           .settings.css("font-size", "20px") .settings.color("red")
                                           ,
                                           // PHOTO
                                           newCanvas("photo", "70vw" , "70vh")
                                           .add("center at 50%", "center at 1%", newText("Are you familiar with this person?<p>")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add("center at 50%", "center at 40%", getImage("post_photo"))                                                                                    
                                           .add( "center at 23%", "center at 40%", getText("F_text"))
                                           .add( "center at 77%", "center at 40%", getText("J_text"))
                                           .add("center at 23%", "center at 44%", getText("yes_text"))// F-version
                                           //.add("center at 23%", "center at 44%", getText("no_text"))// J-version
                                           .add("center at 77%", "center at 44%", getText("no_text"))// F-version
                                           //.add("center at 77%", "center at 44%", getText("yes_text"))// J-version                                                                                   
                                           .print()
                                           ,
                                           newSelector("post_photo")
                                           .add( getText("F_text"),getText("J_text"))                                             
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("photo").remove()
                                           ,
                                           // LIFE STATUS
                                           newCanvas("life_status", "70vw" , "70vh")
                                           .add("center at 50%", "center at 36%", newText("They are currently...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add( "center at 30%", "center at 44%", getText("life_status_correct"))
                                           .add( "center at 70%", "center at 44%", getText("life_status_incorrect"))
                                           .add("center at 30%", "center at 51%", getText("F_text") )
                                           .add("center at 70%", "center at 51%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_life_status")
                                           .add(getText("life_status_correct"), getText("life_status_incorrect"))
                                           .shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("life_status").remove()
                                           ,
                                           // LIFE STATUS 2
                                           newCanvas("life_status2", "70vw" , "70vh")
                                           .add("center at 50%", "center at 36%", newText("They "+ variable.life_status_year_verb + "...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add( "center at 30%", "center at 44%", getText("life_status_year1"))
                                           .add( "center at 70%", "center at 44%", getText("life_status_year2"))
                                           .add("center at 30%", "center at 51%", getText("F_text") )
                                           .add("center at 70%", "center at 51%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_life_status2")
                                           .add(getText("life_status_year1"), getText("life_status_year2"))
                                           //.shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("life_status2").remove()
                                           ,
                                           // NATIONALITY
                                           newCanvas("nationality", "70vw" , "70vh")
                                           .add("center at 50%", "center at 36%", newText("Their nationality is/was...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add( "center at 30%", "center at 44%", getText("nationality_correct"))
                                           .add( "center at 70%", "center at 44%", getText("nationality_incorrect"))
                                           .add("center at 30%", "center at 51%", getText("F_text") )
                                           .add("center at 70%", "center at 51%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_nationality")
                                           .add(getText("nationality_correct"), getText("nationality_incorrect"))
                                           .shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("nationality").remove()
                                           ,
                                           // OCCUPATIION
                                           newCanvas("occupation", "70vw" , "70vh")
                                           .add("center at 50%", "center at 36%", newText("They are most known for being a(n)...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add(  "center at 30%", "center at 44%", getText("occupation_correct"))
                                           .add("center at 70%", "center at 44%", getText("occupation_incorrect"))
                                           .add("center at 30%", "center at 51%", getText("F_text") )
                                           .add("center at 70%", "center at 51%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_occupation")
                                           .add(getText("occupation_correct"), getText("occupation_incorrect"))
                                           .shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("occupation").remove()
                                           ,
                                           // WAIT
                                           newCanvas("dots", "70vw" , "70vh")
                                           .add("center at 50%", "center at 40%", newText("pleasewait_post2", "...").bold())
                                           .print()
                                           ,
                                           newTimer("wait_post2", 1000)
                                           .start()
                                           .wait()
                                           ,
                                           getCanvas("dots").remove()
                                       )
                                       
                                       .log("prolificID", getVar("proID"))
                                       .log("age", getVar("IDage"))
                                       .log("sex", getVar("IDsex"))
                                       .log("L2", getVar("IDling"))
                                       .log("whichL2", getVar("whichL2"))   
                                       .log( "yes_key" , getVar("yes_key"))
                                       .log( "no_key" , getVar("no_key"))
                                       
                                       .log("item_id" , variable.item_id )
                                       .log("type", variable.type)
                                       .log("life_status" , variable.life_status)
                                       .log("lifetime" , variable.lifetime)
                                       .log("died" , variable.died)
                                       
                                       .log("tense", variable.tense)  
                                       .log("mismatch", variable.mismatch)
                                       .log("match", variable.match)
                                       .log( "condition" , variable.condition)
                                       .log("rating", getVar("rating"))
                                       
                                       .log("occupation" , variable.occupation)  
                                       .log("occupation_distractor" , variable.occupation_distractor)
                                       .log("nationality" , variable.nationality)
                                       .log("nationality_distractor" , variable.nationality_distractor)   
                                       
                                       .log( "sentence" , variable.critical)
                                       .log("list", variable.list)
                                       .log("name" , variable.name)
                                       .log("photo" , variable.file_name)
                                       //.log( "real_name" , variable.real_name)  
                                       //.log( "wrong_name" , variable.wrong_name)  
                                       //.log( "name_match" , variable.name_match)   
                                       
                                       .log("bare_verb", variable.bare_verb)  
                                       .log("life_status_year_verb", variable.life_status_year_verb)
                                       .log("life_status_year_before", variable.life_status_year_before)
                                       .log("life_status_year_after", variable.life_status_year_after)
                                       .log("life_status_year_before_match", variable.life_status_year_before_match)
                                       .log("life_status_year_correct", variable.life_status_year_correct)   
                                       
                                       .log( "notice", getVar("notice"))  
                                       .log( "about", getVar("about"))      
                                       .log( "easyhard", getVar("easyhard"))    
                                       .log( "strategy", getVar("strategy"))
                                       
                                       .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                       
                                      ]);  

//====================================================================================================================================================================================================================
// 7. Comprehension test explanation screen //

PennController( "post_task_start",
                newText("post_start", "<p>That was the practice round. When you're ready to continue, press the spacebar.")
                .settings.css("font-size", "20px")
                .print("center at 50%", "center at 35%")   
                ,
                newKey("compStart", " ")
                .wait()
               )
    
    .log("prolificID", getVar("proID"))
    .log("age", getVar("IDage"))
    .log("sex", getVar("IDsex"))
    .log("L2", getVar("IDling"))
    .log("whichL2", getVar("whichL2"))   
    .log( "yes_key" , getVar("yes_key"))
    .log( "no_key" , getVar("no_key"))
    
    .log("item_id" , "post_task_intro2")
    .log("type", "post_task_intro2")
    .log("life_status" , "post_task_intro2")
    .log("lifetime" , "post_task_intro2")
    .log("died" , "post_task_intro2")
    
    .log("tense", "post_task_intro2")  
    .log("mismatch", "post_task_intro2")
    .log("match", "post_task_intro2")
    .log( "condition" , "post_task_intro2")
    .log("photo_rating", "post_task_intro2")
    .log("sentence_rating", "post_task_intro2")
    
    .log("occupation" , "post_task_intro2")  
    .log("occupation_distractor" , "post_task_intro2")
    .log("nationality" , "post_task_intro2")
    .log("nationality_distractor" , "post_task_intro2")
    
    .log( "sentence" , "post_task_intro2")
    .log("list", "post_task_intro2")
    .log("name" , "post_task_intro2")
    //.log( "real_name" , variable.real_name)  
    //.log( "wrong_name" , variable.wrong_name)  
    //.log( "name_match" , variable.name_match)   
    
    .log("bare_verb", "post_task_intro2")
    .log("life_status_year_verb", "post_task_intro2")
    .log("life_status_year_before", "post_task_intro2")
    .log("life_status_year_after", "post_task_intro2")
    .log("life_status_year_before_match", "post_task_intro2")
    .log("life_status_year_correct", "post_task_intro2") 
    
    .log( "notice", getVar("notice"))  
    .log( "about", getVar("about"))      
    .log( "easyhard", getVar("easyhard"))    
    .log( "strategy", getVar("strategy"))
    
    .log( "withsquare", PennController.GetURLParameter("withsquare") )
    
    .setOption("countsForProgressBar", false)   //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);

//====================================================================================================================================================================================================================
// 11. Post task (Pretest 3)

PennController. Template( PennController.GetTable( "Crit_Stimuli_HistLifetime.csv")// change this line for the appropriate experimental list
                          .filter("type" , "critical")
                          .filter("life_status" , /^(dead|alive)$/)
                          ,
                          variable => ["post_task",
                                       "PennController", PennController(
                                           defaultText
                                           .css({"font-family":"courier","font-size":"20px"})
                                           .center()
                                           ,
                                           defaultSelector
                                           .once()
                                           .log()
                                           ,
                                           defaultCanvas
                                           .log()
                                           .center()
                                           // NEW TEXT
                                           ,
                                           newImage("post_photo",  variable.file_name)
                                           .size(400)
                                           ,
                                           newText("occupation_correct", variable.occupation)
                                           ,
                                           newText("occupation_incorrect", variable.occupation_distractor)
                                           ,
                                           newText("nationality_correct",  variable.nationality)
                                           ,
                                           newText("nationality_incorrect",  variable.nationality_distractor)
                                           ,
                                           newText("life_status_correct", variable.life_status)
                                           ,
                                           newText("life_status_incorrect", variable.life_status_distractor)
                                           ,
                                           newText("life_status_year1", variable.life_status_year_before)
                                           ,
                                           newText("life_status_year2", variable.life_status_year_after)      
                                           ,
                                           newText("F_text", "F")
                                           ,
                                           newText("J_text", "J")
                                           ,
                                           newText("yes_text_familiar", "<i>(familiar)")
                                           .settings.color("green").settings.css("font-size", "18px")          
                                           ,
                                           newText("no_text_unfamiliar", "<i>(unfamiliar)")
                                           .settings.color("red").settings.css("font-size", "18px") 
                                           ,
                                           // PHOTO
                                           newCanvas("photo", "70vw" , "70vh")
                                           .add("center at 50%", "center at 35%", getImage("post_photo"))                                                                                    
                                           .add( "center at 22%", "center at 35%", getText("F_text"))
                                           .add( "center at 79%", "center at 35%", getText("J_text"))
                                           .add("center at 20%", "center at 39%", getText("yes_text_familiar"))// F-version
                                           //.add("center at 20%", "center at 35%", getText("no_text_unfamiliar"))// J-version
                                           .add("center at 81%", "center at 39%", getText("no_text_unfamiliar"))// F-version
                                           //.add("center at 81%", "center at 35%", getText("yes_text_familiar"))// J-version                                                                                   
                                           .print()
                                           ,
                                           
                                           newSelector("post_photo")
                                           .add( getText("F_text"),getText("J_text"))                                             
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("photo").remove()
                                           ,
                                           // LIFE STATUS
                                           newCanvas("life_status", "70vw" , "70vh")
                                           .add("center at 50%", "center at 29%", newText("currently...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add( "center at 30%", "center at 35%", getText("life_status_correct"))
                                           .add( "center at 70%", "center at 35%", getText("life_status_incorrect"))
                                           .add("center at 30%", "center at 42%", getText("F_text") )
                                           .add("center at 70%", "center at 42%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_life_status")
                                           .add(getText("life_status_correct"), getText("life_status_incorrect"))
                                           .shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("life_status").remove()
                                           ,
                                           // LIFE STATUS 2
                                           newCanvas("life_status2", "70vw" , "70vh")
                                           .add("center at 50%", "center at 29%", newText( variable.life_status_year_verb + "...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add( "center at 30%", "center at 35%", getText("life_status_year1"))
                                           .add( "center at 70%", "center at 35%", getText("life_status_year2"))
                                           .add("center at 30%", "center at 42%", getText("F_text") )
                                           .add("center at 70%", "center at 42%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_life_status2")
                                           .add(getText("life_status_year1"), getText("life_status_year2"))
                                           //.shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("life_status2").remove()
                                           ,
                                           // NATIONALITY
                                           newCanvas("nationality", "70vw" , "70vh")
                                           .add("center at 50%", "center at 29%", newText("nationality ...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add( "center at 30%", "center at 35%", getText("nationality_correct"))
                                           .add( "center at 70%", "center at 35%", getText("nationality_incorrect"))
                                           .add("center at 30%", "center at 42%", getText("F_text") )
                                           .add("center at 70%", "center at 42%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_nationality")
                                           .add(getText("nationality_correct"), getText("nationality_incorrect"))
                                           .shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("nationality").remove()
                                           ,
                                           // OCCUPATIION
                                           newCanvas("occupation", "70vw" , "70vh")
                                           .add("center at 50%", "center at 29%", newText("most known as a(n) ...")
                                                .settings.css("font-size", "18px") .settings.color("red") )
                                           .add(  "center at 30%", "center at 35%", getText("occupation_correct"))
                                           .add("center at 70%", "center at 35%", getText("occupation_incorrect"))
                                           .add("center at 30%", "center at 42%", getText("F_text") )
                                           .add("center at 70%", "center at 42%", getText("J_text") )
                                           .print()
                                           ,
                                           newSelector("post_occupation")
                                           .add(getText("occupation_correct"), getText("occupation_incorrect"))
                                           .shuffle()
                                           .keys("F", "J")
                                           .wait()
                                           ,
                                           getCanvas("occupation").remove()
                                           ,
                                           // WAIT
                                           newCanvas("dots", "70vw" , "70vh")
                                           .add("center at 50%", "center at 35%", newText("pleasewait_post2", "...").bold())
                                           .print()
                                           ,
                                           newTimer("wait_post2", 1000)
                                           .start()
                                           .wait()
                                           ,
                                           getCanvas("dots").remove()
                                       )
                                       
                                       .log("prolificID", getVar("proID"))
                                       .log("age", getVar("IDage"))
                                       .log("sex", getVar("IDsex"))
                                       .log("L2", getVar("IDling"))
                                       .log("whichL2", getVar("whichL2"))   
                                       .log( "yes_key" , getVar("yes_key"))
                                       .log( "no_key" , getVar("no_key"))
                                       
                                       .log("item_id" , variable.item_id )
                                       .log("type", variable.type)
                                       .log("life_status" , variable.life_status)
                                       .log("lifetime" , variable.lifetime)
                                       .log("died" , variable.died)
                                       
                                       .log("tense", variable.tense)  
                                       .log("mismatch", variable.mismatch)
                                       .log("match", variable.match)
                                       .log( "condition" , variable.condition)
                                       .log("rating", getVar("rating"))
                                       
                                       .log("occupation" , variable.occupation)  
                                       .log("occupation_distractor" , variable.occupation_distractor)
                                       .log("nationality" , variable.nationality)
                                       .log("nationality_distractor" , variable.nationality_distractor)   
                                       
                                       .log( "sentence" , variable.critical)
                                       .log("list", variable.list)
                                       .log("name" , variable.name)
                                       //.log( "real_name" , variable.real_name)  
                                       //.log( "wrong_name" , variable.wrong_name)  
                                       //.log( "name_match" , variable.name_match)   
                                       
                                       .log("bare_verb", variable.bare_verb)  
                                       .log("life_status_year_verb", variable.life_status_year_verb)
                                       .log("life_status_year_before", variable.life_status_year_before)
                                       .log("life_status_year_after", variable.life_status_year_after)
                                       .log("life_status_year_before_match", variable.life_status_year_before_match)
                                       .log("life_status_year_correct", variable.life_status_year_correct)   
                                       
                                       .log( "notice", getVar("notice"))  
                                       .log( "about", getVar("about"))      
                                       .log( "easyhard", getVar("easyhard"))    
                                       .log( "strategy", getVar("strategy"))
                                       
                                       .log( "withsquare", PennController.GetURLParameter("withsquare") )
                                       
                                      ]);    

//====================================================================================================================================================================================================================
// 3. Send results

PennController.SendResults( "send" ) // important!!! Sends all results to the server
    
    .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);


// --------------------------------------------------------------------------------------------------------------
// 4. Thank you screen

PennController( "final"
                ,
                newText("<p>Thank you for your participation!<p>"
                        + "To receive your payment click here: <a href='https://app.prolific.co/submissions/complete?cc=2A6E2C0E' target='_blank' >Validate participation</a><p><p>If you have any questions about this study please contact us at <b>petrenal@hu-berlin.de</b>.")
                .settings.css("font-size", "20px")
                .settings.center()
                .print()
                ,
                newButton("void")
                .wait()
               )
    
    .setOption("countsForProgressBar", false)    //overrides some default settings, such as countsForProgressBar
    .setOption("hideProgressBar", true);
