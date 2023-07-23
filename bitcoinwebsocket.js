var socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m')
var tradeDiv = document.getElementById('trades')

const label = 'BTCUSDT'
var price = 0
var time = 0

var chart = Highcharts.stockChart('chart', {
    rangeSelector: {
      selected: 1
    },
    title: {
      text: 'BTCUSDT Candlestick',
      style: {
        color: '#000000'
      }
    },
    series: [{
      type: 'candlestick',
      name: 'BTCUSDT',
      data: [],
      color: 'red',
      upColor: '#278827fa',
    }],
  });

socket.onmessage = function(event) {
    var messageObject = JSON.parse(event.data);
    var klineData = messageObject.k;

    // Extract candlestick data
    var time = Number(klineData.t);
    var open = Number(klineData.o);
    var high = Number(klineData.h);
    var low = Number(klineData.l);
    var close = Number(klineData.c);

    // Add the candlestick to the chart
    var existingPoint = findExistingCandlestick(time);
    if (existingPoint) {
      // Update the existing candlestick
      existingPoint.update({
        open: open,
        high: high,
        low: low,
        close: close,
      });
    } else {
      // Add a new candlestick to the chart
      chart.series[0].addPoint({
        x: time,
        open: open,
        high: high,
        low: low,
        close: close,
      });
    }


    tradeDiv.innerHTML = ''
    price = parseFloat(close).toFixed(2)
    exacttime = messageObject.E
    var date = new Date(exacttime)
    tradeDiv.append(`${label}: ${price}, Time: ${date.toString()}`);
};

function findExistingCandlestick(time) {
    var seriesData = chart.series[0].points;
    for (var i = 0; i < seriesData.length; i++) {
      if (seriesData[i].x === time) {
        return seriesData[i];
      }
    }
    return null;
}