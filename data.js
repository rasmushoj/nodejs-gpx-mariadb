// adapted from https://github.com/mscdex/node-mariasql

var inspect = require('util').inspect;
var Client = require('mariasql');

var client = new Client();

exports.connect = function() {
    client.connect
    (
	{
	    host: '127.0.0.1',
	    user: 'root',
	    password: 'password1',
	    db: 'running'
	}
    );

    client.on
    (
	'connect', function() { console.log('Client connected'); }
    ).on
    (
	'error', function(err) { console.log('Client error: ' + err); }
    ).on
    (
	'close', function(hadError) { console.log('Client closed'); }
    );
}

exports.insertPoint = function(lon, lat) {
// console.log('INSERT INTO trackpoints (gpsPoint) VALUES (PointFromText(:loc))', { loc: 'POINT(' + lon + " " + lat +  ')' });

    client.query('INSERT INTO trackpoints (gpsPoint) VALUES (PointFromText(:loc))', { loc: 'POINT(' + lon + " " + lat +  ')' })
    .on('result', function(res) {
	res.on('row', function(row) {
	    console.log('Result row: ' + inspect(row));
	})
	    .on('error', function(err) {
		console.log('Result error: ' + inspect(err));
	    })
	    .on('end', function(info) {
		console.log('Result finished successfully');
	    });
    })
    .on('end', function() {
	console.log('Done with all results');
    });
}

exports.getTrackPoints = function(trackId, httpRes) {
    var xys = [];

    client.query('SELECT X(GeomFromText(AsText(gpsPoint))) AS X, Y(GeomFromText(AsText(gpsPoint))) AS Y FROM trackpoints WHERE trackId = :pTrackId', { pTrackId: trackId })
	.on('result', function(res) {
	   
            res.on('row', function(row) {
		xys.push(row);
            })
		.on('error', function(err) {
                    console.log('Result error: ' + inspect(err));
		})
		.on('end', function(info) {
                    console.log('Result finished successfully');
		});
	})
	.on('end', function() {
            httpRes.send(xys);
	});
}

exports.disconnect = function() {
    client.end();
}