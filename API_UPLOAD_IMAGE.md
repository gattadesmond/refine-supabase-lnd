# Development Guide

Đây là cURL của API upload image
curl 'https://sa.mservice.io/momovn-cms/api/v2/upload/base64_v2' \
 -H 'accept: application/json' \
 -H 'accept-language: en-US,en;q=0.9,vi;q=0.8' \
 -H 'cache-control: no-cache' \
 -H 'content-type: application/json' \
 -H 'origin: http://localhost:3000' \
 -H 'pragma: no-cache' \
 -H 'priority: u=1, i' \
 -H 'referer: http://localhost:3000/' \
 -H 'sec-ch-ua: "Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"' \
 -H 'sec-ch-ua-mobile: ?0' \
 -H 'sec-ch-ua-platform: "macOS"' \
 -H 'sec-fetch-dest: empty' \
 -H 'sec-fetch-mode: cors' \
 -H 'sec-fetch-site: cross-site' \
 -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' \
 -H 'x-user-token: AEJAMWEIQMUAN@991HSOAHQYFJAHQKAGQEO-32WKAKAUIWUCNAPKQK' \
 --data-raw '{"File":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAoCAYAAACiu5n/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA+2SURBVHgBtVoJfJRFsq/+rrknyeQakgABYlB4y7EhKDdqhAgPECEhch8rT3EREF1ZRIy4oIi7/ATlFhAMVxAfRAg3wQU5JCDIfYQjJASSkGQy13f26/kIcWYyuVhf/X6Tme/r6qr6d3VXV1cHQe2Eqr5xeno6lbaxTe/W7cSxAi7vBhhZyWtM2go4rengphtH1r52fMWJKn6KfBT4Y6jaBqIMnU/+tNd/WaJG87yjO0I4CjBNtClFHGs6kJGXs27k8W+OevXDdQmsrQ1v6T6lWUp835VYyktyODBl1IcRJbRAxHnaWcFRDJwhTLG7K7b+Wpj3Ro8jn5X9gaBVOTsTJ1n7tX1pGXY9/G+H6KCNBo8NrAhYIVYgTnCUAKcPxXZXRdaV4sIJnXLSS0g/MhogBwJVq6KjiXM7dG0bux87naHAaNwImO+yb/57Z55QeYejGCIQtxgVnzRAq8jDsSJTSG/Jv19+vZ/1h/fOe8nG0Hiq7ns0eUZi1/D2P2LBEUFA8ogxZOy+nrP7Jv8wj2K0iAKp6agWSa9oaTSCDAANWnNhiTPv+fDN069CAE+jWpThax23hMd1Cjsv265FUIg7d028N6z19zMvB7Lu6Ivvdulq7bTB7iqJNZqszl8LzqV23D9np7c8aBxYlV+auCmFFtkM2V7CIoa7cqs4P6XV/tm/BeqU9cJbf+4R3HqTgdI8xZjC884V/Nyu/d4vHOCnnwrQV22Mi4xaJjjPRCi0Pm/O5e29qsAi8B0k9bnbgS+OFRTldTKGxBzHrnJ9e0vcj+Kk72Z4y2sEqfz8iHXzkc29RXKUsrQ+ZF/GhYMJVWAD2jDg4NenV14/1J0JiS3EjtKWbc1PLwokPOCUPt5nRsKzUS1PgmyBr85vfXbymU2noG5PqeslBVLoNalJKw2cfpyr0g4ySy9ZfmXP4n33rulD9bpqXQqDESgyjWVKoRFVvdYfoFLlE5jt7pyoe59ibGOA1gJozIs+bpY7jQROpR4b1GWY3WNK3+ToDrtBaxK/v7K33dBjKy7XC/hM0qyP2kfEpyPOtBmtHZwGDZuW1TzOYWve03HcZ253JaXlTBhoFvvEMIyQ5w/pQoIOxr42V4DgEilOHyH9dPvE1F45C76GhscD1QZx5LpsxeVI5ml6onnLxJXeDEygXi5F7IE4A5wtPL0XGk64ymJFv3ncAsew1Vf1hvCFIAssYFn2MwtXd8HYa9A9bEaGCzI7TuYde5OAPQhPEPwY2pgtIUeyg7fH1Gjze1ZHqFISTIBoYop8vx5l/p5/7EbKsHn89olRA/YJXD4nMpoGb1FYcNKhXIxz8fVsHgKDRXU8q9+ytbgEXeKIMc4m/vL9AasdEoKbUSC7MYM4B9RO1YpWJY55sYi3tW3KBV8cc2rNAXgEHK0ozHKSbyc0mn6rYRN4gT/0ytTgW/lOa4noyn/v3HoH+A0MfTPeKep+82gOT4AENhdyRagFMOx6ebImNDzOjJ2lCksxdoC6AUuj1y6mactfiWuIJhZS43p+O3/TuPHpT7b/+pMPWBK40PQbTT4xGiLfgGAwgFT5YFTTDpOtO6fvgEfLSeWvOKO1m3soGDtxGEQBC4VQDbjGtnTydhER5DaTDAZzLlxZuy2gbO86+U2aDv6r03bbDU73IbG82MGx2jHD+84bA38M4MfkkYWnX2z6gVHWfyAU37eA6MSYdzWLDIrZZp/4TR/wioqr9fNtCMfKCmCLwBRrvAXVAOyg7CHky+jhfudSBu/X7BPV+7d4NhmT1LJQKf4SbRn5Al0ZvsSTdRbypaPq6vck9H7LpCCjKfxNQagkcdA+9VfH1agyybGKd5fRBipkkjevXhtiJ1mXgLFixm43591WA7Bb4EOJeXpMYalAEGU/XtVrvXv3VpcCTXOShyEURd70PP+CjxQAmIGlWLU9ISGBreqLIXCS02B6QPHRxKthNKuxO1Dwmo7/m15Oy8xyVkMcaCc2ewOWWA9gnkIUbSAz35tqrGGnLFiIbRSFkc2sYx8HHI+HlPTe6cw4k256uME6GFKGSyRpb0OTdUu2lmAPk4kxBQFfAZ0szdrbUpYfZhGlc7ayZx3YEj0vFVJlaHyaWU3NNdbr5JRyFVwVbe8LD1bs7z3t2yBT8ByXww66FsFX/EARuxVXGKdnf+r1Yagmc/x9rzZfsjJmDSgSKBSUlFsNLij4ve3DZu2WK0L5eIYiduvCSfwnsUCjB+He1XxPe4XbfQuMEUCOL2ZyuOhJPAK05E5MGf7U0+kbYFR6w05QAffd9AuZQv8m8R90iun4/TMI0tpaYtMkwQk6S2xh3vUTc7x5Q0PNLpLX8DQCnYJdnr34Yq2A//ZMsl5ylgPFaYsG5Oa6c6uUz2o3sDUl2sZSNOM4XHhu5vaCs/lGWm9qYtLbDjnO7fIwzTw0b0NKxWtlRXxliEvkK58LbRE9pEWPT4A+PTyoc8pXcDLzGNQPVgWa0XVShwL7/Wea6UJupp1YddzzLnH/3O3n+s5K/lNUwtuK6I62y9L5HZc2zhxzbF2Bd9/QUpsAkdiFMRXGUEqUt4IagN1koes9PyjmfrqXR/7StEccZvQIsfhB70NfBErMNTkk5885vTHL+yV+KmmsyEsJE+Nejph2MhPqI0xcI6ZsXMgG6d8CSWGApiC1Vc9tu8t+Gd4vezHfbs8/9hO2/RNJfFiRW72/+py/5+euUBY1iZMiDBZWkoW6AZMKglkdKiQWeb/+8m72r59bUni5HMXi1G+2k+T8JtAkI3MkuD4+PG9O+v31D5b8qX/I4FZJs6xhcSEgu2zAu5tXVhZ1NJkjlA3Xss9D3aSq3ff827Nf0vecAvYywSFL5ww02xJx+lfNvH4BaX/7MTgvsGp88RZEhhXPJWsvElEsSRd90ssakZNkvWbaYIEVF3d7Z0ho4dmDBVR5x+maYBMSQRkou8qnuCsqxyvsobcmdG+T6mF6Je6lsdagmHdcZbfHyfaKKbLIv2IKMlF20T1t7M/f3oC6CXuCYlLUc6+B6IJN+cenGDNfb7/2Zs7rILqhW3T74dPa9LVAzTgQKAiSqYHukNlCljGO8G6o4WGMsZmUcKBSEAQ/oYjOem7JB+37npr21MAhtCTxZPSHKSIbbwSTutfds5fqrFqLh/tWueRcRbFKMHMxcYf5ZPd/QwMOARX8BRbpEymwPwCdWzjjeWdldGdIPgegtbChmDaRVw+hAYQAFT76RdF1AUbk7BLsKZkxNBtQ8Nyze056Pqrlo7e2lt1l8ZIiqRmZIEl2pDXBqaILd3oemj83QPc6t6SFxzJdc6KeP2tguPhBcT02uVp3X6nF1DBSPgLnw7u/zLq06zY0kCiavvfol+ID2GdKk0SbIW5Q91QK4xKox1hequAoIqKMt3X1TMfO1qc7ANkqyFQKlIM3aP89ePf0ZGRpfp7IiEUCP1dRpHaIVDF+KrvxP1UsDcragjSmAkVRVfo41QdwlCfRxtizToClawCuadyd3NXIGImbakPHftSkRb4oOMaQQhtEG0P+CU9G1KATq+5nnF7brdzt/rvGbM2089InX/22IbHfwQU3wCvbq4+23jhyn8xST63BB7DPQz5XysmgZk0CizWl9cik+h1ZklVp6TrJaI2ZT3JSq8YY4qp0FM2Oy/r744N7Y7MqT0CiRp7IsJGd+DN/fdCI0u+K2yfFcW37EyS4dsBFJW5WURQjMdXFMWx9wUENZKYdI5d90238jksPCto8Y4y+OOHMak+w+E8OC4FAIWhknTvKqBNI9YgkjMjHFh/Ab7Rrh/Qs4ykViFrPsaduqj6rTjiqgiz0Mq6uCglAzYoFQN2zodH5t6TQNiK4BgafNfxRh1HmEFbPkBqUC7NsfYDrNSYlJYXe0nFcuG3wV/FdYrroqniR57RVMvpf0ele+ncMmKi3pSxpPT2+dxjULMM2mnQMW0mU1QiePoDdhY7mJLKxQCFHmM3QUMD+8tQByB+0YHAGN/BgytO9rptM1sv7ur++qopHmcY/816oqd3dqWnLxlXx4wHhg9YYtCGX53ccdUUYkbHXU26t4n+io6VJwzkQhSoCGfg7ITmanPsJYMbZ57mnGgtYDSqeEpHz1eUbY4zWbbQk9CRXHzpguArORFUf0SJM5nJgjc4ym606mxNlezHF6uy0JsgMvC0pOa7Xbn5kxup0SH8crBrl6WZNWBfIuDyQkdXE0Cia3GmwLvsD+8cr7snQcKoOKi/Hd1/PITaN5GVyYWXx57NPrk7ccDW7JRt9690qPqrL3vlLLxbsjmyx62+bqmxAI5xbp/xwflvssos7Oksaw2Jw2TCniONmjIhb5qenQfRRTo6MKaruAqIwdOnXStpq+ULynOxGCK+++uDHrvmUH7Qc41EbFdvQlYNq4a21vzft6zVtHB6bKeO01ZhPy3i/6jUFjQCNR2TsE4YsPeT9zsfDJIrHkgyHMjBMMTQ8MqpR+Xa/Baksz87gzGYod5VNMG99fXsAMIFkYqgZtdFLhxeuyc0/+w6wOuA4Zl5+30+TobFXsKieoIWAUo/Ckoxc1a/qJnV9Hes788/NIuPWIpCg2Fm6KGTrpDXwewB7oss0D3U68I8vgdGvU/hKKiY0evO2zm/FV7U3zMsUqntbAkRdIbc9MkdTzaF+UtftxPgBYR2Dmu/C7godj5XsJd+XTPM3/AmoGtTHNxdOoLTm46RUaR7c5sXsPX3eNUBDI7eCwvxf+XRiGX0GqRDYm4a2evbbLm9EQ+2jqU5jnHCKXd757SwNQpHkLurm4YcXU0hUVaAROW8dpIJKz8mR/nn+hwGY0d1THMUt+8R021ZP5FYxZXSd0JwMUpeAjY8pU97xs0gxxxTXw+ChMe2/9FLsnwioYIQ2RzNk8fpzpKBnO3rnl5f7PrqA/iP/x0MdvHdzN5YsvJLVnzI14cXK4j4zh0Yvr8M2cuWA0fBWg1YrklPH6i1uqA1wamamfLr4+gyK1kpaRj9EGL5uVUrbtkbw9RY+lbBc7x65aCUlGFNoLgR23jiQ2v3Q51fgCXLeBpDqyemnNp2pqLgzmtFgYDndX271/+xfa3qP1frbpk75yZs3CPZ7L7iwUrj+yp4PvYX5TwnVe6VpS8dbOMsqzNuRWxFvlbjK1utp/RmZpKaMZOpg0bcYJVJXW7BMqCSCZgqXMWQJ/Ac15waSKl9+9dhMRZs7l8Gk+IGYq/kVd7/Tc9pzMsYMr/AJTXWRYwTeHcUZDdKd8tuvNv9xVpa/EP9n1Uv7np/aP6lJwnpFdIaQzOvRVa6nEckkMReAY0PKsm4fGTHw6FLvPfv/HbDnR96g9KGxuqZrZUkwUOpFwGPVFCjENobhCssd/PCQrEmHwc8R/wdWc8qNeYKxXgAAAABJRU5ErkJggg==","Folder":"Img","Size":4129,"Type":"image/png"}'

Data trả về là
{
"Result": true,
"Data": {
"Id": 0,
"FileName": "momo-amazone-s3-api-251016112055-638962104551470508.png",
"Thumb": "https://homepage.momocdn.net/img/momo-amazone-s3-api-251016112055-638962104551470508.png",
"Full": "https://homepage.momocdn.net/img/momo-amazone-s3-api-251016112055-638962104551470508.png",
"Folder": null,
"SubFolder": null,
"Width": null,
"Height": null
},
"Error": null
}

Cần lấy URL hình từ Data?.Full


Nếu xảy ra lỗi khi API trả về là 
{
    "Result": false,
    "Data": null,
    "Error": {
        "Code": -1,
        "Message": "Max file length 400KB",
        "Extension": null
    }
}

Hiển thị thông tin lỗi Error?.Message