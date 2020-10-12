d3.json("./data_samples.json").then((importedData) => {

    var select = d3.select('#selectID');

    var options = select
        .selectAll('option')
        .data(importedData.names).enter()
        .append('option')
        .text(function (d) { return d; });

    updatePlotly();
});

// Submit Button handler
function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input value from the form
    var individual = d3.select("#selectID").node().value;
    // console.log(individual);

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
                var gauge = importedData.samples[i];
                var meta = importedData.metadata[i];
                break;
            }
        }

        console.log(gauge);

        // We need to sort 3 different arrays the same 'order', despite
        // them having no connection to each other.
        // Using answer from: https://stackoverflow.com/a/11499391

        // 1) 'zip' the arrays together, so that we can sort them:
        var zipped_list = [];
        for (var j = 0; j < gauge.sample_values.length; j++) {
            zipped_list.push({ 'sample_values': gauge.sample_values[j], 'otu_ids': gauge.otu_ids[j], 'otu_labels': gauge.otu_labels[j] });
        }

        // Verify lists have been zipped
        // console.log(zipped_list);

        // 2) Sort by comparing the `sample_values` value in zipped_list:
        //    We then "grab" the top 10 using slice(0, 10)
        zipped_list = zipped_list.sort(function (a, b) {
            return b.sample_values - a.sample_values;
        });

        // Verify everything looks ok
        // console.log(zipped_list);

        var sample_values = []
        var otu_ids = []
        var otu_ids_num = []
        var otu_labels = []
        //3) separate them back out:
        for (var k = 0; k < zipped_list.length; k++) {
            sample_values.push(zipped_list[k].sample_values);
            otu_ids.push("OTU " + zipped_list[k].otu_ids);
            otu_ids_num.push(zipped_list[k].otu_ids);
            otu_labels.push(zipped_list[k].otu_labels.split(";").join("<br>"));
        }

        // console.log(sample_values)
        // console.log(otu_ids)
        // console.log(otu_labels)

        var trace1 = {
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };

        // data
        var chartData = [trace1];

        // // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", chartData);

        var trace2 = {
            x: otu_ids_num,
            y: sample_values,
            text: otu_labels,
            // name: "Greek",
            type: "bubble",
            mode: 'markers',
            // orientation: "h",
            marker: {
                size: sample_values,
                sizemode: 'diameter',
                color: otu_ids_num,
                colorscale: 'Portland',
                type: 'heatmap'
            }
        };

        // data
        var gauge = [trace2];

        // // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bubble", gauge);

        // // adding data to metadata
        function buildTable(data) {
            // Remove table if it exists
            var deleteTable = d3.select("#table");
            deleteTable.remove();

            var table = d3.select("#sample-metadata").append('table');
            table.attr('class', 'table').attr('class', 'table-condensed');
            table.attr('id', 'table')
            var tbody = table.append("tbody");
            var trow;
            for (const [key, value] of Object.entries(data)) {
                trow = tbody.append("tr");
                var td = trow.append("td").append("b");
                td.text(`${key}:`);
                trow.append("td").text(value);

            }
        }

        buildTable(meta);

        var frequancyWashNum = meta[Object.keys(meta)[Object.keys(meta).length - 1]];

        var washes = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: frequancyWashNum,
                title: { text: "Belly Buttom Washing Frequency <br> Scrubs Per Week" },
                type: "indicator",
                mode: "gauge+number+delta",
                gauge: {
                    'axis': { 'visible': true }
                }
            }
        ];

        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', washes, layout);


    });

    // Add event listener for submit button
    d3.select("#submit").on("click", handleSubmit);

};
