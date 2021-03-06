var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));	// JSONの送信を許可
app.use(bodyParser.json());							// JSONのパースを楽に（受信時）

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, response) {
	response.render('pages/index');
});

app.post('/callback', function(req, res) {
	var json = req.body;
	//ヘッダーを定義
	var headers = {
		'Content-Type' : 'application/json; charset=UTF-8',
		'X-Line-ChannelID' : process.env.LINE_CHANNEL_ID,
		'X-Line-ChannelSecret' : process.env.LINE_CHANNEL_SECRET,
		'X-Line-Trusted-User-With-ACL' : process.env.LINE_MID
	};
	// 送信相手の設定（配列）
	var to_array = [];
	to_array.push(json['result'][0]['content']['from']);
	console.log(to_array);
	// 送信データ作成
	var data = {
		'to': to_array,
		'toChannel': 1383378250,			//固定
		'eventType':'140177271400161403',	//固定
		"content": {
			"messageNotified": 0,
			"messages": [
				{
					"contentType": 1,
					"text": 'こんにちはだよーん！！',
				}
			]
		}
	};
	//オプションを定義
	var options = {
		url: 'https://trialbot-api.line.me/v1/events',
		proxy : process.env.FIXIE_URL,
		headers: headers,
		json: true,
		body: data
	};

	request.post(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
		} else {
			console.log('error: '+ JSON.stringify(response));
		}
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


