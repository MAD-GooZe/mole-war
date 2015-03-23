#!/bin/bash

notify-send "Просчитываем бой..." -t 1
cd .files
node ./MoleWarTester.js -o ../result.html -s user idiot idiot clever -r 1 -m 50
notify-send "Готово! Запустите result.html" -t 1
