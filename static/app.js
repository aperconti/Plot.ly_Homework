d3.json("../data_samples.json").then((importedData) => {

    var select = d3.select('#selectID');

    var options = select
        .selectAll('option')
        .data(importedData.names).enter()
        .append('option')
        .text(function (d) { return d; });
});

// Submit Button handler
function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input value from the form
    var individual = d3.select("#selectID").node().value;
    console.log(individual);

    // clear the input value
    d3.select("#selectID").node().value = "";

    // Build the plot with the new stock
    buildPlot(individual);
}

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selectID").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
    // Use D3 to select the dropdown menu
    var individual = d3.select("#selectID").node().value;
    console.log(individual);

    // Use D3 fetch to read the JSON file
    // The data from the JSON file is arbitrarily named importedData as the argument
    d3.json("../data_samples.json").then((importedData) => {
        for (var i = 0; i < importedData.samples.length; i++) {
            if (importedData.samples[i].id === individual) {
                var data = importedData.samples[i];
                break;
            }
        }

        // 1) 'zip' the arrays together, so that we can sort them:
        var zipped_list = [];
        for (var j = 0; j < data.sample_values.length; j++) {
            zipped_list.push({ 'sample_values': data.sample_values[j], 'otu_ids': data.otu_ids[j], 'otu_labels': data.otu_labels[j] });
        }

        // Verify lists have been zipped
        // console.log(zipped_list);

        // 2) Sort by comparing the `sample_values` value in zipped_list:
        //    We then "grab" the top 10 using slice(0, 10)
        zipped_list = zipped_list.sort(function (a, b) {
            return b.sample_values - a.sample_values;
        }).slice(0, 10).reverse();

        // Verify everything looks ok
        // console.log(zipped_list);

        var sample_values = []
        var otu_ids = []
        var otu_labels = []
        //3) separate them back out:
        for (var k = 0; k < zipped_list.length; k++) {
            sample_values[k] = zipped_list[k].sample_values;
            otu_ids[k] = "OTU " + zipped_list[k].otu_ids;
            otu_labels[k] = zipped_list[k].otu_labels;
        }

        // console.log(sample_values)
        // console.log(otu_ids)
        // console.log(otu_labels)

        var trace1 = {
            x: sample_values,
            y: otu_ids,
            type: "bar",
            orientation: "h"
        };

        // data
        var chartData = [trace1];

        // // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", chartData);


        var trace2 = {
            x: otu_ids,
            y: sample_values,
            // test: "",
            // text: otu_ids,
            // name: "Greek",
            type: "bubble",
            mode: 'markers'
            // orientation: "h"
        };

        // data
        var data = [trace2];

        // // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bubble", data);
    });

    // Add event listener for submit button
    d3.select("#submit").on("click", handleSubmit);
};

