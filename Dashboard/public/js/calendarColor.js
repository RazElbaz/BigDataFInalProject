function getConsumptionRating(consumption_num) {
    const consumptionRatings = [
            {value: 1, label: 'zero'},
            {value: 20, label: 'low'},
            {value: 60, label: 'average'},
            {value: 120, label: 'high'},
            {value: Infinity, label: 'very high'}
        ];
    let label;

    consumptionRatings.some(function (a) {
        if (consumption_num <= a.value) {
            label = a.label;
            return true;
        }
    });
    return label;
}

const dateSelectedEvent = (selectedDate) => {
    console.log('clicked....')
    // Get today's Date
    const currentDate = new Date();

    if (currentDate >= selectedDate) return;

    // Build selected date as following format: day-month-year
    let day = selectedDate.getDate();
    let month = selectedDate.getMonth() + 1;
    let year = selectedDate.getFullYear();
    let selectedDateFormat = `${day}-${month}-${year}`;

    // current day detail as string
    let dayName = currentDate.toLocaleDateString('default', {weekday: 'long'});
    let monthName = currentDate.toLocaleDateString('default', {month: 'long'});

    console.log(selectedDateFormat);

    // Check if the store and flavor dropdowns aren't empty (the user picked a store and a flavor)
    let store_select = document.getElementById("store_select");
    const storeName = store_select.options[store_select.selectedIndex].text;

    let flavor_select = document.getElementById("flavor_select");
    const flavor = flavor_select.options[flavor_select.selectedIndex].text;

    if (flavor != null && storeName != null && flavor != 'Select Flavor' && storeName != 'Select Store') {

        $.ajax({
            url: `/dashboard/train_model/api/${storeName}/${flavor}/${selectedDateFormat}`,
            type: "GET"
        }).done(function (response) {
            console.log("res " + response)
            let consumptionRate = [response['response']].map(getConsumptionRating)
            document.getElementById("prediction_paragraph").innerText = `Day: ${dayName}, Month: ${monthName}, Season: , Holiday: , Weather: ,Settlement-Size: ,Population-Type: ,
            Children: , Seniors: , Adults: Middle-Age: Elderly:`;
            // Update result paragraph
            document.getElementById("prediction_result").innerText = `The ice cream consumption forecast on ${dayName} ${day}/${month} is ${consumptionRate}`;
        }).fail(function (response) {
            console.log(response)
        }).always(function () {
            console.log(flavor)
        });
    }

}

let calB = new Calendar({
    id: "#calendar",
    theme: 'glass',
    primaryColor: "#1a237e",
    weekdayType: "short",
    border: "5px solid rgba(4, 64, 160, 0.1)",

    // Whenever date is changed an ice cream consumption api request
    // is sent to the server.
    dateChanged: (selectedDate, events) => dateSelectedEvent(selectedDate),
    selectedDateClicked: (selectedDate, events) => dateSelectedEvent(selectedDate)
});