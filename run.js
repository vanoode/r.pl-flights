var Horseman = require("node-horseman");
var nodemailer = require('nodemailer');
var config = require('./config.js');

for (var i = 0;i < config.links.length; i++ ) {
    new Horseman()
        .userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
        .open(config.links[i])
        .evaluate(function() {
            return {
                seats: $('#IloscOsob-menu li:last a').html(),
                price: $('#CenaCalkowita').html(),
                dateFrom: $('.zlozonaData').first().find('.dzien').html(),
                dateTo: $('.zlozonaData').last().find('.dzien').html(),
                from: $('.miastoKrajWylotu').first().html().split(',')[0],
                to: $('.miastoKrajPrzylotu').first().html().split(',')[0],
                url: window.location.href
            }
        })
        .then(function(details) {
            sendMail(details);
        })
        .screenshot('details.png')
        .close();
}

function sendMail(data) {
    var transporter = nodemailer.createTransport(config.transporter);
    var content = data.from + ' (' + data.dateFrom + ') => ' + data.to + ' (' + data.dateTo + '), Cena: ' + data.price + ', Ilość miejsc: ' + data.seats;
    var mailOptions = {
        from: config.from,
        to: config.to,
        subject: content,
        text: content,
        html: '<b>' + content + '</b><br/><a href="' + data.url + '">Link do lotu</a>',
        attachments: [
            {
                filename: 'details.png',
                path: 'details.png'
            }
        ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}