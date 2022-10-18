var socket = io.connect();

function setWs() {
    socket.on('KafkaConsumerResponse', function (data) {
        let dataJSON;
        try {
            dataJSON = JSON.parse(data)
        } catch (e) {
            console.log(e);
        }
        console.log(dataJSON)
        console.log(dataJSON['special_day'] + ' ' + dataJSON['season'] + ' ' + dataJSON['Ice_cream_flavor'] + ' ' + dataJSON['amount'])

        // Update ice cream flavor amount in the flavor card
        console.log(document.getElementById(dataJSON['Ice_cream_flavor']).innerHTML + '-' + dataJSON['amount'])
        let flavorAmount = document.getElementById(dataJSON['Ice_cream_flavor']).innerHTML
        document.getElementById(dataJSON['Ice_cream_flavor']).innerHTML = fixSub(flavorAmount, dataJSON['amount'])

        // Get selected store and print it.
        var store_select = document.getElementById("store_select");
        var text = store_select.options[store_select.selectedIndex].text;
        //console.log('store select text ' + text)
    })
}

function fixSub(num1, num2){
    return (10*num1 - 10*num2)/10;
}
