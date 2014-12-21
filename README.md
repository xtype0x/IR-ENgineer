# 文E青年 -- 藏頭文產生器

## Environment

本次專案完全都由node.js進行開發喲～  
還沒安裝的快點安裝環境在電腦裡吧  

## Introduction

目前包含兩個資料夾  
wen-e資料夾是express弄出來的web框架，希望在此上面做應用的開發。  
crawler是抓PTT資料的程式。  

## Installation

crawler在使用前要先安裝一些套件，直接以下指令npm，要不要sudo還是-g不要我多說囉～  

`npm install iconv-lite`  
`npm install keypress`  

## About crawler

目前程式只開發到只能抓PTT 八卦版的部分  


簡單說明一下裡面的檔案：  

!! config_example.js 使用前先填完裡面的資料，並把檔案名轉成config.js，讓程式可以運行  
test.js是用來測試鍵盤的程式，可以不要屌他～  
ptt.js可以逛ptt，`node ptt.js`，還沒有做游標的處理哈哈哈～  
ptt_crawler.js才是主程式啊，去把ptt上的資料抓下來，目前先針對八卦版～～  