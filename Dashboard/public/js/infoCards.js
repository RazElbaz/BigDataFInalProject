var socket = io.connect();

function setWs() {
    socket.on('KafkaConsumerResponse', function (data) {
        let dataJSON;
        try {
            dataJSON = JSON.parse(data)
        } catch (e) {
            console.log(e);
        }
        console.log(dataJSON['special_week'] + ' ' + dataJSON['season'] + ' ' + dataJSON['Ice_cream_flavor'] + ' ' + dataJSON['amount'])
        const seasons = {"winter": "חורף", "spring": "אביב", "summer": "קיץ", "autumn": "סתיו"}
        const flavorsIndexMap = {"chocolate": 0, "vanilla": 1, "strawberry": 2, "lemon": 3, "halva": 4}

        // Update info cards' info
        let info_cards_html = `<div class="col-lg-6 col-md-6 col-sm-6">
                   <div class="card card-chart bg-dark">
                     <div class="card-body">
                         <h2 class="card-title-center">האם חג קרוב השבוע</h2>
                         <h4 class="card-title-center">${dataJSON['special_week'] === true ? "כן" : "לא"}</h4>
                      </div>
                   </div>
               </div>
               <div class="col-lg-6 col-md-6 col-sm-6">
                   <div class="card card-chart bg-dark">
                       <div class="card-body">
                           <h2 class="card-title-center">עונה נוכחית</h2>
                           <h4 class="card-title-center">${seasons[dataJSON['season']]}</h4>
                       </div>
                   </div>
               </div>`
        document.getElementById('info').innerHTML = info_cards_html

        // Update pie chart with new amount
        let pieChartAmount = myPieChart.data.datasets[0].data[flavorsIndexMap[dataJSON['Ice_cream_flavor']]]
        myPieChart.data.datasets[0].data[flavorsIndexMap[dataJSON['Ice_cream_flavor']]] = fixSub(pieChartAmount, dataJSON['amount'])
        myPieChart.update()

        // Update ice cream flavor amount in the flavor card
        console.log(document.getElementById(dataJSON['Ice_cream_flavor']).innerHTML + '-' + dataJSON['amount'])
        let flavorAmount = document.getElementById(dataJSON['Ice_cream_flavor']).innerHTML
        document.getElementById(dataJSON['Ice_cream_flavor']).innerHTML = fixSub(flavorAmount, dataJSON['amount'])
    })
}

function fixSub(num1, num2){
    return (10*num1 - 10*num2)/10;
}