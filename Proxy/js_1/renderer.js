

var app = angular.module('ai', []);
app.controller('ai_controller',[ 
'$scope',
'$window',
'$interval',
'$rootScope',
function(
    $scope,
    $window,
    $interval,
    $rootScope
){

    let detectec_list_obj = [];
    let remedes = [
        { id : '1', remede : 'Insecticides', description : 'Pamatay Peste'},
        { id : '2', remede : 'Herbicides', description : 'Pamatay Damo'},
        { id : '3', remede : 'Rodenticides', description : 'Pamatay Sira'},
        { id : '4', remede : 'Bactericides', description : 'Pamatay Bacteria'},
        { id : '5', remede : 'Fungicides', description : 'Pamatay Bun-i'},
        { id : '6', remede : 'Larvicides', description : 'Pamatay sa Od'},
    ]; 

    $scope.list_solution = [];

    const video = document.getElementById('gum-local')
    const canvas = document.getElementById('canvas')

    objectDetector.load('/model_web').then(model => detectFrame(model))
    
    
    const detectFrame = async model => {
        const predictions = await model.detect(video)
        renderPredictions(predictions)
        requestAnimationFrame(() => {
            detectFrame(model)
        }) 
    }

    const renderPredictions = predictions => {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        // Font options.
        const font = '16px sans-serif'
        ctx.font = font
        ctx.textBaseline = 'top'
        predictions.forEach(prediction => {
            const x = prediction.bbox[0]
            const y = prediction.bbox[1]
            const width = prediction.bbox[2]
            const height = prediction.bbox[3]
            const label = `${prediction.class}: ${prediction.score.toFixed(2)}`
            // Draw the bounding box.
            ctx.strokeStyle = '#FFFF3F'
            ctx.lineWidth = 5
            ctx.strokeRect(x, y, width, height)
            // Draw the label background.
            ctx.fillStyle = '#FFFF3F'
            const textWidth = ctx.measureText(label).width
            const textHeight = parseInt(font, 10) // base 10
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4)
        })

        predictions.forEach(prediction => {
            const x = prediction.bbox[0]
            const y = prediction.bbox[1]
            const label = `${prediction.class}: ${prediction.score.toFixed(2)}`
            // Draw the text last to ensure it's on top.
            ctx.fillStyle = '#000000'
            ctx.fillText(label, x, y)          
        }) 

        detectec_list_obj = predictions;

    }

    if (Hls.isSupported()) {
        const config = { liveDurationInfinity: true }
        const hls = new Hls(config)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play()
        })
    }


    let add_recomendation = function( val_obj ){
        let found = $scope.list_solution.some(el => el.id === val_obj.id);
        if (!found) $scope.list_solution.push(val_obj);    
    }

    let cause_by = function( value ){
        
        if(value.class == "rat"){            
            add_recomendation(remedes[3]);
        }

        if(value.class == "larva"){            
            add_recomendation(remedes[6]);
        }

        if(value.class == "worm"){            
            add_recomendation(remedes[1]);
        }

        if(value.class == "grass"){            
            add_recomendation(remedes[2]);
        }

        if(value.class == "steam_yellow"){            
            add_recomendation(remedes[4]);
        }

    }

    $interval(function() {
        
        $scope.list_detected = detectec_list_obj;
        $scope.list_solution = [];
        angular.forEach( $scope.list_detected, function(value, key){
            cause_by( value );
        });

    }, 10);
}]);
