(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "city",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "value",
            alias: "pm 2.5 value",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "unit",
            alias: "unit",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lat",
            alias: "latitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "lng",
            alias: "longitude",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "date",
            dataType: tableau.dataTypeEnum.datetime
        }];

        var tableSchema = {
            id: "AirQualityFeed",
            alias: "Air Qulity in Seattle",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        //$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
        $.getJSON("https://api.openaq.org/v1/measurements?date_from=2019-03-25&parameter=pm25&coordinates=47.597,-122.3197&radius=200000", function(resp) {
            var feat = resp.results,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "city": feat[i].city,
                    "value": feat[i].value,
                    "unit": feat[i].unit,
                    "lat": feat[i].coordinates.latitude,
                    "lng": feat[i].coordinates.longitude,
                    "date": new Date(feat[i].date.local)
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Air Quality Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
