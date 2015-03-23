cd .files

start notify-send.exe -t 1200 "Please wait..." "Computing current battle"
node.exe ./MoleWarTester.js -o ../result.html -s user idiot idiot clever -r 1 -m 50

start notify-send.exe -t 3000 "Ready!" "View result.html"
