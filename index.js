fs = require('fs');
var swearL = []; //lista przekleństw
var confusable = new Map();
fs.readFile('./data/swears.dat', 'utf8', function (err, data) {
    if (err) {
        return console.log('❌ ' + err);
    }
    swearL = JSON.parse(data);
});
fs.readFile('./data/confusable.json', 'utf8', function (err, data) {
    if (err) {
        return console.log('❌ ' + err);
    }
    confusable = JSON.parse(data);
});
module.exports.filter=function(text){
    var remove = ['\'', '"', '.', ',', '*', '-', '_', '~',
        '|', '‎', '​', '‍', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '­',
        ':', ')', '(', '/', '!', '=', ';', '{', '}', '[', ']', '\\']; //lista znaków ignorowana przez bota  
    const lastchar = 383;
    text = ('^' + text + '^').split(' ').join('^');
    for (var key in confusable) {
        var value = confusable[key];
        text = text.split(key).join(value);
    }
    text = text.toLowerCase();
    for (var i = 0; i < remove.length; i++) {
        text = text.split(remove[i]).join('^');
    }
    for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) > lastchar) {
            text = text.split(text[i]).join('^');
            i--;
        }
    }
    const sliced = text.split('^');
    const spaceless = text.split('^').join('');
    let hasSwear = false, usedswear = "";
    for (var i = 0; i < swearL.length; i++) {
        if (text.includes(swearL[i])) {
            hasSwear = true;
            usedswear = swearL[i];
            break;
        }
        if (spaceless.includes(swearL[i].split('^').join(''))) {
            let swear = swearL[i].split('^').join('');
            for (k = 0; k < sliced.length; k++) {
                let part = '';
                let j = 0;
                do {
                    part += sliced[k + j];
                    if (part == swear) {
                        usedswear = swear;
                        hasSwear = true;
                        break;
                    }
                    j++;
                    if (j + k == sliced.length) break;
                    //console.log(swear.slice(0,part.length)+' '+part,i,j,k);
                } while (swear.slice(0, part.length) == part && swear.length > part.length);
            }
        }
        if (hasSwear) break;
    }
    return hasSwear;
}