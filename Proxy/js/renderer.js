


var app = angular.module('ai', ['base64']);
app.controller('ai_controller',[ 
    '$scope',
    '$window',
    '$interval',
    '$rootScope',
    'ai_model',
    '$base64',
function(
    $scope,
    $window,
    $interval,
    $rootScope,
    ai_model,
    $base64
){


    let processStatusLocalVar = false;
    let processStatusColorIndicatorLocalVar = "";
    let stageStepStatusLocalVar = "";
    let stageStepStatusTypeLocalVar = "";
    let loadedStatusColorIndicatorLocalVar = "";
    let loadedStatusLocalVar = false;
    let stageStepStatusColorIndicatorLocalVar = "";
    let startProcessStatusLocalVar = "";
    let startProcessStatusColorIndicatorLocalVar = "";
    let startProcessBtnDisabledLocalVar = false;

    let bill_20_O_Quantity_LocalVar = 0; 
    let bill_50_O_Quantity_LocalVar = 0;
    let bill_100_O_Quantity_LocalVar = 0;
    let bill_200_O_Quantity_LocalVar = 0;
    let bill_500_O_Quantity_LocalVar = 0;
    let bill_1000_O_Quantity_LocalVar = 0;
    let bill_Fake_Quantity_LocalVar = 0;


    // let bill_20_O_Total_LocalVar = 0;
    // let bill_50_O_Total_LocalVar = 0;
    // let bill_100_O_Total_LocalVar = 0;
    // let bill_200_O_Total_LocalVar = 0;
    // let bill_500_O_Total_LocalVar = 0;
    // let bill_1000_O_Total_LocalVar = 0;
    // let grand_total_LocalVar = 0;


    $scope.bill_20_O_Quantity = 0;
    $scope.bill_50_O_Quantity = 0;
    $scope.bill_100_O_Quantity = 0;
    $scope.bill_200_O_Quantity = 0;
    $scope.bill_500_O_Quantity = 0;
    $scope.bill_1000_O_Quantity = 0;
    $scope.bill_Fake_Quantity = 0;

    $scope.bill_20_O_Total = 0;
    $scope.bill_50_O_Total = 0;
    $scope.bill_100_O_Total = 0;
    $scope.bill_200_O_Total = 0;
    $scope.bill_500_O_Total = 0;
    $scope.bill_1000_O_Total = 0;

    $scope.bill_20_O_Bill = 20;
    $scope.bill_50_O_Bill = 50;
    $scope.bill_100_O_Bill = 100;
    $scope.bill_200_O_Bill = 200;
    $scope.bill_500_O_Bill = 500;
    $scope.bill_1000_O_Bill = 1000;


    $scope.grand_total = 0;


    let bill20Classification = [
        "20", "FILIPINO", "NATIONAL", "LANGUAGE", "1935", "DALAWAMPUNG", "MANUEL", "QUEZON", "MALACAÑAN", "PALACE", "Asian", "Palm", "Civet", "Paradoxurus", "hermaphroditus","BANAUE", "RICE", "TERRACES", "UNESCO", "World", "Heritage", "Site"
    ];

    let bill50Classification = [
        "50", "FIRST", "NATIONAL", "ASSEMBLY","1907", "LIMAMPUNG", "SERGIO", "OSMENA", "OSMEÑA", "LEYTE", "LANDING", "OCTOBER", "1944", "Taal", "Lake", "Maliputo"
    ];

    let bill100Classification = [
        "100", "CENTRAL", "BANK", "PHILIPPINES", "1949", "SANDAANG", "MANUEL", "ROXAS", "INAUGURATION", "THIRD", "REPUBLIC", "JULY", "1946", "Mayon", "Volcano", "Whale", "Shark"
    ];

    let bill200Classification = [
        "200", "DECLARATION", "PHILIPPINE", "INDEPENDENCE", "KAWIT", "CAVITE", "JUNE", "1898", "EDSA", "PEOPLE", "POWER", "JANUARY", "2001", "DALAWANDAANG", "DIOSDADO", "MACAPAGAL", "OPENING", "MALOLOS", "CONGRESS", "BARASOAIN", "CHURCH", "SEPTEMBER", "1898", "Bohol", "ChocolateE", "Hills", "Tarsier", "Tarsius", "syrichta"
    ];

    let bill500Classification = [
        "500", "LIMANDAANG", "CORAZON", "AQUINO", "BENIGNO", "AQUINO", "EDSA", "PEOPLE", "POWER", "FEBRUARY", "1986", "MONUMENT", "Puerto", "Princesa", "Subterranean", "River", "National", "Park", "Blue-naped", "Parrot", "Tanygnathus", "lucionensis"
    ];

    let bill1000Classification = [
        "1000", "SANLIBONG", "JOSEPHA", "LLANES","ESCODA", "VICENTE", "LIM", "JOSE", "ABAD", "SANTOS", "CENTENNIAL", "PHILIPPINE", "INDEPENDENCE", "1998", "Tubbataha", "Reefs", "Natural", "Park", "UNESCO", "World", "Heritage", "Site", "South", "Sea", "Pearl", "Pinctada", "maxima"
    ];

    let invalidClassification = [
        "NO", "VALID", "VALUE", "PLAY", "MONEY"
    ];


    let clientId = "clinetId";

    // Create a client instance
    let client = new Paho.MQTT.Client("192.168.4.1", 8883, clientId);

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({
        timeout: 10,
        keepAliveInterval: 20,
        cleanSession: true,
        useSSL: false,
        userName : "mulesoft",
        password : "@Wiskyvodka101",
        onSuccess: onConnect,
        onFailure: function(err) {
        console.log("Error MQTT: ",err);
        }
    });


    function onConnect() {

        processStatusLocalVar = "";
        client.subscribe("detect_image");
        client.subscribe("start_process");
        client.subscribe("infra_sensor");
        client.subscribe("motor_a");
        client.subscribe("motor_b");
        client.subscribe("printer");
        client.subscribe("task");
    }


    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
            processStatusLocalVar = "onConnectionLost: "+responseObject.errorMessage
        }
    }

    function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);

    //  console.log(message.destinationName);

        if(message.destinationName == "start_process"){
            triggerStartProcess(message.payloadString);
        }

        if(message.destinationName == "infra_sensor"){
            moneyTrayLoadedIndicator(message.payloadString);
        }

        if(message.destinationName == "detect_image" || message.destinationName == "motor_a" || message.destinationName == "motor_b" || message.destinationName == "printer" || message.destinationName == "task" ){
            processStageStepIndicator(message.payloadString,message.destinationName);
        }

    }
    

   $interval(function() {
      
     $scope.startProcessBtnDisabled = startProcessBtnDisabledLocalVar;
     $scope.processStatus = (processStatusLocalVar == true ? "Started" : "Stoped");
     $scope.stageStepStatusType = stageStepStatusTypeLocalVar;
     $scope.stageStepStatus = stageStepStatusLocalVar;
     $scope.processStatusColorIndicator = processStatusColorIndicatorLocalVar;
     $scope.loadedStatusColorIndicator = loadedStatusColorIndicatorLocalVar;
     $scope.loadedStatus = loadedStatusLocalVar;
     $scope.stageStepStatusColorIndicator = stageStepStatusColorIndicatorLocalVar;
     $scope.startProcessStatus = startProcessStatusLocalVar;
     $scope.startProcessStatusColorIndicator = startProcessStatusColorIndicatorLocalVar;
     
   }, 100);

   const canvasImage = document.getElementById('canvasElement');

    let takeSnapPicture = function(){


         canvasImage.toBlob(function(blob) {


        
            ai_model.detectModel(
                blob, 
                function(response){
                     if(response.status == 200){  

                        console.log(response);

                        let scanText = response.data.results[0].entities[0].objects[0] === undefined ? null : response.data.results[0].entities[0].objects[0].entities[0].text;
                        console.log("Recognized Data: ",scanText);



                        // bill_20_O_Quantity_LocalVar += 1;
                        // bill_50_O_Quantity_LocalVar += 1;
                        // bill_100_O_Quantity_LocalVar += 1;
                        // bill_200_O_Quantity_LocalVar += 1;
                        // bill_500_O_Quantity_LocalVar += 1;
                        // bill_1000_O_Quantity_LocalVar += 1;

                        var scanTextValues = scanText.split(/\n| /);

                        const bill20ClassificationValues = bill20Classification.map(value => scanTextValues.indexOf(value));
                        const bill50ClassificationValues = bill50Classification.map(value => scanTextValues.indexOf(value));
                        const bill100ClassificationValues = bill100Classification.map(value => scanTextValues.indexOf(value));
                        const bill200ClassificationValues = bill200Classification.map(value => scanTextValues.indexOf(value));
                        const bill500ClassificationValues = bill500Classification.map(value => scanTextValues.indexOf(value));
                        const bill1000ClassificationValues = bill1000Classification.map(value => scanTextValues.indexOf(value));
                        const invalidClassificationValues = invalidClassification.map(value => scanTextValues.indexOf(value));
 
                        var matrixClassification = [
                            {
                                "bill": "20",
                                "size": bill20ClassificationValues.filter((index) => index != -1 ).length
                            },
                            {
                                "bill": "50",
                                "size": bill50ClassificationValues.filter((index) => index != -1 ).length
                            },
                            {
                                "bill": "100",
                                "size": bill100ClassificationValues.filter((index) => index != -1 ).length
                            },
                            {
                                "bill": "200",
                                "size": bill200ClassificationValues.filter((index) => index != -1 ).length
                            },
                            {
                                "bill": "500",
                                "size": bill500ClassificationValues.filter((index) => index != -1 ).length
                            },
                            {
                                "bill": "1000",
                                "size": bill1000ClassificationValues.filter((index) => index != -1 ).length
                            },
                            {
                                "bill": "Invalid",
                                "size": invalidClassificationValues.filter((index) => index != -1 ).length
                            }

                        ];

                        console.log("Matrix :" ,matrixClassification);
                    
                        const highestObjectSearchBill = matrixClassification.reduce((prev, current) => (prev.size > current.size) ? prev : current);

                        $scope.bill_20_O_Quantity += (highestObjectSearchBill.bill == "20" ? 1 : 0);
                        $scope.bill_50_O_Quantity += (highestObjectSearchBill.bill == "50" ? 1 : 0);
                        $scope.bill_100_O_Quantity += (highestObjectSearchBill.bill == "100" ? 1 : 0);
                        $scope.bill_200_O_Quantity += (highestObjectSearchBill.bill == "200" ? 1 : 0);
                        $scope.bill_500_O_Quantity += (highestObjectSearchBill.bill == "500" ? 1 : 0);
                        $scope.bill_1000_O_Quantity += (highestObjectSearchBill.bill == "1000" ? 1 : 0);
                        $scope.bill_Fake_Quantity += (highestObjectSearchBill.bill == "Invalid" ? 1 : 0);

                        $scope.grand_total_value = (
                            ($scope.bill_20_O_Quantity * 20) +
                            ($scope.bill_50_O_Quantity * 50) +
                            ($scope.bill_100_O_Quantity * 100) +
                            ($scope.bill_200_O_Quantity * 200) +
                            ($scope.bill_500_O_Quantity * 500) +
                            ($scope.bill_1000_O_Quantity * 1000) 
                        );


                        bill_20_O_Quantity_LocalVar = $scope.bill_20_O_Quantity; 
                        bill_50_O_Quantity_LocalVar = $scope.bill_50_O_Quantity;
                        bill_100_O_Quantity_LocalVar = $scope.bill_100_O_Quantity;
                        bill_200_O_Quantity_LocalVar = $scope.bill_200_O_Quantity;
                        bill_500_O_Quantity_LocalVar = $scope.bill_500_O_Quantity;
                        bill_1000_O_Quantity_LocalVar = $scope.bill_1000_O_Quantity;
                        bill_Fake_Quantity_LocalVar = $scope.bill_Fake_Quantity;

                        triggerAIDetectionTaskDone(highestObjectSearchBill);


                        
                    }
                }
            );

        }, 'image/jpeg');
    }

    let sendStartProcess = function(){

        let data = {
            "process": {
                "status": true
            } 
        };
        let dataJSON = JSON.stringify(data);

        let message = new Paho.MQTT.Message(dataJSON);
        message.destinationName = "start_process";
        client.send(message);

    }

    let triggerStartProcess = function(obj){
            
        let dataJSON = JSON.parse(obj);

        console.log(dataJSON);
       
        if(dataJSON.process.status == false){
            stageStepStatusLocalVar = "";
            startProcessStatusColorIndicatorLocalVar = "red";
            startProcessStatusLocalVar = "Stopped";
            startProcessBtnDisabledLocalVar = false;
            stageStepStatusLocalVar = "";
            stageStepStatusColorIndicatorLocalVar = "";
            stageStepStatusTypeLocalVar="";
        }
        else{
            startProcessStatusColorIndicatorLocalVar = "green"; 
            startProcessStatusLocalVar = "Started";
            startProcessBtnDisabledLocalVar = true;
        }
    }

    let triggerAIDetectionTaskDone = function(obj){
            
        let data = {
            "detectImage": {
                "job": "done",
                "bill": obj.bill
            }
        };

        let dataJSON = JSON.stringify(data);

        let message = new Paho.MQTT.Message(dataJSON);
        message.destinationName = "task";
        client.send(message);

    }


    let moneyTrayLoadedIndicator = function(obj){
        let dataJSON = JSON.parse(obj);
    //    processStatusLocalVar  = dataJSON.process.status;
        loadedStatusColorIndicatorLocalVar = dataJSON.process.status == false ? "red" : "green";
        loadedStatusLocalVar = dataJSON.process.status == false ? "NO" : "YES";
    }


    let processStageStepIndicator = function(obj,step){

        let dataJSON = JSON.parse(obj);
    //    console.log(dataJSON);
        switch(step){

            case "detect_image":
                    stageStepStatusLocalVar = dataJSON.detectImage.status == false ? "Stopped" : "Started";
                    stageStepStatusColorIndicatorLocalVar = dataJSON.detectImage.status == false ? "red" : "green";
                    stageStepStatusTypeLocalVar = "Counter AI Detection";
                    if(dataJSON.detectImage.status == true && dataJSON.detectImage.status == true){
                        console.log("Trigger AI");
                        doAIDetection();
                    }
                break;
            case "motor_a":
                    stageStepStatusLocalVar = dataJSON.motor1.status == false ? "Stopped" : "Started";
                    stageStepStatusColorIndicatorLocalVar = dataJSON.motor1.status == false ? "red" : "green";
                    stageStepStatusTypeLocalVar = "Counter Motor A";
                break;
            case "motor_b":
                    stageStepStatusLocalVar = dataJSON.motor2.status == false ? "Stopped" : "Started";
                    stageStepStatusColorIndicatorLocalVar = dataJSON.motor2.status == false ? "red" : "green";
                    stageStepStatusTypeLocalVar = "Counter Motor B";
                break;
            case "printer":
                    // stageStepStatusLocalVar =  dataJSON.printer.status == false ? "Done" : "Started";
                    // stageStepStatusColorIndicatorLocalVar = dataJSON.printer.status == false ? "red" : "green";
                    // stageStepStatusTypeLocalVar = "Printing";

                    // if(dataJSON.printer.status == false){
                    //     startProcessStatusColorIndicatorLocalVar = "red";
                    //     startProcessStatusLocalVar = "Stopped";
                    //     startProcessBtnDisabledLocalVar = false;
                    // }
                break;
            case "task":
                console.log("Task Status");
                console.log(dataJSON);
                if( dataJSON.motor2 != undefined){ 
                    console.log("Motor 2 Stop");
                    console.log(dataJSON.motor2.job);
                    console.log(loadedStatusLocalVar);
                    
                    if(dataJSON.motor2.job === "done" && loadedStatusLocalVar == "YES"){
                        console.log("Continue...");
                        sendStartProcess();
                    }
                    
                    if(dataJSON.motor2.job === "done" && loadedStatusLocalVar == "NO"){
                        console.log("Printing ...");
                        triggerPrintData();
                    }
                }
                
                break;
            default: 

        }
    }

    let triggerPrintData = function(){
        
        var data = {
            "printer": {
                "job": "done"
            },
            "detected": {
                "20": bill_20_O_Quantity_LocalVar,
                "50": bill_50_O_Quantity_LocalVar,
                "100": bill_100_O_Quantity_LocalVar,
                "200": bill_200_O_Quantity_LocalVar,
                "500": bill_500_O_Quantity_LocalVar,
                "1000": bill_1000_O_Quantity_LocalVar,
                "fake": bill_Fake_Quantity_LocalVar
            }
        };


        let dataJSON = JSON.stringify(data);

        let message = new Paho.MQTT.Message(dataJSON);
        message.destinationName = "printer";
        client.send(message);

    }

 
    const video = document.getElementById('videoElement');
    const canvas = document.getElementById('canvasElement');
    const ctx = canvas.getContext('2d');
   

    let captureFrame = function () {
        // Draw the current frame of the video onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    let doAIDetection = function(){
        captureFrame();
        takeSnapPicture();
    }


    //$scope.startProcessBtnDisabled = true;
    /**
     * Button Click
     */
    $scope.startProcess = function(){
        console.log("startProcess");
        sendStartProcess();
    }
    
    $scope.mockDetection = function(){
        console.log("mockDetection");
       // triggerAIDetection();
       
       captureFrame();
       takeSnapPicture();
    }


}]);

app.factory('ai_model',[
    '$http',
    function(
        $http,
    ){
		var service = {};
        service.detectModel = function (
            image,
            callback
        ){  

            var formData = new FormData();
            formData.append('image', image);
            $http({
                method: "POST",
                url: 'https://demo.api4ai.cloud/ocr/v1/results',
                data: formData,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    "Accept": "*/*",
                    'A4A-CLIENT-APP-ID': 'sample'
                }
                

            }).then(
               function(response){  callback(response); },
               function(response){  callback(response); }
            );
        }

        return service;
    }
]);


