
PennController.ResetPrefix()

DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// This is run at the beginning of each trial
//Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
newVar("ID").global()    
//)
//.log("id" , getVar("ID")) // Add the ID to all trials' results lines

//Sequence
Sequence("consent", "instructions", "paid","experiment_start", randomizeNoMoreThan(anyOf("gt", "ks", "pst", "td", "ca"), 1), SendResults(), "end")
//Sequence(randomizeNoMoreThan(anyOf("td", "gt", "ks", "pst"), 1), SendResults(), "end")

// Rename the progress bar
var progressBarText = "Fortschritt"

// Consent
newTrial("consent",
    newHtml("consent", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("Sie müssen der Datenschutzerklärung zustimmen, um am Experiment teilnehmen zu können.")
        .center()
        .print()
    ,
    newButton("consent_next", "Weiter")
        .center()
        .css("font-size", "13pt")
        .css("font-family", "Helvetica")
        .css("margin-top", "1em")
        .size(100,40)
        .print()
        .log()
        .wait(getHtml("consent").test.complete()
            .failure(getHtml("consent").warn())
        )
)
      
// Instructions
newTrial("instructions",
    newHtml("instructions", "instructions.html")
        .center()
        .print()
    ,
    newButton("intructions_next", "Weiter")
        .center()
        .css("font-size", "13pt")
        .css("font-family", "Helvetica")
        .css("margin-top", "1em")
        .size(150,40)
        .print()
        .log()
        .wait()
)

// Prolific ID
newTrial("paid",
    // Remove instructions after button press
    newText("paid-text", "Bitte geben Sie Ihre Prolific-ID ein, bevor Sie fortfahren.")
        .center()
        .css("margin-top", "5em")
        .css("font-size", "14pt")
        .print()
    ,
    newTextInput("inputID", "")
        .center()
        .css("margin","1.5em")    // Add a 1em margin around this element
       .print()
    ,
    newButton("start", "Weiter")
        .center()
        .css("font-size", "13pt")
        .css("font-family", "Helvetica")
        .css("margin-top", "1em")
        .size(100,40)
        .print()
        .log()
        // Only validate a click on Start when inputID has been filled
        .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( getTextInput("inputID") )
)

//Start der Übungsphase
newTrial("practice_start",
    newText("practice_start", "Vor dem eigentlichen Experiment findet eine kurze Übungsphase statt.")
        .css("margin-top", "5em")
        .css("font-size", "14pt")
        .css("line-height", "1.5em")
        .center()
        .print()
    ,
    newButton("weiter_zum_Experiment", "Weiter zur Übungsphase")
        .center()
        .css("font-size", "13pt")
        .css("font-family", "Helvetica")
        .css("margin-top", "3em")
        .size(250,40)
        .print()
        .log()
        .wait()    
    )

//Überleitung zum Experiment
newTrial("experiment_start",
    newText("experiment_start", "Bitte klicken Sie auf den Button um das eigentliche Experiment zu starten!")
        .css("margin-top", "5em")
        .css("font-size", "14pt")
        .center()
        .print()
    ,
    newButton("weiter_zum_Experiment", "Weiter")
        .center()
        .css("font-size", "13pt")
        .css("font-family", "Helvetica")
        .css("margin-top", "3em")
        .size(250,40)
        .print()
        .log()
        .wait()
)
    
// Trials      
customTrial = label => row =>
    newTrial(label,
    
        //Stimuli
        newHtml("item", row.StimHTML)
            .center()
            .css("line-height", "1.5em")
            .css("font-size", "15pt")
            .css("margin-top", "2em")
            .css("margin-bottom", "7em")
            .log()
            .print()
        ,
                // Grammaticality Judgement
        // Frage
        newText("grammaticality", "<b>Wie natürlich finden Sie die kursiv gesetzte Äußerung?</b>")
            .center()
            .css("font-size", "14pt")
            .css("margin","1.5em")
            .print()
            .log()
        ,
        // Skala generieren
        newText("scale_left", "völlig unnatürlich")
            .css("margin-left", "1em")
            .css("margin-top", "2.5em")
        ,
        newText("scale_right", "völlig natürlich")
            .css("margin-right", "1em")
            .css("margin-top", "2.5em")
        ,
        newScale("7pt", "1","2","3","4","5","6","7")
            .labelsPosition("top")
            .keys()
            .before(getText("scale_left"))
            .after(getText("scale_right"))
            .center()
            .bold()
            .css("margin", "10pt")
            .cssContainer("border", "solid 1px black")
            .log()
            .print()
        ,
        
        // Abgabe-Button
        newButton("scale_next", "Antwort abgeben")
            .center()
            .css("margin-top","2em") 
            .css("margin-bottom","2em")
            .css("font-size", "13pt")
            .css("font-family", "Helvetica")
            .size(200,40)
            .print()
            .log()
            .wait(getScale("7pt").test.selected() 
                  .failure(
                      newText("scale_warnning", "Sie müssen einen Wert auf der Skala wählen, bevor Sie fortfahren.")
                      .center().color("red").print())
             )
        ,
        newVar("screen_width")
            .global()
            .set($(window).width())
                    
        ,
        getScale("7pt")
            .disable()
  )
  //.log("type", row.Type) //item vs filler vs catch trial
  .log("item", row.StimHTML)
  .log("UID", row.UID)
  .log("screen_width", getVar("screen_width"))

// Übungsphase, Items und Filler ausführen
Template("gt_final.csv", customTrial("gt"))
Template("ks_final.csv", customTrial("ks"))
Template("pst_final.csv", customTrial("pst"))
Template("td_final.csv", customTrial("td"))
Template("ca_final.csv", customTrial("ca"))



// Last screen (after the experiment is done) 
newTrial("end"
    ,
    newText("Vielen Dank für Ihre Teilnahme.")
        .center()
        .print()
    ,
    // Prolific Code
    newText("<p style='text-align:center'>Bitte geben Sie folgenden Code bei Prolific ein, um Ihre Vergütung zu erhalten!  <br/><b>CPYTFBXB</b></p><p style='text-align:center'>Nachdem Sie den Code bei Prolific eingegeben haben, können Sie das Browserfenster schließen.")
        .center()
        .print()
    ,
    newButton()
        .wait()             // Wait for a click on a non-displayed button = wait here forever
)

.setOption("countsForProgressBar", false)
// Make sure the progress bar is full upon reaching this last (non-)trial
   
