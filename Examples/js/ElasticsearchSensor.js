(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "Humidity",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Temperature",
            //alias: "pm 2.5 value",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Light",
            //alias: "unit",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Soil",
            //alias: "latitude",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Wifi Signal",
            //alias: "longitude",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Wifi rssi",
            //alias: "longitude",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Light State",
            //alias: "longitude",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Water State",
            //alias: "longitude",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "Timestamp",
            dataType: tableau.dataTypeEnum.datetime
        }];

        var tableSchema = {
            id: "SensorFeed",
            alias: "Sensor Data from Elasticsearch",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        //$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
        $.getJSON("http://122.155.11.34:9200/mysensor/_search?q=*:*&sort=timestamp:desc&size=450", function(resp) {
            var feat = resp.hits,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "Humidity": feat[i]._source.humidity,
                    "Temperature": feat[i]._source.temperature,
                    "Light": feat[i]._source.light,
                    "Soil": feat[i]._source.soil,
                    "Wifi": feat[i]._source.wifi_signal,
                    "Wifi rssi": feat[i]._source.wifi_rssi,
                    "Water State": feat[i]._source.water_state,
                    "Light State": feat[i]._source.light_state,
                    "Timestamp": new Date(feat[i]._source.timestamp)
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
            tableau.connectionName = "Elasticsearch Sensor Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();