$(document).ready(function(){

  var config = {
   apiKey: "AIzaSyAHCDyMPCT8MM6p4bS9lBcxtwWu3T_XaMY",
   authDomain: "train-scheduler2-63af5.firebaseapp.com",
   databaseURL: "https://train-scheduler2-63af5.firebaseio.com",
   projectId: "train-scheduler2-63af5",
   storageBucket: "",
 };
 firebase.initializeApp(config);
 
 
 var name = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";
  
  var dataRef = firebase.database();
  
  $("#submit-btn").on("click", function() {
    
    event.preventDefault();
    console.log("hi");

      name = $("#train-name-input").val().trim();
      destination = $("#destination-input").val().trim();
      firstTrainTime = $("#scheduled-time-input").val();
      frequency = $("#frequency-input").val();

      console.log(name);
      console.log(destination);
      console.log(firstTrainTime);
      console.log(frequency);
       
       dataRef.ref().push({

          Name: name,
          Destination: destination,
          FirstTrainTime: firstTrainTime,
          Frequency: frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
       });
    });
  
     dataRef.ref().on("child_added", function(snapshot) {
       
      var convertedTime = moment((snapshot.val().FirstTrainTime), "HH:mm").subtract(1, "years");
      console.log(convertedTime);

      var diffTime =  moment().diff(moment(convertedTime), "minutes");
      console.log(diffTime);
      var tRemainder = diffTime % snapshot.val().Frequency;
      console.log(tRemainder);
      var tMinutesTillTrain = snapshot.val().Frequency - tRemainder;
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log(tMinutesTillTrain);

      var newTrain = $("<tr scope='row'>")
      var newTrainName = $("<td>").text(snapshot.val().Name);
      var newTrainDestination = $("<td>").text(snapshot.val().Destination);
      var newTrainFrequency = $("<td>").text(snapshot.val().Frequency);
      var newTrainNextTime = $("<td>").text(moment(nextTrain).format("hh:mm"));
      var newTrainMinutesAway = $("<td>").text(tMinutesTillTrain)

       newTrain.append(newTrainName, newTrainDestination, newTrainFrequency, newTrainNextTime, newTrainMinutesAway);
       $("#new-trains-here").append(newTrain);
     }, function(errorObject) {
       console.log("Errors handled: " + errorObject.code);
   });

});
